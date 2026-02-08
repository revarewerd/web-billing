/**
 * GroupsPanel — вкладка "Группы объектов"
 *
 * Legacy: GroupsOfObjectsPanel.js → EDS.store.GroupsOfObjects
 * MongoDB: хранится в коллекции `users` (поле groups)
 *
 * Группы позволяют пользователю организовать объекты (транспорт)
 * по категориям: "Грузовики", "Легковые", "Курьеры" и т.д.
 * Используется для фильтрации в мониторинге (web-frontend).
 */
import { useMemo } from 'react';
import { GridPanel, type Column } from './GridPanel';
import { GridToolbar } from './GridToolbar';
import { useBillingStore } from '../store/billingStore';
import { mockObjectGroups } from '../api/mock';
import type { ObjectGroup } from '../types';

export function GroupsPanel() {
  const { 
    searchQuery,
    setSearchQuery,
    openModal,
    isAdmin
  } = useBillingStore();

  // Фильтрация по поиску
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return mockObjectGroups;
    const q = searchQuery.toLowerCase();
    return mockObjectGroups.filter(group => 
      group.name.toLowerCase().includes(q) ||
      group.accountName.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Колонки таблицы
  const columns: Column<ObjectGroup>[] = useMemo(() => [
    {
      key: 'rownum',
      header: '№',
      width: 40,
      renderer: (_val, _rec, index) => index + 1
    },
    {
      key: 'name',
      header: 'Имя',
      width: 170,
      dataIndex: 'name',
      sortable: true,
      renderer: (val) => (
        <span style={{ cursor: 'pointer' }} title={String(val)}>{String(val)}</span>
      )
    },
    {
      key: 'accountName',
      header: 'Учетная запись',
      width: 170,
      dataIndex: 'accountName',
      sortable: true
    },
    {
      key: 'objectsCount',
      header: 'Объектов',
      width: 100,
      dataIndex: 'objectsCount',
      align: 'right'
    },
    {
      key: 'objectIds',
      header: 'Объекты',
      flex: 2,
      dataIndex: 'objectIds',
      hidden: !isAdmin,
      renderer: (val) => {
        const ids = val as string[];
        return ids.join(', ');
      }
    }
  ], [isAdmin]);

  return (
    <GridPanel
      data={filteredGroups}
      columns={columns}
      getRowKey={(rec) => rec._id}
      onRowDoubleClick={(record, column) => {
        if (column?.key === 'name' || column?.key === 'rownum') {
          openModal('groupForm', record);
        }
      }}
      onRowClick={(record, column) => {
        if (column?.key === 'name') {
          openModal('groupForm', record);
        }
      }}
      toolbar={
        <GridToolbar
          onAdd={() => openModal('groupForm', null)}
          onDelete={() => console.log('Delete group')}
          onRefresh={() => console.log('Refresh groups')}
          deleteDisabled={true}
          addDisabled={!isAdmin}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
      }
      summary={
        <span><b>Всего позиций: {filteredGroups.length}</b></span>
      }
    />
  );
}
