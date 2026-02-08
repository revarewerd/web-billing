/**
 * =====================================================
 * Типы данных billing admin
 * =====================================================
 *
 * Каждый интерфейс соответствует коллекции в MongoDB (БД: Seniel-dev2).
 * Legacy хранил всё в MongoDB 3.4 — без схемы, BSON-документы.
 * В новом проекте эти данные пойдут в PostgreSQL (метаданные)
 * и TimescaleDB (GPS-позиции).
 *
 * MongoDB коллекции → Типы:
 *   accounts        → Account
 *   objects         → BillingObject
 *   users           → User
 *   equipments      → Equipment
 *   tariffs         → Tariff
 *   billingRoles    → Role
 *   domainEvents    → SystemEvent
 *   supportRequest  → SupportTicket
 *   balanceHistoryWithDetails → BalanceHistoryItem
 *
 * Деньги хранятся в КОПЕЙКАХ (целые числа, делим на 100 для отображения).
 */

// Учетная запись (Account)
export interface Account {
  _id: string;
  name: string;
  comment: string;
  fullClientName: string;
  balance: number; // в копейках
  cost: number; // абонентская плата в копейках
  plan: string; // тарифный план
  tariffId: string;
  paymentWay: 'prepay' | 'postpay';
  daysLimit: number;
  currencyLimit: number;
  percentMonthlyFeeLimit: number;
  objectsCount: number;
  equipmentsCount: number;
  usersCount: number;
  status: boolean; // true = включен, false = заблокирован
  blocked: boolean;
  blockedReason: string;
}

// Объект (транспортное средство) - 1:1 как в legacy AllObjectsPanel.js
export interface BillingObject {
  _id: string;
  name: string;
  customName: string;
  comment: string;
  accountName: string;
  accountId: string;
  uid: string;
  trackerModel: string;
  eqIMEI: string;
  simNumber: string;
  cost: number; // абонентская плата в копейках
  blocked: boolean;
  ignition: 'unknown' | number;
  speed: number;
  disabled: boolean;
  
  // GPS данные
  latestmsg: number | null; // timestamp последнего сообщения
  latestmsgprotocol: string;
  placeName: string;
  satelliteNum: number;
  
  // SMS
  sms: boolean;
  
  // Радиозакладка
  radioUnit?: {
    installed: boolean;
    type?: string;
    model?: string;
    workDate?: number;
  };
  
  // Спящий блок
  sleeper?: {
    time: number;
    alert: string;
    battery: string;
    info: string;
  };
  
  // Блокировки
  fuelPumpLock?: boolean;
  ignitionLock?: boolean;
}

// Группа объектов
export interface ObjectGroup {
  _id: string;
  name: string;
  accountId: string;
  accountName: string;
  objectIds: string[];
  objectsCount: number;
}

// Оборудование
export interface Equipment {
  _id: string;
  eqtype: string;
  accountName: string;
  accountId: string;
  objectName: string;
  objectId: string;
  eqMark: string;
  eqModel: string;
  eqSerNum: string;
  eqIMEI: string;
  eqFirmware: string;
  simNumber: string;
  simICC: string;
  status: 'free' | 'installed' | 'broken';
}

// Пользователь - 1:1 как в legacy AllUsersPanel.js
export interface User {
  _id: string;
  name: string;
  userType: string;
  comment: string;
  mainAccName: string;
  mainAccId: string;
  enabled: boolean;
  hasBlockedMainAccount: boolean;
  hasObjectsOnBlockedAccount: boolean;
  lastLoginDate?: string;
  lastAction?: string;
}

// Роль
export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  authorities: string[];
  usersCount: number;
}

// Тариф
export interface Tariff {
  _id: string;
  name: string;
  description: string;
  monthlyFee: number; // в копейках
  perObjectFee: number;
  objectsCount: number;
  period: 'day' | 'month' | 'year';
  features: string[];
  isActive: boolean;
}

// Тип оборудования
export interface EquipmentType {
  _id: string;
  name: string;
  equipmentType: string;
  mark: string;
  model: string;
  description: string;
  protocol: string;
  server: string;
  port: number;
}

// Ретранслятор
export interface Retranslator {
  _id: string;
  name: string;
  host: string;
  port: number;
  protocol: string;
  enabled: boolean;
  isActive: boolean;
  objectsCount: number;
  accountId: string;
  accountName: string;
}

// Событие системы
export interface SystemEvent {
  _id: string;
  time: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  aggregateName: string;
  payloadType: string;
  eventDataPreview: string;
  objectName: string;
  accountName: string;
  description: string;
  userId: string;
  userName: string;
}

// Субдилер
export interface Subdealer {
  _id: string;
  name: string;
  contact: string;
  contactPerson: string;
  email: string;
  phone: string;
  balance: number;
  commission: number;
  accountsCount: number;
  objectsCount: number;
  status: boolean;
}

// Элемент корзины (удалённый объект)
export interface TrashItem {
  _id: string;
  itemType: 'account' | 'object' | 'user' | 'equipment';
  type: string;
  name: string;
  entityName: string;
  accountName: string;
  removalTime: string;
  payload: string;
  deletedAt: number;
  deletedBy: string;
  originalData: Record<string, unknown>;
}

// Тикет поддержки
export interface SupportTicket {
  _id: string;
  subject: string;
  status: 'new' | 'open' | 'pending' | 'resolved' | 'close' | 'in-progress';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'equipment' | 'program' | 'finance';
  accountName: string;
  accountId: string;
  userName: string;
  userPhone: string;
  createdAt: string;
  updatedAt: number;
  messages: SupportMessage[];
}

export interface SupportMessage {
  _id: string;
  text: string;
  author: string;
  authorType: 'user' | 'support';
  createdAt: number;
}

// История баланса
export interface BalanceHistoryItem {
  _id: string;
  accountId: string;
  timestamp: string;
  time: number;
  amount: number; // в копейках, положительное = пополнение, отрицательное = списание
  newBalance: number;
  type: 'payment' | 'monthly' | 'manual' | 'refund' | 'credit' | 'debit';
  comment: string;
  description: string;
  balanceAfter: number;
}

// Активная вкладка
export type TabId = 
  | 'accounts' 
  | 'objects' 
  | 'groups' 
  | 'equipment' 
  | 'users'
  | 'tariffs'
  | 'equipmentTypes'
  | 'retranslators'
  | 'roles'
  | 'events'
  | 'subdealers'
  | 'trash'
  | 'support';

export interface TabConfig {
  id: TabId;
  title: string;
  icon?: string;
  adminOnly: boolean;
}
