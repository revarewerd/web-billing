// Mock Data for Billing Admin - соответствует legacy Stels billing

import type { 
  Account, 
  BillingObject, 
  ObjectGroup, 
  Equipment, 
  User, 
  Role, 
  Tariff, 
  EquipmentType, 
  Retranslator, 
  SystemEvent, 
  Subdealer, 
  TrashItem, 
  SupportTicket,
  BalanceHistoryItem
} from '../types';

// Учетные записи
export const mockAccounts: Account[] = [
  {
    _id: '1',
    name: 'ООО Транспорт-Сервис',
    comment: 'Основной клиент',
    fullClientName: 'ООО "Транспорт-Сервис" ИНН 7701234567',
    balance: 1500000, // 15000 руб
    cost: 500000, // 5000 руб/мес
    plan: 'Стандарт',
    tariffId: '1',
    paymentWay: 'prepay',
    daysLimit: 7,
    currencyLimit: 10000,
    percentMonthlyFeeLimit: 50,
    objectsCount: 25,
    equipmentsCount: 28,
    usersCount: 3,
    status: true,
    blocked: false,
    blockedReason: ''
  },
  {
    _id: '2',
    name: 'ИП Петров А.В.',
    comment: 'Грузоперевозки',
    fullClientName: 'ИП Петров Александр Владимирович',
    balance: 320000,
    cost: 150000,
    plan: 'Базовый',
    tariffId: '2',
    paymentWay: 'prepay',
    daysLimit: 3,
    currencyLimit: 5000,
    percentMonthlyFeeLimit: 30,
    objectsCount: 8,
    equipmentsCount: 8,
    usersCount: 1,
    status: true,
    blocked: false,
    blockedReason: ''
  },
  {
    _id: '3',
    name: 'ЗАО Логистика Плюс',
    comment: 'Крупный клиент, требует внимания',
    fullClientName: 'ЗАО "Логистика Плюс"',
    balance: -50000, // отрицательный баланс
    cost: 800000,
    plan: 'Премиум',
    tariffId: '3',
    paymentWay: 'postpay',
    daysLimit: 14,
    currencyLimit: 50000,
    percentMonthlyFeeLimit: 100,
    objectsCount: 45,
    equipmentsCount: 50,
    usersCount: 5,
    status: false, // заблокирован
    blocked: true,
    blockedReason: 'Просроченная задолженность'
  },
  {
    _id: '4',
    name: 'Такси "Город"',
    comment: '',
    fullClientName: 'ООО "Такси Город"',
    balance: 750000,
    cost: 300000,
    plan: 'Стандарт',
    tariffId: '1',
    paymentWay: 'prepay',
    daysLimit: 5,
    currencyLimit: 15000,
    percentMonthlyFeeLimit: 50,
    objectsCount: 15,
    equipmentsCount: 15,
    usersCount: 2,
    status: true,
    blocked: false,
    blockedReason: ''
  },
  {
    _id: '5',
    name: 'ООО СтройТранс',
    comment: 'Спецтехника',
    fullClientName: 'ООО "СтройТранс"',
    balance: 1200000,
    cost: 400000,
    plan: 'Стандарт',
    tariffId: '1',
    paymentWay: 'prepay',
    daysLimit: 7,
    currencyLimit: 20000,
    percentMonthlyFeeLimit: 50,
    objectsCount: 20,
    equipmentsCount: 22,
    usersCount: 2,
    status: true,
    blocked: false,
    blockedReason: ''
  }
];

// Объекты - 1:1 как в legacy AllObjectsPanel.js
export const mockBillingObjects: BillingObject[] = [
  {
    _id: '1',
    name: 'КамАЗ-001',
    customName: 'Грузовик №1',
    comment: 'Основной грузовик',
    accountName: 'ООО Транспорт-Сервис',
    accountId: '1',
    uid: 'TS-001',
    trackerModel: 'Teltonika FMB920',
    eqIMEI: '860719020025346',
    simNumber: '+79161234567',
    cost: 20000,
    blocked: false,
    disabled: false,
    ignition: 1,
    speed: 65,
    latestmsg: Date.now() - 60000,
    latestmsgprotocol: 'teltonika',
    placeName: 'Москва, ул. Ленина, д. 15',
    satelliteNum: 12,
    sms: false,
    radioUnit: { installed: true, type: 'Стелс', model: 'M100', workDate: Date.now() - 90 * 24 * 60 * 60 * 1000 },
    sleeper: undefined,
    fuelPumpLock: false,
    ignitionLock: false
  },
  {
    _id: '2',
    name: 'ГАЗель-002',
    customName: '',
    comment: '',
    accountName: 'ООО Транспорт-Сервис',
    accountId: '1',
    uid: 'TS-002',
    trackerModel: 'Teltonika FMB920',
    eqIMEI: '860719020025347',
    simNumber: '+79161234568',
    cost: 20000,
    blocked: false,
    disabled: false,
    ignition: 0,
    speed: 0,
    latestmsg: Date.now() - 2 * 60 * 60 * 1000, // 2 часа назад
    latestmsgprotocol: 'teltonika',
    placeName: 'Москва, Ленинградское шоссе',
    satelliteNum: 8,
    sms: true,
    radioUnit: undefined,
    sleeper: undefined,
    fuelPumpLock: false,
    ignitionLock: false
  },
  {
    _id: '3',
    name: 'МАЗ-003',
    customName: 'Тягач',
    comment: 'На ремонте до 15.02',
    accountName: 'ЗАО Логистика Плюс',
    accountId: '3',
    uid: 'LP-001',
    trackerModel: 'Wialon IPS',
    eqIMEI: '860719020025348',
    simNumber: '+79161234569',
    cost: 25000,
    blocked: true,
    disabled: false,
    ignition: 'unknown',
    speed: 0,
    latestmsg: Date.now() - 7 * 24 * 60 * 60 * 1000, // неделю назад
    latestmsgprotocol: 'wialon',
    placeName: 'СТО "АвтоМастер", Подольск',
    satelliteNum: 0,
    sms: false,
    radioUnit: { installed: true, type: 'Стелс', model: 'M200', workDate: Date.now() - 400 * 24 * 60 * 60 * 1000 }, // просрочено
    sleeper: { time: Date.now() - 3 * 24 * 60 * 60 * 1000, alert: 'Норма', battery: '95%', info: 'Спящий режим активен' },
    fuelPumpLock: true,
    ignitionLock: false
  },
  {
    _id: '4',
    name: 'Toyota Camry',
    customName: 'Такси №15',
    comment: '',
    accountName: 'Такси "Город"',
    accountId: '4',
    uid: 'TX-015',
    trackerModel: 'Teltonika FMB120',
    eqIMEI: '860719020025349',
    simNumber: '+79161234570',
    cost: 15000,
    blocked: false,
    disabled: false,
    ignition: 1,
    speed: 45,
    latestmsg: Date.now() - 5 * 60 * 1000, // 5 мин назад
    latestmsgprotocol: 'teltonika',
    placeName: 'Москва, Тверская ул.',
    satelliteNum: 15,
    sms: false,
    radioUnit: undefined,
    sleeper: undefined,
    fuelPumpLock: false,
    ignitionLock: false
  }
];

// Группы объектов
export const mockObjectGroups: ObjectGroup[] = [
  {
    _id: '1',
    name: 'Грузовики',
    accountId: '1',
    accountName: 'ООО Транспорт-Сервис',
    objectIds: ['1', '2'],
    objectsCount: 2
  },
  {
    _id: '2',
    name: 'Все машины',
    accountId: '4',
    accountName: 'Такси "Город"',
    objectIds: ['4'],
    objectsCount: 1
  }
];

// Оборудование
export const mockEquipment: Equipment[] = [
  {
    _id: '1',
    eqtype: 'GPS-трекер',
    accountName: 'ООО Транспорт-Сервис',
    accountId: '1',
    objectName: 'КамАЗ-001',
    objectId: '1',
    eqMark: 'Teltonika',
    eqModel: 'FMB920',
    eqSerNum: 'TK20250001',
    eqIMEI: '860719020025346',
    eqFirmware: '03.27.07.Rev.00',
    simNumber: '+79161234567',
    simICC: '8970199150000000001',
    status: 'installed'
  },
  {
    _id: '2',
    eqtype: 'GPS-трекер',
    accountName: '',
    accountId: '',
    objectName: '',
    objectId: '',
    eqMark: 'Teltonika',
    eqModel: 'FMB920',
    eqSerNum: 'TK20250002',
    eqIMEI: '860719020025350',
    eqFirmware: '03.27.07.Rev.00',
    simNumber: '+79161234571',
    simICC: '8970199150000000002',
    status: 'free'
  },
  {
    _id: '3',
    eqtype: 'SIM-карта',
    accountName: '',
    accountId: '',
    objectName: '',
    objectId: '',
    eqMark: 'МТС',
    eqModel: 'M2M',
    eqSerNum: '',
    eqIMEI: '',
    eqFirmware: '',
    simNumber: '+79161234572',
    simICC: '8970199150000000003',
    status: 'free'
  },
  {
    _id: '4',
    eqtype: 'GPS-трекер',
    accountName: 'ЗАО Логистика Плюс',
    accountId: '3',
    objectName: '',
    objectId: '',
    eqMark: 'Wialon',
    eqModel: 'IPS',
    eqSerNum: 'WL20240015',
    eqIMEI: '860719020025351',
    eqFirmware: '1.5.2',
    simNumber: '',
    simICC: '',
    status: 'broken'
  }
];

// Пользователи - 1:1 как в legacy AllUsersPanel.js
export const mockUsers: User[] = [
  {
    _id: '1',
    name: 'admin',
    userType: 'Администратор',
    comment: 'Системный администратор',
    mainAccName: '',
    mainAccId: '',
    enabled: true,
    hasBlockedMainAccount: false,
    hasObjectsOnBlockedAccount: false,
    lastLoginDate: '2026-02-05T10:30:00Z',
    lastAction: '2026-02-05T14:45:00Z'
  },
  {
    _id: '2',
    name: 'ivanov',
    userType: 'Диспетчер',
    comment: 'Диспетчер ООО Транспорт-Сервис',
    mainAccName: 'ООО Транспорт-Сервис',
    mainAccId: '1',
    enabled: true,
    hasBlockedMainAccount: false,
    hasObjectsOnBlockedAccount: false,
    lastLoginDate: '2026-02-05T08:00:00Z',
    lastAction: '2026-02-05T12:30:00Z'
  },
  {
    _id: '3',
    name: 'petrov',
    userType: 'Водитель',
    comment: '',
    mainAccName: 'ИП Петров А.В.',
    mainAccId: '2',
    enabled: true,
    hasBlockedMainAccount: false,
    hasObjectsOnBlockedAccount: false,
    lastLoginDate: '2026-02-04T15:00:00Z',
    lastAction: '2026-02-04T16:20:00Z'
  },
  {
    _id: '4',
    name: 'sidorov',
    userType: 'Менеджер',
    comment: '',
    mainAccName: 'ЗАО Логистика Плюс',
    mainAccId: '3',
    enabled: false,
    hasBlockedMainAccount: true,
    hasObjectsOnBlockedAccount: true,
    lastLoginDate: '2026-01-20T09:00:00Z',
    lastAction: '2026-01-20T09:15:00Z'
  }
];

// Роли
export const mockRoles: Role[] = [
  {
    _id: '1',
    name: 'Администратор',
    description: 'Полный доступ к системе',
    permissions: ['all'],
    authorities: ['ROLE_ADMIN', 'VIEW_OBJECTS', 'EDIT_OBJECTS', 'VIEW_USERS', 'EDIT_USERS', 'VIEW_BILLING', 'EDIT_BILLING'],
    usersCount: 2
  },
  {
    _id: '2',
    name: 'Диспетчер',
    description: 'Просмотр и управление объектами',
    permissions: ['view_objects', 'edit_objects', 'view_reports'],
    authorities: ['ROLE_USER', 'VIEW_OBJECTS', 'EDIT_OBJECTS', 'VIEW_REPORTS', 'SEND_COMMANDS'],
    usersCount: 5
  },
  {
    _id: '3',
    name: 'Водитель',
    description: 'Только просмотр своего транспорта',
    permissions: ['view_own_object'],
    authorities: ['ROLE_USER', 'VIEW_OBJECTS'],
    usersCount: 15
  }
];

// Тарифы
export const mockTariffs: Tariff[] = [
  {
    _id: '1',
    name: 'Базовый',
    description: 'Для небольших компаний',
    monthlyFee: 50000, // 500 руб
    perObjectFee: 15000,
    objectsCount: 12,
    period: 'month',
    features: ['GPS-мониторинг', 'Отчёты'],
    isActive: true
  },
  {
    _id: '2',
    name: 'Стандарт',
    description: 'Оптимальный выбор',
    monthlyFee: 100000,
    perObjectFee: 20000,
    objectsCount: 65,
    period: 'month',
    features: ['GPS-мониторинг', 'Отчёты', 'Геозоны', 'Уведомления'],
    isActive: true
  },
  {
    _id: '3',
    name: 'Премиум',
    description: 'Максимум возможностей',
    monthlyFee: 200000,
    perObjectFee: 25000,
    objectsCount: 45,
    period: 'month',
    features: ['GPS-мониторинг', 'Отчёты', 'Геозоны', 'Уведомления', 'API', 'Приоритетная поддержка'],
    isActive: true
  }
];

// Типы оборудования
export const mockEquipmentTypes: EquipmentType[] = [
  {
    _id: '1',
    name: 'Teltonika FMB920',
    equipmentType: 'GPS-трекер',
    mark: 'Teltonika',
    model: 'FMB920',
    description: 'Продвинутый GPS-трекер',
    protocol: 'Teltonika',
    server: 'gps.example.com',
    port: 5001
  },
  {
    _id: '2',
    name: 'Teltonika FMB120',
    equipmentType: 'GPS-трекер',
    mark: 'Teltonika',
    model: 'FMB120',
    description: 'Базовый GPS-трекер',
    protocol: 'Teltonika',
    server: 'gps.example.com',
    port: 5001
  },
  {
    _id: '3',
    name: 'Wialon IPS',
    equipmentType: 'GPS-трекер',
    mark: 'Gurtam',
    model: 'IPS',
    description: 'Универсальный протокол',
    protocol: 'Wialon',
    server: 'gps.example.com',
    port: 5002
  }
];

// Ретрансляторы
export const mockRetranslators: Retranslator[] = [
  {
    _id: '1',
    name: 'Wialon Hosting',
    host: 'gps.wialon.com',
    port: 20100,
    protocol: 'Wialon IPS',
    enabled: true,
    isActive: true,
    objectsCount: 25,
    accountId: '1',
    accountName: 'ООО Транспорт-Сервис'
  }
];

// События системы
export const mockSystemEvents: SystemEvent[] = [
  {
    _id: '1',
    time: '2024-01-15T10:30:00Z',
    eventType: 'account_blocked',
    aggregateId: '3',
    aggregateType: 'account',
    aggregateName: 'ЗАО Логистика Плюс',
    payloadType: 'UPDATE',
    eventDataPreview: '{"blocked": true, "reason": "Отрицательный баланс"}',
    objectName: '',
    accountName: 'ЗАО Логистика Плюс',
    description: 'Учетная запись заблокирована из-за отрицательного баланса',
    userId: '1',
    userName: 'admin'
  },
  {
    _id: '2',
    time: '2024-01-15T09:15:00Z',
    eventType: 'object_created',
    aggregateId: '15',
    aggregateType: 'object',
    aggregateName: 'Toyota Camry',
    payloadType: 'CREATE',
    eventDataPreview: '{"name": "Toyota Camry", "imei": "860719020025360"}',
    objectName: 'Toyota Camry',
    accountName: 'Такси "Город"',
    description: 'Добавлен новый объект',
    userId: '1',
    userName: 'admin'
  },
  {
    _id: '3',
    time: '2024-01-14T15:45:00Z',
    eventType: 'payment_received',
    aggregateId: '1',
    aggregateType: 'account',
    aggregateName: 'ООО Транспорт-Сервис',
    payloadType: 'BALANCE_CHANGED',
    eventDataPreview: '{"amount": 15000, "type": "payment"}',
    objectName: '',
    accountName: 'ООО Транспорт-Сервис',
    description: 'Получена оплата 15000.00 руб.',
    userId: '1',
    userName: 'admin'
  }
];

// Субдилеры
export const mockSubdealers: Subdealer[] = [
  {
    _id: '1',
    name: 'Партнёр-Регион',
    contact: 'Иванов И.И.',
    contactPerson: 'Иванов Иван Иванович',
    email: 'partner@example.com',
    phone: '+79161234500',
    balance: 50000,
    commission: 15,
    accountsCount: 5,
    objectsCount: 35,
    status: true
  }
];

// Корзина
export const mockTrashItems: TrashItem[] = [
  {
    _id: '1',
    itemType: 'object',
    type: 'object',
    name: 'Старый ЗИЛ',
    entityName: 'Старый ЗИЛ',
    accountName: 'ООО Транспорт-Сервис',
    removalTime: '2024-01-13T12:00:00Z',
    payload: '{"name": "Старый ЗИЛ", "imei": "860719020025300"}',
    deletedAt: Date.now() - 172800000,
    deletedBy: 'admin',
    originalData: { name: 'Старый ЗИЛ', accountId: '1' }
  }
];

// Тикеты поддержки
export const mockSupportTickets: SupportTicket[] = [
  {
    _id: '1',
    subject: 'Не работает уведомление о геозоне',
    status: 'open',
    priority: 'normal',
    category: 'program',
    accountName: 'ООО Транспорт-Сервис',
    accountId: '1',
    userName: 'ivanov',
    userPhone: '+79161234567',
    createdAt: '2024-01-14T10:30:00Z',
    updatedAt: Date.now() - 3600000,
    messages: [
      {
        _id: '1',
        text: 'Настроил уведомление при выезде из геозоны, но оно не приходит',
        author: 'ivanov',
        authorType: 'user',
        createdAt: Date.now() - 86400000
      },
      {
        _id: '2',
        text: 'Проверяем настройки, скоро ответим',
        author: 'support',
        authorType: 'support',
        createdAt: Date.now() - 3600000
      }
    ]
  },
  {
    _id: '2',
    subject: 'Вопрос по оплате',
    status: 'in-progress',
    priority: 'high',
    category: 'finance',
    accountName: 'ИП Петров А.В.',
    accountId: '2',
    userName: 'petrov',
    userPhone: '+79161234568',
    createdAt: '2024-01-15T08:15:00Z',
    updatedAt: Date.now() - 7200000,
    messages: [
      {
        _id: '3',
        text: 'Не могу оплатить картой, выдаёт ошибку',
        author: 'petrov',
        authorType: 'user',
        createdAt: Date.now() - 7200000
      }
    ]
  },
  {
    _id: '3',
    subject: 'Трекер не передаёт данные',
    status: 'close',
    priority: 'urgent',
    category: 'equipment',
    accountName: 'Такси "Город"',
    accountId: '4',
    userName: 'dispatcher',
    userPhone: '+79161234569',
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: Date.now() - 172800000,
    messages: [
      {
        _id: '4',
        text: 'Toyota Camry Такси №15 - трекер молчит уже 2 дня',
        author: 'dispatcher',
        authorType: 'user',
        createdAt: Date.now() - 259200000
      },
      {
        _id: '5',
        text: 'Проверили, SIM-карта была заблокирована оператором. Разблокировали.',
        author: 'support',
        authorType: 'support',
        createdAt: Date.now() - 172800000
      }
    ]
  }
];

// История баланса
export const mockBalanceHistory: BalanceHistoryItem[] = [
  {
    _id: '1',
    accountId: '1',
    timestamp: '2024-01-14T12:00:00Z',
    time: Date.now() - 86400000,
    amount: 1500000,
    newBalance: 1500000,
    type: 'credit',
    comment: 'Пополнение баланса через Сбербанк',
    description: 'Пополнение баланса через Сбербанк',
    balanceAfter: 1500000
  },
  {
    _id: '2',
    accountId: '1',
    timestamp: '2024-01-01T00:00:00Z',
    time: Date.now() - 2592000000,
    amount: -500000,
    newBalance: 1000000,
    type: 'debit',
    comment: 'Абонентская плата за январь 2026',
    description: 'Абонентская плата за январь 2026',
    balanceAfter: 1000000
  },
  {
    _id: '3',
    accountId: '1',
    timestamp: '2023-12-15T10:30:00Z',
    time: Date.now() - 5184000000,
    amount: 2000000,
    newBalance: 1500000,
    type: 'credit',
    comment: 'Пополнение баланса',
    description: 'Пополнение баланса',
    balanceAfter: 1500000
  }
];

// Форматирование денег (как в legacy accounting.js)
export function formatMoney(value: number): string {
  const rubles = value / 100;
  return rubles.toLocaleString('ru-RU', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }) + ' р.';
}

// Форматирование даты
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}
