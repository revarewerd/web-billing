/**
 * =====================================================
 * Zustand Store — глобальное состояние billing admin
 * =====================================================
 *
 * Zustand — лёгкий state manager (альтернатива Redux).
 * Просто: create((set, get) => ({...})) — все данные + методы в одном объекте.
 * Использование: const { accounts, loadData } = useBillingStore();
 *
 * Legacy аналог: каждая вкладка в legacy имела свой Ext.data.Store
 * (напр., EDS.store.AccountsData, EDS.store.AllObjectsService)
 * здесь всё объединено в один store.
 *
 * Сейчас: mock-данные (loadData → mockAccounts)
 * Будет:  loadData → apiClient.getList(accountsApi.list()) → REST
 */

import { create } from 'zustand';
import type { TabId, Account, BillingObject, User, Equipment } from '../types';
import { 
  mockAccounts, 
  mockBillingObjects, 
  mockUsers, 
  mockEquipment 
} from '../api/mock';

interface BillingState {
  // Активная вкладка
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;

  // Права администратора
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;

  // Данные
  accounts: Account[];
  objects: BillingObject[];
  users: User[];
  equipment: Equipment[];

  // Выбранные элементы
  selectedAccountId: string | null;
  selectedObjectIds: string[];
  selectedUserId: string | null;
  selectedEquipmentId: string | null;

  // Методы выбора
  setSelectedAccountId: (id: string | null) => void;
  setSelectedObjectIds: (ids: string[]) => void;
  toggleObjectSelection: (id: string) => void;
  setSelectedUserId: (id: string | null) => void;
  setSelectedEquipmentId: (id: string | null) => void;

  // Модальные окна
  modalOpen: string | null;
  modalData: unknown;
  openModal: (modal: string, data?: unknown) => void;
  closeModal: () => void;

  // Поиск
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Загрузка данных
  loadData: () => void;
  refreshData: () => void;
}

export const useBillingStore = create<BillingState>((set, get) => ({
  // Активная вкладка
  activeTab: 'accounts',
  setActiveTab: (tab) => set({ activeTab: tab, searchQuery: '' }),

  // Права (по умолчанию админ для демо)
  isAdmin: true,
  setIsAdmin: (isAdmin) => set({ isAdmin }),

  // Данные
  accounts: [],
  objects: [],
  users: [],
  equipment: [],

  // Выбранные элементы
  selectedAccountId: null,
  selectedObjectIds: [],
  selectedUserId: null,
  selectedEquipmentId: null,

  // Методы выбора
  setSelectedAccountId: (id) => set({ selectedAccountId: id }),
  setSelectedObjectIds: (ids) => set({ selectedObjectIds: ids }),
  toggleObjectSelection: (id) => {
    const { selectedObjectIds } = get();
    if (selectedObjectIds.includes(id)) {
      set({ selectedObjectIds: selectedObjectIds.filter(i => i !== id) });
    } else {
      set({ selectedObjectIds: [...selectedObjectIds, id] });
    }
  },
  setSelectedUserId: (id) => set({ selectedUserId: id }),
  setSelectedEquipmentId: (id) => set({ selectedEquipmentId: id }),

  // Модальные окна
  modalOpen: null,
  modalData: null,
  openModal: (modal, data) => set({ modalOpen: modal, modalData: data }),
  closeModal: () => set({ modalOpen: null, modalData: null }),

  // Поиск
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Загрузка данных
  loadData: () => {
    set({
      accounts: mockAccounts,
      objects: mockBillingObjects,
      users: mockUsers,
      equipment: mockEquipment
    });
  },
  refreshData: () => {
    get().loadData();
  }
}));
