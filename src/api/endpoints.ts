/**
 * =====================================================
 * API Endpoints — маппинг legacy Ext.Direct → REST
 * =====================================================
 *
 * В legacy Stels все вызовы шли через Ext.Direct RPC:
 *   JS: accountsStoreService.loadObjects({page: 1, limit: 25})
 *       → POST /EDS/router (JSON-RPC batch)
 *
 * В новом проекте переводим на обычный REST:
 *   GET /api/v1/accounts?page=1&limit=25
 *
 * Каждый эндпоинт помечен комментарием с legacy-именем:
 *   // accountsStoreService.remove(ids, removalOptions) → DELETE /accounts
 *
 * Полный контракт: docs/BILLING_API_CONTRACT.md (~55 RPC методов)
 * Бэкенд будет: device-manager (Scala 3 + ZIO HTTP) на порту 8092
 */

// ===== BASE URL =====
export const API_BASE_URL = '/api/v1';

// ===== AUTHENTICATION =====
export const authApi = {
  // loginService.logout() → POST /auth/logout
  logout: () => `${API_BASE_URL}/auth/logout`,
  
  // rolesService.checkAdminRole() → GET /auth/check-admin
  checkAdminRole: () => `${API_BASE_URL}/auth/check-admin`,
};

// ===== ACCOUNTS (Учетные записи) =====
export const accountsApi = {
  // EDS.store.AccountsData (CRUD via proxy)
  // accountsStoreService
  
  // GET /accounts - список всех аккаунтов
  list: () => `${API_BASE_URL}/accounts`,
  
  // GET /accounts/:id - получить аккаунт
  get: (id: string) => `${API_BASE_URL}/accounts/${id}`,
  
  // POST /accounts - создать аккаунт
  create: () => `${API_BASE_URL}/accounts`,
  
  // PUT /accounts/:id - обновить аккаунт
  update: (id: string) => `${API_BASE_URL}/accounts/${id}`,
  
  // DELETE /accounts - удалить аккаунты (массив)
  // accountsStoreService.remove(ids, removalOptions)
  remove: () => `${API_BASE_URL}/accounts`,
  
  // accountData.loadData(accountId) → GET /accounts/:id/full
  loadFull: (id: string) => `${API_BASE_URL}/accounts/${id}/full`,
  
  // accountData.updateData(data, contractCount)
  updateFull: (id: string) => `${API_BASE_URL}/accounts/${id}/full`,
  
  // accountInfo.getObjectsStat(accountId)
  getObjectsStat: (id: string) => `${API_BASE_URL}/accounts/${id}/stats/objects`,
  
  // accountInfo.getEquiupmentsStat(accountId)
  getEquipmentsStat: (id: string) => `${API_BASE_URL}/accounts/${id}/stats/equipments`,
  
  // accountsStoreService.addToAccount(accountId, objectIds)
  addObjectsToAccount: (id: string) => `${API_BASE_URL}/accounts/${id}/objects`,
  
  // EDS.store.AccountsDataShort - упрощенный список для комбобоксов
  listShort: () => `${API_BASE_URL}/accounts/short`,
};

// ===== OBJECTS (Объекты) =====
export const objectsApi = {
  // EDS.store.AllObjectsService
  
  // GET /objects
  list: () => `${API_BASE_URL}/objects`,
  
  // GET /objects/:id
  get: (id: string) => `${API_BASE_URL}/objects/${id}`,
  
  // POST /objects
  create: () => `${API_BASE_URL}/objects`,
  
  // PUT /objects/:id
  update: (id: string) => `${API_BASE_URL}/objects/${id}`,
  
  // allObjectsService.remove(ids) → DELETE /objects
  remove: () => `${API_BASE_URL}/objects`,
  
  // EDS.store.ObjectsData - объекты по accountId
  listByAccount: (accountId: string) => `${API_BASE_URL}/accounts/${accountId}/objects`,
  
  // objectData.getObjectSleepers(uid)
  getSleepers: (uid: string) => `${API_BASE_URL}/objects/${uid}/sleepers`,
};

// ===== OBJECT GROUPS (Группы объектов) =====
export const groupsApi = {
  // EDS.store.GroupsOfObjects
  
  list: () => `${API_BASE_URL}/groups`,
  get: (id: string) => `${API_BASE_URL}/groups/${id}`,
  create: () => `${API_BASE_URL}/groups`,
  update: (id: string) => `${API_BASE_URL}/groups/${id}`,
  remove: () => `${API_BASE_URL}/groups`,
  
  // EDS.store.ObjectsGroupStore - объекты в группе
  getObjects: (groupId: string) => `${API_BASE_URL}/groups/${groupId}/objects`,
  
  // Управление объектами в группе
  addObjects: (groupId: string) => `${API_BASE_URL}/groups/${groupId}/objects`,
  removeObjects: (groupId: string) => `${API_BASE_URL}/groups/${groupId}/objects`,
};

// ===== EQUIPMENT (Оборудование) =====
export const equipmentApi = {
  // EDS.store.EquipmentStoreService
  
  list: () => `${API_BASE_URL}/equipment`,
  get: (id: string) => `${API_BASE_URL}/equipment/${id}`,
  create: () => `${API_BASE_URL}/equipment`,
  update: (id: string) => `${API_BASE_URL}/equipment/${id}`,
  remove: () => `${API_BASE_URL}/equipment`,
  
  // EDS.store.AccountsEquipmentService
  listByAccount: (accountId: string) => `${API_BASE_URL}/accounts/${accountId}/equipment`,
  
  // EDS.store.ObjectsEquipmentService
  listByObject: (objectId: string) => `${API_BASE_URL}/objects/${objectId}/equipment`,
  
  // EDS.store.ObjectsEquipmentStoreService - доступное для установки
  listAvailable: (accountId: string) => `${API_BASE_URL}/accounts/${accountId}/equipment/available`,
  
  // equipmentData.updateData(data)
  updateFull: (id: string) => `${API_BASE_URL}/equipment/${id}/full`,
  
  // accountsEquipmentService.modify(accountId, toUpdate, toRemove)
  modifyAccountEquipment: (accountId: string) => `${API_BASE_URL}/accounts/${accountId}/equipment/modify`,
};

// ===== EQUIPMENT TYPES (Типы оборудования) =====
export const equipmentTypesApi = {
  // EDS.store.EquipmentTypesService
  
  list: () => `${API_BASE_URL}/equipment-types`,
  get: (id: string) => `${API_BASE_URL}/equipment-types/${id}`,
  create: () => `${API_BASE_URL}/equipment-types`,
  update: (id: string) => `${API_BASE_URL}/equipment-types/${id}`,
  remove: () => `${API_BASE_URL}/equipment-types`,
  
  // EDS.store.EquipmentDeviceTypesService - уникальные типы устройств
  listDeviceTypes: () => `${API_BASE_URL}/equipment-types/device-types`,
  
  // equipmentTypesData.loadMarkByType(eqtype)
  getMarksByType: (type: string) => `${API_BASE_URL}/equipment-types/marks?type=${type}`,
  
  // equipmentTypesData.loadModelByMark(type, mark)
  getModelsByMark: (type: string, mark: string) => `${API_BASE_URL}/equipment-types/models?type=${type}&mark=${mark}`,
};

// ===== USERS (Пользователи) =====
export const usersApi = {
  // EDS.store.UsersService
  
  list: () => `${API_BASE_URL}/users`,
  get: (id: string) => `${API_BASE_URL}/users/${id}`,
  
  // usersService.create(userData)
  create: () => `${API_BASE_URL}/users`,
  
  // usersService.update(userData)
  update: (id: string) => `${API_BASE_URL}/users/${id}`,
  
  remove: () => `${API_BASE_URL}/users`,
  
  // usersService.load(userId) - полная загрузка
  loadFull: (id: string) => `${API_BASE_URL}/users/${id}/full`,
  
  // Backdoor для входа как пользователь
  backdoor: (login: string) => `/EDS/monitoringbackdoor?login=${encodeURIComponent(login)}`,
};

// ===== USER PERMISSIONS (Права пользователей) =====
export const permissionsApi = {
  // EDS.store.UserPermissionsService
  // EDS.store.UserPermissionSelectionService
  // EDS.store.PermittedItemsService
  
  // usersPermissionsService.getPermittedUsersCount(entityId, entityType)
  getPermittedUsersCount: (entityId: string, entityType: string) => 
    `${API_BASE_URL}/permissions/users-count?entityId=${entityId}&entityType=${entityType}`,
  
  // Получить права пользователя
  getUserPermissions: (userId: string) => `${API_BASE_URL}/users/${userId}/permissions`,
  
  // Получить пользователей с правами на сущность
  getEntityPermissions: (entityType: string, entityId: string) => 
    `${API_BASE_URL}/permissions/${entityType}/${entityId}/users`,
  
  // usersPermissionsService.providePermissions(toUpdate, toRemove, type, oid)
  updatePermissions: () => `${API_BASE_URL}/permissions`,
  
  // EDS.store.PermittedObjectsStore
  getPermittedObjects: (userId: string) => `${API_BASE_URL}/users/${userId}/permitted-objects`,
};

// ===== ROLES (Роли) =====
export const rolesApi = {
  // EDS.store.RolesService
  
  list: () => `${API_BASE_URL}/roles`,
  get: (id: string) => `${API_BASE_URL}/roles/${id}`,
  create: () => `${API_BASE_URL}/roles`,
  
  // rolesService.update(roleData)
  update: (id: string) => `${API_BASE_URL}/roles/${id}`,
  
  remove: () => `${API_BASE_URL}/roles`,
  
  // rolesService.getAvailableUserTypes(userName)
  getAvailableUserTypes: (userName: string) => 
    `${API_BASE_URL}/roles/user-types?userName=${encodeURIComponent(userName)}`,
  
  // rolesService.getUserRole(userId)
  getUserRole: (userId: string) => `${API_BASE_URL}/users/${userId}/role`,
  
  // rolesService.updateUserRole(data)
  updateUserRole: (userId: string) => `${API_BASE_URL}/users/${userId}/role`,
  
  // rolesService.checkChangeRoleAuthority()
  checkChangeRoleAuthority: () => `${API_BASE_URL}/roles/check-authority`,
};

// ===== TARIFFS (Тарифы) =====
export const tariffsApi = {
  // EDS.store.Tariffs
  
  list: () => `${API_BASE_URL}/tariffs`,
  get: (id: string) => `${API_BASE_URL}/tariffs/${id}`,
  create: () => `${API_BASE_URL}/tariffs`,
  update: (id: string) => `${API_BASE_URL}/tariffs/${id}`,
  
  // tariffEDS.remove(ids)
  remove: () => `${API_BASE_URL}/tariffs`,
};

// ===== RETRANSLATORS (Ретрансляторы) =====
export const retranslatorsApi = {
  // EDS.store.RetranslatorsListService
  
  list: () => `${API_BASE_URL}/retranslators`,
  get: (id: string) => `${API_BASE_URL}/retranslators/${id}`,
  create: () => `${API_BASE_URL}/retranslators`,
  update: (id: string) => `${API_BASE_URL}/retranslators/${id}`,
  
  // retranslatorsListService.remove(ids)
  remove: () => `${API_BASE_URL}/retranslators`,
  
  // EDS.store.RetranslatorsService - объекты ретранслятора
  getObjects: (retranslatorId: string) => `${API_BASE_URL}/retranslators/${retranslatorId}/objects`,
  
  // retranslatorsService.updateData(retranslatorId, data)
  updateObjects: (retranslatorId: string) => `${API_BASE_URL}/retranslators/${retranslatorId}/objects`,
  
  // EDS.store.RetranslatorsTasks - текущие задачи ретрансляции
  getTasks: () => `${API_BASE_URL}/retranslators/tasks`,
};

// ===== DEALERS/SUBDEALERS (Субдилеры) =====
export const dealersApi = {
  // EDS.store.DealersService
  
  list: () => `${API_BASE_URL}/dealers`,
  get: (id: string) => `${API_BASE_URL}/dealers/${id}`,
  create: () => `${API_BASE_URL}/dealers`,
  update: (id: string) => `${API_BASE_URL}/dealers/${id}`,
  remove: () => `${API_BASE_URL}/dealers`,
  
  // dealersService.getDealerParams(dealerId)
  getParams: (id: string) => `${API_BASE_URL}/dealers/${id}/params`,
  
  // dealersService.updateDealerParams(data)
  updateParams: (id: string) => `${API_BASE_URL}/dealers/${id}/params`,
  
  // dealersService.dealerBlocking(id, block)
  setBlocking: (id: string) => `${API_BASE_URL}/dealers/${id}/blocking`,
  
  // EDS.store.DealerMonthlyPaymentService
  getMonthlyPayments: (dealerId: string) => `${API_BASE_URL}/dealers/${dealerId}/monthly-payments`,
};

// ===== EVENTS (События) =====
export const eventsApi = {
  // EDS.store.EventsData
  
  list: () => `${API_BASE_URL}/events`,
  
  // Фильтр по aggregate
  listByAggregate: (aggregateId: string, aggregateType: string) => 
    `${API_BASE_URL}/events?aggregateId=${aggregateId}&aggregateType=${aggregateType}`,
};

// ===== TRASH / RECYCLE BIN (Корзина) =====
export const trashApi = {
  // EDS.store.RecycleBinData
  
  list: () => `${API_BASE_URL}/trash`,
  
  // recycleBinStoreManager.restore(items)
  restore: () => `${API_BASE_URL}/trash/restore`,
  
  // recycleBinStoreManager.delete(items)
  deletePermanently: () => `${API_BASE_URL}/trash/delete`,
};

// ===== SUPPORT (Техподдержка) =====
export const supportApi = {
  // EDS.store.SupportRequestEDS
  
  list: () => `${API_BASE_URL}/support/tickets`,
  get: (id: string) => `${API_BASE_URL}/support/tickets/${id}`,
  create: () => `${API_BASE_URL}/support/tickets`,
  update: (id: string) => `${API_BASE_URL}/support/tickets/${id}`,
  
  // Сообщения тикета
  getMessages: (ticketId: string) => `${API_BASE_URL}/support/tickets/${ticketId}/messages`,
  addMessage: (ticketId: string) => `${API_BASE_URL}/support/tickets/${ticketId}/messages`,
  
  // EDS.store.SupportEmailNotificationEDS
  getNotificationSettings: () => `${API_BASE_URL}/support/notifications`,
  updateNotificationSettings: () => `${API_BASE_URL}/support/notifications`,
};

// ===== BALANCE (Баланс) =====
export const balanceApi = {
  // EDS.store.BalanceHistory
  
  getHistory: (accountId: string) => `${API_BASE_URL}/accounts/${accountId}/balance/history`,
  
  // Добавить операцию баланса
  addEntry: (accountId: string) => `${API_BASE_URL}/accounts/${accountId}/balance`,
  
  // EDS.store.BalanceEntryTypes
  getEntryTypes: () => `${API_BASE_URL}/balance/entry-types`,
  
  // EDS.store.CommercialServices
  getCommercialServices: () => `${API_BASE_URL}/balance/commercial-services`,
  
  // EDS.store.MonthlyPaymentService
  getMonthlyPayments: (accountId: string) => `${API_BASE_URL}/accounts/${accountId}/monthly-payments`,
};

// ===== TERMINAL MESSAGES (Сообщения терминала) =====
export const terminalMessagesApi = {
  // EDS.store.TerminalMessagesService
  
  list: (objectUid: string) => `${API_BASE_URL}/objects/${objectUid}/terminal-messages`,
  
  // terminalMessagesService.remove(uid, data)
  remove: (objectUid: string) => `${API_BASE_URL}/objects/${objectUid}/terminal-messages`,
  
  // terminalMessagesService.removeInInterval(uid, from, to)
  removeInInterval: (objectUid: string) => `${API_BASE_URL}/objects/${objectUid}/terminal-messages/interval`,
  
  // terminalMessagesService.reaggregate(uid, from)
  reaggregate: (objectUid: string) => `${API_BASE_URL}/objects/${objectUid}/terminal-messages/reaggregate`,
  
  // EDS.store.TerminalMessagesGaps
  getGaps: (objectUid: string) => `${API_BASE_URL}/objects/${objectUid}/terminal-messages/gaps`,
};

// ===== SLEEPER MESSAGES (Сообщения спящего блока) =====
export const sleeperMessagesApi = {
  // EDS.store.SleeperMesService
  
  list: (objectUid: string) => `${API_BASE_URL}/objects/${objectUid}/sleeper-messages`,
};

// ===== TRACKER SMS (SMS трекеру) =====
export const trackerSmsApi = {
  // EDS.store.TrackerMesService
  
  list: (phone: string) => `${API_BASE_URL}/tracker-sms?phone=${phone}`,
  
  // trackerMesService.sendSMSToTracker(phone, text)
  sendSms: () => `${API_BASE_URL}/tracker-sms/send`,
  
  // trackerMesService.sendTeltonikaCMD(phone, command)
  sendTeltonikaCMD: () => `${API_BASE_URL}/tracker-sms/teltonika`,
  
  // trackerMesService.sendRuptelaCMD(phone, command)
  sendRuptelaCMD: () => `${API_BASE_URL}/tracker-sms/ruptela`,
  
  // trackerMesService.sendumkaCMD(phone, command)
  sendUmkaCMD: () => `${API_BASE_URL}/tracker-sms/umka`,
  
  // trackerMesService.sendArnaviCMD(phone, command)
  sendArnaviCMD: () => `${API_BASE_URL}/tracker-sms/arnavi`,
  
  // trackerMesService.ipAndPortToWRC(phone)
  flashToWRC: () => `${API_BASE_URL}/tracker-sms/flash-wrc`,
  
  // trackerMesService.attachToWRC(phone)
  attachToWRC: () => `${API_BASE_URL}/tracker-sms/attach-wrc`,
};

// ===== EXPORT TYPE =====
export type ApiEndpoints = 
  | typeof authApi
  | typeof accountsApi
  | typeof objectsApi
  | typeof groupsApi
  | typeof equipmentApi
  | typeof equipmentTypesApi
  | typeof usersApi
  | typeof permissionsApi
  | typeof rolesApi
  | typeof tariffsApi
  | typeof retranslatorsApi
  | typeof dealersApi
  | typeof eventsApi
  | typeof trashApi
  | typeof supportApi
  | typeof balanceApi
  | typeof terminalMessagesApi
  | typeof sleeperMessagesApi
  | typeof trackerSmsApi;
