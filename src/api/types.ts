/**
 * Полные типы данных для Billing API
 * Соответствуют ExtDirect API из legacy Stels
 */

// ===== CORE ENTITIES =====

export interface Account {
  _id: string;
  name: string;
  comment: string;
  fullClientName: string;
  accountType: 'yur' | 'fiz'; // юр.лицо / физ.лицо
  balance: number; // в копейках
  cost: number; // абонентская плата в копейках
  plan: string; // tariff ID
  planName?: string; // tariff name
  status: boolean; // true = включен, false = заблокирован
  blockcause?: string;
  paymentWay: 'requisite' | 'card' | 'yandexPayment';
  
  // Лимит задолженности
  limitType?: 'daysLimit' | 'currencyLimit' | 'percentMonthlyFeeLimit';
  limitValue?: number;
  
  // Счетчики
  objectsCount: number;
  equipmentsCount: number;
  usersCount: number;
  
  // Контакты
  cffam?: string; // фамилия
  cfname?: string; // имя
  cffathername?: string; // отчество
  cfmobphone1?: string;
  cfmobphone2?: string;
  cfworkphone1?: string;
  cfemail?: string;
  cfnote?: string;
  
  // Договоры
  contracts?: Contract[];
}

export interface Contract {
  _id: string;
  accountid: string;
  conAccount: string;
  conNumber: string;
  conDate: string;
  // ... дополнительные поля договора
}

export interface GpsObject {
  _id: string;
  uid: string;
  name: string;
  customName?: string;
  comment?: string;
  accountId: string;
  accountName: string;
  
  // Данные объекта
  type?: string;
  marka?: string;
  model?: string;
  gosnumber?: string;
  VIN?: string;
  objnote?: string;
  
  // Оборудование
  trackerModel?: string;
  eqIMEI?: string;
  simNumber?: string;
  
  // Абонентская плата
  cost: number;
  disabled: boolean;
  
  // Состояние
  blocked: boolean;
  ignition: number | 'unknown';
  speed: number;
  latestmsg?: number; // timestamp
  latestmsgprotocol?: string;
  placeName?: string;
  satelliteNum?: number;
  sms?: boolean;
  
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

export interface Equipment {
  _id: string;
  eqtype: string; // тип устройства
  eqMark: string;
  eqModel: string;
  eqSerNum: string;
  eqIMEI: string;
  simNumber: string;
  eqFirmware: string;
  accountId?: string;
  accountName?: string;
  objectId?: string;
  objectName?: string;
}

export interface EquipmentType {
  _id: string;
  name: string;
  type: string; // категория: GPS-Tracker, etc
  mark: string;
  model: string;
  server: string;
  port: number;
}

export interface User {
  _id: string;
  name: string;
  comment?: string;
  password?: string;
  canchangepass: boolean;
  email?: string;
  phone?: string;
  userType: string;
  mainAccId?: string;
  mainAccName?: string;
  showbalance: boolean;
  showfeedetails: boolean;
  hascommandpass: boolean;
  commandpass?: string;
  enabled: boolean;
  blockcause?: string;
  hasBlockedMainAccount?: boolean;
  hasObjectsOnBlockedAccount?: boolean;
  lastLoginDate?: string;
  lastAction?: string;
}

export interface Role {
  _id: string;
  name: string;
  description?: string;
  authorities: string[];
  usersCount: number;
}

export interface Tariff {
  _id: string;
  name: string;
  description?: string;
  monthlyFee?: number;
  objectsCount?: number;
  period?: 'day' | 'month' | 'year';
  // Детали тарифа
  features?: TariffFeature[];
}

export interface TariffFeature {
  _id: string;
  name: string;
  price: number;
  included: boolean;
}

export interface ObjectGroup {
  _id: string;
  name: string;
  comment?: string;
  accountId: string;
  accountName?: string;
  objectIds: string[];
  objectsCount: number;
  userId?: string;
}

export interface Retranslator {
  _id: string;
  id: string; // legacy id
  name: string;
  host: string;
  port: number;
  protocol?: string;
  enabled?: boolean;
  objectsCount?: number;
}

export interface RetranslatorTask {
  _id: string;
  retranslatorId: string;
  objectId: string;
  objectName: string;
  status: 'active' | 'paused' | 'error';
}

export interface Subdealer {
  _id: string;
  id: string;
  name: string;
  comment?: string;
  contactPerson?: string;
  balance: number;
  commission: number;
  accountsCount: number;
  objectsCount: number;
  status: boolean;
  tariffication?: SubdealerTariff;
}

export interface SubdealerTariff {
  _id: string;
  dealerId: string;
  tariffId: string;
  discount: number;
}

export interface SystemEvent {
  _id: string;
  time: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  aggregateName?: string;
  payloadType: string;
  eventData: string;
}

export interface TrashItem {
  _id: string;
  type: 'account' | 'object' | 'equipment' | 'user' | 'group';
  name: string;
  entityName?: string;
  accountName?: string;
  removalTime: string;
  payload?: string;
}

export interface SupportTicket {
  _id: string;
  subject: string;
  category: 'technical' | 'billing' | 'general' | 'feature';
  status: 'new' | 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt?: string;
  accountId?: string;
  accountName?: string;
  userId?: string;
  userName?: string;
  messages?: SupportMessage[];
}

export interface SupportMessage {
  _id: string;
  ticketId: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  isSupport: boolean;
}

export interface BalanceHistoryItem {
  _id: string;
  accountId: string;
  timestamp: string;
  type: 'credit' | 'debit';
  amount: number;
  oldBalance?: number;
  newBalance: number;
  description: string;
  comment?: string;
  operationType?: string;
}

export interface MonthlyPayment {
  _id: string;
  accountId: string;
  objectId?: string;
  objectName?: string;
  amount: number;
  description: string;
  date: string;
}

export interface TerminalMessage {
  _id: string;
  objectUid: string;
  time: string;
  type: string;
  protocol: string;
  data: Record<string, unknown>;
}

export interface SleeperMessage {
  _id: string;
  objectUid: string;
  time: string;
  alert: string;
  battery: string;
  info: string;
}

// ===== API RESPONSE TYPES =====

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: number;
}

// ===== PERMISSIONS =====

export interface UserPermission {
  _id: string;
  userId: string;
  entityType: 'account' | 'object' | 'group';
  entityId: string;
  entityName: string;
  permissions: string[];
}

// ===== FILTER & SORT =====

export interface GridFilter {
  field: string;
  value: string | number | boolean;
  operator?: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'like' | 'in';
}

export interface GridSort {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface GridParams {
  page?: number;
  start?: number;
  limit?: number;
  filters?: GridFilter[];
  sort?: GridSort[];
  query?: string;
}
