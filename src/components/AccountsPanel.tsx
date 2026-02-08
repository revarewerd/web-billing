/**
 * =====================================================
 * AccountsPanel — вкладка "Учётные записи"
 * =====================================================
 *
 * Legacy аналог: AllAccountsPanel.js (extends WRGrid)
 * Store: EDS.store.AccountsData → accountsStoreService.loadObjects()
 * MongoDB: коллекция `accounts`
 *
 * Это главная вкладка биллинга. Учётная запись — это клиент
 * (компания/ФЛ), к которому привязаны объекты (GPS-трекеры),
 * пользователи, оборудование и баланс.
 *
 * Колонки: №, Иконка, Имя, Комментарий (только admin),
 * Баланс, Аб.плата, Тариф, Объекты, Оборуд., Польз., Статус
 *
 * Деньги в копейках → formatMoney(делит на 100, добавляет "руб.")
 */
import { useMemo } from 'react';
import { GridPanel, type Column } from './GridPanel';
import { GridToolbar } from './GridToolbar';
import { useBillingStore } from '../store/billingStore';
import { formatMoney } from '../api/mock';
import type { Account } from '../types';

export function AccountsPanel() {
  const { 
    accounts, 
    selectedAccountId, 
    setSelectedAccountId,
    searchQuery,
    setSearchQuery,
    openModal,
    refreshData,
    isAdmin
  } = useBillingStore();

  // Фильтрация по поиску
  const filteredAccounts = useMemo(() => {
    if (!searchQuery) return accounts;
    const q = searchQuery.toLowerCase();
    return accounts.filter(acc => 
      acc.name.toLowerCase().includes(q) ||
      acc.comment.toLowerCase().includes(q) ||
      acc.plan.toLowerCase().includes(q)
    );
  }, [accounts, searchQuery]);

  // Колонки таблицы (как в legacy)
  const columns: Column<Account>[] = useMemo(() => [
    {
      key: 'rownum',
      header: '№',
      width: 40,
      renderer: (_val, _rec, index) => index + 1
    },
    {
      key: 'icon',
      header: '',
      width: 20,
      renderer: () => (
        <img src="/images/account-icon16.png" alt="" style={{ cursor: 'pointer' }} />
      )
    },
    {
      key: 'name',
      header: 'Имя',
      width: 200,
      dataIndex: 'name',
      sortable: true,
      renderer: (val) => (
        <span style={{ cursor: 'pointer' }}>{String(val)}</span>
      )
    },
    {
      key: 'comment',
      header: 'Комментарий',
      width: 200,
      dataIndex: 'comment',
      sortable: true,
      hidden: !isAdmin
    },
    {
      key: 'balance',
      header: 'Баланс',
      width: 120,
      dataIndex: 'balance',
      sortable: true,
      align: 'right',
      renderer: (val) => (
        <span className="ballink">{formatMoney(val as number)}</span>
      )
    },
    {
      key: 'cost',
      header: 'Аб. Плата',
      width: 120,
      dataIndex: 'cost',
      sortable: true,
      align: 'right',
      renderer: (val) => (
        <span className="ballink">{formatMoney(val as number)}</span>
      )
    },
    {
      key: 'plan',
      header: 'Тариф',
      width: 130,
      dataIndex: 'plan',
      sortable: true
    },
    {
      key: 'objectsCount',
      header: 'Объекты',
      width: 80,
      dataIndex: 'objectsCount',
      align: 'right',
      renderer: (val) => (
        <span className="ballink">{String(val)}</span>
      )
    },
    {
      key: 'equipmentsCount',
      header: 'Оборудование',
      width: 80,
      dataIndex: 'equipmentsCount',
      align: 'right',
      renderer: (val) => (
        <span className="ballink">{String(val)}</span>
      )
    },
    {
      key: 'usersCount',
      header: 'Пользователи',
      width: 100,
      dataIndex: 'usersCount',
      align: 'right',
      renderer: (val) => (
        <span className="ballink">{String(val)}</span>
      )
    },
    {
      key: 'status',
      header: 'Статус',
      width: 100,
      dataIndex: 'status',
      renderer: (val) => val ? 'Включен' : 'Заблокирован'
    }
  ], [isAdmin]);

  // Получить класс строки
  const getRowClass = (record: Account) => {
    return record.status === false ? 'blocked' : '';
  };

  // Суммарные значения
  const totalCost = filteredAccounts.reduce((sum, acc) => sum + acc.cost, 0);
  const totalObjects = filteredAccounts.reduce((sum, acc) => sum + acc.objectsCount, 0);
  const totalEquipments = filteredAccounts.reduce((sum, acc) => sum + acc.equipmentsCount, 0);

  return (
    <GridPanel
      data={filteredAccounts}
      columns={columns}
      getRowKey={(rec) => rec._id}
      getRowClass={getRowClass}
      selectedKeys={selectedAccountId ? [selectedAccountId] : []}
      onSelectionChange={(keys) => setSelectedAccountId(keys[0] || null)}
      onRowDoubleClick={(record, column) => {
        if (column?.key === 'name' || column?.key === 'icon') {
          openModal('accountForm', record);
        } else if (column?.key === 'balance') {
          openModal('balanceHistory', record);
        } else if (column?.key === 'objectsCount') {
          openModal('accountObjects', record);
        }
      }}
      onRowClick={(record, column) => {
        if (column?.key === 'icon') {
          openModal('accountForm', record);
        }
      }}
      toolbar={
        <GridToolbar
          onAdd={() => openModal('accountForm', null)}
          onDelete={() => {
            if (selectedAccountId) {
              // TODO: delete account
              console.log('Delete account:', selectedAccountId);
            }
          }}
          onRefresh={refreshData}
          onExport={() => console.log('Export accounts')}
          deleteDisabled={!selectedAccountId || !isAdmin}
          addDisabled={!isAdmin}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
      }
      summary={
        <>
          <span><b>Всего позиций: {filteredAccounts.length}</b></span>
          <span>Аб. плата: <b>{formatMoney(totalCost)}</b></span>
          <span>Объекты: <b>{totalObjects}</b></span>
          <span>Оборудование: <b>{totalEquipments}</b></span>
        </>
      }
    />
  );
}
