/**
 * RolesPanel — вкладка "Роли пользователей" (только для админа)
 *
 * Legacy: RolesPanel.js → EDS.store.Roles
 * MongoDB: коллекция `billingRoles`
 *
 * Роль определяет набор прав (permissions/authorities).
 * Примеры: "Админ", "Менеджер", "Пользователь только просмотр".
 * Привязывается к пользователю при создании.
 */
import { useMemo, useState } from 'react';
import { GridPanel, type Column } from './GridPanel';
import { GridToolbar } from './GridToolbar';
import { useBillingStore } from '../store/billingStore';
import { mockRoles } from '../api/mock';
import type { Role } from '../types';

// Маппинг полномочий на читаемые названия
const authorityLabels: Record<string, string> = {
  'ROLE_ADMIN': 'Администратор',
  'ROLE_USER': 'Пользователь',
  'ROLE_DEALER': 'Дилер',
  'VIEW_OBJECTS': 'Просмотр объектов',
  'EDIT_OBJECTS': 'Редактирование объектов',
  'VIEW_TRACKS': 'Просмотр треков',
  'VIEW_REPORTS': 'Просмотр отчетов',
  'SEND_COMMANDS': 'Отправка команд',
  'VIEW_EQUIPMENT': 'Просмотр оборудования',
  'EDIT_EQUIPMENT': 'Редактирование оборудования',
  'VIEW_USERS': 'Просмотр пользователей',
  'EDIT_USERS': 'Редактирование пользователей',
  'VIEW_GEOZONES': 'Просмотр геозон',
  'EDIT_GEOZONES': 'Редактирование геозон',
  'VIEW_BILLING': 'Просмотр биллинга',
  'EDIT_BILLING': 'Редактирование биллинга'
};

export function RolesPanel() {
  const { 
    searchQuery,
    setSearchQuery,
    openModal
  } = useBillingStore();
  
  const [selected, setSelected] = useState<string | null>(null);

  // Фильтрация по поиску
  const filteredRoles = useMemo(() => {
    if (!searchQuery) return mockRoles;
    const q = searchQuery.toLowerCase();
    return mockRoles.filter(r => 
      r.name.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Колонки таблицы
  const columns: Column<Role>[] = useMemo(() => [
    {
      key: 'rownum',
      header: '№',
      width: 40,
      renderer: (_val, _rec, index) => index + 1
    },
    {
      key: 'name',
      header: 'Имя',
      width: 200,
      dataIndex: 'name',
      sortable: true,
      renderer: (val) => (
        <span style={{ cursor: 'pointer', fontWeight: 500 }}>{String(val)}</span>
      )
    },
    {
      key: 'authorities',
      header: 'Полномочия',
      flex: 1,
      dataIndex: 'authorities',
      renderer: (val) => {
        const authorities = val as string[];
        return (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '4px',
            maxHeight: '40px',
            overflow: 'hidden'
          }}>
            {authorities.slice(0, 5).map((auth, i) => (
              <span 
                key={i}
                style={{
                  backgroundColor: '#e0e0e0',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontSize: '11px'
                }}
              >
                {authorityLabels[auth] || auth}
              </span>
            ))}
            {authorities.length > 5 && (
              <span style={{ fontSize: '11px', color: '#666' }}>
                +{authorities.length - 5}
              </span>
            )}
          </div>
        );
      }
    },
    {
      key: 'usersCount',
      header: 'Пользователей',
      width: 120,
      dataIndex: 'usersCount',
      align: 'right'
    }
  ], []);

  return (
    <GridPanel
      data={filteredRoles}
      columns={columns}
      getRowKey={(rec) => rec._id}
      selectedKeys={selected ? [selected] : []}
      onSelectionChange={(keys) => setSelected(keys[0] || null)}
      onRowDoubleClick={(record, column) => {
        if (column?.key === 'name' || column?.key === 'rownum') {
          openModal('roleForm', record);
        }
      }}
      toolbar={
        <GridToolbar
          onAdd={() => openModal('roleForm', null)}
          onDelete={() => console.log('Delete role')}
          onRefresh={() => console.log('Refresh roles')}
          deleteDisabled={!selected}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
      }
      summary={
        <span><b>Всего позиций: {filteredRoles.length}</b></span>
      }
    />
  );
}
