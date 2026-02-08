/**
 * =====================================================
 * BillingApp — Главный layout биллинг-админки
 * =====================================================
 *
 * Legacy аналог: monitoring/src/main/webapp-billing/app.js
 *   → Ext.application({name: 'EDS', launch: ...})
 *   → Ext.tab.Panel как viewport (13 вкладок)
 *
 * Архитектура:
 * ┌──────────────────────────────────────────────────┐
 * │ Tab Bar (вкладки: Учётные записи, Объекты, ...)  │ ← tab-bar
 * ├──────────────────────────────────────────────────┤
 * │                                                  │
 * │  Tab Content (GridPanel + GridToolbar)            │ ← tab-content
 * │  Каждая вкладка = отдельный компонент *Panel     │
 * │                                                  │
 * ├──────────────────────────────────────────────────┤
 * │ Status Bar (кнопка "свернуть все окна")           │ ← status-bar
 * └──────────────────────────────────────────────────┘
 *
 * Вкладки делятся на 2 группы:
 *   - Обычные (5): Учётные записи, Объекты, Группы, Оборудование, Пользователи
 *   - Только для админа (8): Тарифы, Типы оборудования, Ретранслятор, Роли,
 *     Панель событий, Дилеры, Корзина, Техподдержка
 *
 * Данные: пока mock (billingStore.loadData → mockAccounts/mockObjects/...)
 * Будет: REST API через api/endpoints.ts → device-manager / auth-service
 */
import { useEffect } from 'react';
import { useBillingStore } from '../store/billingStore';
import { AccountsPanel } from './AccountsPanel';
import { ObjectsPanel } from './ObjectsPanel';
import { UsersPanel } from './UsersPanel';
import { EquipmentPanel } from './EquipmentPanel';
import { GroupsPanel } from './GroupsPanel';
import { TariffsPanel } from './TariffsPanel';
import { EquipmentTypesPanel } from './EquipmentTypesPanel';
import { RetranslatorsPanel } from './RetranslatorsPanel';
import { RolesPanel } from './RolesPanel';
import { EventsPanel } from './EventsPanel';
import { SubdealersPanel } from './SubdealersPanel';
import { RecycleBinPanel } from './RecycleBinPanel';
import { SupportPanel } from './SupportPanel';
import { AccountForm } from './AccountForm';
import type { TabConfig, TabId, Account } from '../types';

// Конфигурация вкладок (как в legacy app.js — без иконок, точные названия)
const tabs: TabConfig[] = [
  { id: 'accounts', title: 'Учетные записи', adminOnly: false },
  { id: 'objects', title: 'Объекты', adminOnly: false },
  { id: 'groups', title: 'Группы объектов', adminOnly: false },
  { id: 'equipment', title: 'Оборудование', adminOnly: false },
  { id: 'users', title: 'Пользователи', adminOnly: false },
  // Admin-only tabs
  { id: 'tariffs', title: 'Тарифы', adminOnly: true },
  { id: 'equipmentTypes', title: 'Типы оборудования', adminOnly: true },
  { id: 'retranslators', title: 'Ретранслятор', adminOnly: true },
  { id: 'roles', title: 'Роли пользователей', adminOnly: true },
  { id: 'events', title: 'Панель событий', adminOnly: true },
  { id: 'subdealers', title: 'Дилеры', adminOnly: true },
  { id: 'trash', title: 'Корзина', adminOnly: true },
  { id: 'support', title: 'Техподдержка', adminOnly: true },
];

// Рендер контента вкладки
function renderTabContent(tabId: TabId) {
  switch (tabId) {
    case 'accounts':
      return <AccountsPanel />;
    case 'objects':
      return <ObjectsPanel />;
    case 'users':
      return <UsersPanel />;
    case 'equipment':
      return <EquipmentPanel />;
    case 'groups':
      return <GroupsPanel />;
    case 'tariffs':
      return <TariffsPanel />;
    case 'equipmentTypes':
      return <EquipmentTypesPanel />;
    case 'retranslators':
      return <RetranslatorsPanel />;
    case 'roles':
      return <RolesPanel />;
    case 'events':
      return <EventsPanel />;
    case 'subdealers':
      return <SubdealersPanel />;
    case 'trash':
      return <RecycleBinPanel />;
    case 'support':
      return <SupportPanel />;
    default:
      return null;
  }
}

export function BillingApp() {
  const { 
    activeTab, 
    setActiveTab, 
    isAdmin, 
    loadData,
    modalOpen,
    modalData,
    closeModal 
  } = useBillingStore();

  // Загрузка данных при монтировании
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Фильтруем вкладки по правам
  const visibleTabs = tabs.filter(tab => !tab.adminOnly || isAdmin);

  // Обработчик выхода
  const handleLogout = () => {
    window.location.href = '/billing/login.html';
  };

  // Обработчик сохранения аккаунта
  const handleSaveAccount = (data: Partial<Account>) => {
    console.log('Save account:', data);
    // TODO: API call
    closeModal();
  };

  return (
    <div className="billing-app">
      {/* Tab Panel */}
      <div className="tab-panel">
        {/* Tab Bar */}
        <div className="tab-bar">
          <div className="tab-bar-inner">
            {visibleTabs.map(tab => (
              <div
                key={tab.id}
                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.title}</span>
              </div>
            ))}
          </div>
          
          {/* Fill */}
          <div className="tab-bar-fill" />
          
          {/* Logout button */}
          <button className="tab-bar-logout" onClick={handleLogout}>
            Выйти
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {renderTabContent(activeTab)}
        </div>
      </div>

      {/* Status Bar (South Region) */}
      <div className="status-bar">
        <button 
          className="status-bar-btn" 
          title="Свернуть все окна"
          disabled
        >
          <img src="/images/ico24_hideall2.png" alt="" />
        </button>
        <div className="grid-toolbar-separator" />
      </div>

      {/* Модальные окна */}
      {modalOpen === 'accountForm' && (
        <AccountForm
          account={modalData as Account | null}
          onClose={closeModal}
          onSave={handleSaveAccount}
        />
      )}
    </div>
  );
}
