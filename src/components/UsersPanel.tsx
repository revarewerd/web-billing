/**
 * UsersPanel — вкладка "Пользователи"
 *
 * Legacy: AllUsersPanel.js → EDS.store.AllUsersService
 * MongoDB: коллекция `users`
 *
 * Пользователь — логин для входа в мониторинг (web-frontend).
 * Привязан к учётной записи (Account). Может иметь роль с
 * ограниченными правами (только просмотр, без команд и т.д.)
 */
import { useMemo } from 'react';
import { GridPanel, type Column } from './GridPanel';
import { GridToolbar } from './GridToolbar';
import { useBillingStore } from '../store/billingStore';
import type { User } from '../types';

export function UsersPanel() {
  const { 
    users, 
    selectedUserId, 
    setSelectedUserId,
    searchQuery,
    setSearchQuery,
    openModal,
    refreshData,
    isAdmin
  } = useBillingStore();

  // Фильтрация по поиску
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(q) ||
      user.userType.toLowerCase().includes(q) ||
      user.mainAccName.toLowerCase().includes(q) ||
      user.comment.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  // Колонки таблицы (как в legacy AllUsersPanel.js)
  const columns: Column<User>[] = useMemo(() => [
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
        <img src="/images/ico16_user.png" alt="" style={{ cursor: 'pointer' }} />
      )
    },
    {
      key: 'name',
      header: 'Имя',
      flex: 1,
      dataIndex: 'name',
      sortable: true,
      renderer: (val) => (
        <span style={{ cursor: 'pointer' }}>{String(val)}</span>
      )
    },
    {
      key: 'userType',
      header: 'Тип пользователя',
      flex: 1,
      dataIndex: 'userType'
    },
    {
      key: 'comment',
      header: 'Комментарий',
      flex: 1,
      dataIndex: 'comment',
      sortable: true,
      hidden: !isAdmin
    },
    {
      key: 'mainAccName',
      header: 'Основная учетная запись',
      flex: 1,
      dataIndex: 'mainAccName',
      sortable: true
    },
    {
      key: 'enabled',
      header: 'Статус',
      width: 100,
      dataIndex: 'enabled',
      renderer: (val) => val ? 'Включен' : 'Заблокирован'
    },
    {
      key: 'login',
      header: 'Войти',
      width: 150,
      dataIndex: 'name',
      renderer: (val) => (
        <a 
          href={`/monitoring?login=${encodeURIComponent(String(val))}`} 
          target="_blank"
          rel="noreferrer"
        >
          Войти как пользователь
        </a>
      )
    },
    {
      key: 'permissions',
      header: 'Права',
      width: 60,
      align: 'center',
      renderer: (_val, record) => (
        <img 
          src="/images/ico16_options.png" 
          alt="" 
          title="Редактировать права пользователя"
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            openModal('userPermissions', record);
          }}
        />
      )
    },
    {
      key: 'lastLoginDate',
      header: 'Последний вход',
      flex: 1,
      dataIndex: 'lastLoginDate',
      sortable: true,
      renderer: (val) => {
        if (!val) return '';
        const date = new Date(val as string);
        return date.toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }
    },
    {
      key: 'lastAction',
      header: 'Последнее действие',
      flex: 1,
      dataIndex: 'lastAction',
      sortable: true,
      renderer: (val) => {
        if (!val) return '';
        const date = new Date(val as string);
        return date.toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }
    }
  ], [isAdmin, openModal]);

  // Получить класс строки
  const getRowClass = (record: User) => {
    if (!record.enabled) return 'blocked';
    if (record.hasBlockedMainAccount) return 'blocked';
    if (record.hasObjectsOnBlockedAccount) return 'warning';
    return '';
  };

  return (
    <GridPanel
      data={filteredUsers}
      columns={columns}
      getRowKey={(rec) => rec._id}
      getRowClass={getRowClass}
      selectedKeys={selectedUserId ? [selectedUserId] : []}
      onSelectionChange={(keys) => setSelectedUserId(keys[0] || null)}
      onRowDoubleClick={(record, column) => {
        if (column?.key === 'name' || column?.key === 'icon') {
          openModal('userForm', record);
        }
      }}
      onRowClick={(record, column) => {
        if (column?.key === 'icon') {
          openModal('userForm', record);
        } else if (column?.key === 'permissions') {
          openModal('userPermissions', record);
        }
      }}
      toolbar={
        <GridToolbar
          onAdd={() => openModal('userForm', null)}
          onDelete={() => {
            if (selectedUserId) {
              console.log('Delete user:', selectedUserId);
            }
          }}
          onRefresh={refreshData}
          onExport={() => console.log('Export users')}
          deleteDisabled={!selectedUserId || !isAdmin}
          addDisabled={!isAdmin}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
      }
      summary={
        <span><b>Всего позиций: {filteredUsers.length}</b></span>
      }
    />
  );
}
