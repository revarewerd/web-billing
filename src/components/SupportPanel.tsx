/**
 * SupportPanel — вкладка "Техподдержка" (только для админа)
 *
 * Legacy: SupportPanel.js → EDS.store.SupportRequests
 * MongoDB: коллекция `supportRequest`
 *
 * Тикеты поддержки от клиентов.
 * Категории: equipment, program, finance.
 * Статусы: new → open → in-progress → resolved → close.
 * Переписка через messages[] (как чат).
 */
import { useMemo, useState } from 'react';
import { GridPanel, type Column } from './GridPanel';
import { GridToolbar } from './GridToolbar';
import { useBillingStore } from '../store/billingStore';
import { mockSupportTickets } from '../api/mock';
import type { SupportTicket } from '../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Маппинг категорий
const categoryLabels: Record<string, string> = {
  'equipment': 'Вопросы по оборудованию',
  'program': 'Вопросы по программе',
  'finance': 'Финансовые вопросы'
};

// Маппинг статусов
const statusLabels: Record<string, string> = {
  'open': 'Открыт',
  'in-progress': 'В работе',
  'close': 'Закрыт'
};

const statusColors: Record<string, string> = {
  'open': '#f44336',
  'in-progress': '#ff9800',
  'close': '#4caf50'
};

export function SupportPanel() {
  const { 
    searchQuery,
    setSearchQuery,
    openModal
  } = useBillingStore();
  
  const [selected, setSelected] = useState<string | null>(null);

  // Фильтрация по поиску
  const filteredTickets = useMemo(() => {
    if (!searchQuery) return mockSupportTickets;
    const q = searchQuery.toLowerCase();
    return mockSupportTickets.filter(t => 
      t.subject.toLowerCase().includes(q) ||
      t.accountName.toLowerCase().includes(q) ||
      t.userName.toLowerCase().includes(q) ||
      t._id.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Статистика
  const stats = useMemo(() => ({
    open: filteredTickets.filter(t => t.status === 'open' || t.status === 'new').length,
    inProgress: filteredTickets.filter(t => t.status === 'in-progress' || t.status === 'pending').length,
    closed: filteredTickets.filter(t => t.status === 'close' || t.status === 'resolved').length
  }), [filteredTickets]);

  // Колонки таблицы
  const columns: Column<SupportTicket>[] = useMemo(() => [
    {
      key: 'rownum',
      header: '№',
      width: 40,
      renderer: (_val, _rec, index) => index + 1
    },
    {
      key: '_id',
      header: 'ID',
      width: 80,
      dataIndex: '_id',
      renderer: (val) => (
        <span style={{ fontFamily: 'monospace', fontSize: '11px' }}>#{String(val)}</span>
      )
    },
    {
      key: 'createdAt',
      header: 'Дата',
      width: 140,
      dataIndex: 'createdAt',
      sortable: true,
      renderer: (val) => format(new Date(val as string), 'dd.MM.yyyy HH:mm', { locale: ru })
    },
    {
      key: 'subject',
      header: 'Тема',
      width: 250,
      dataIndex: 'subject',
      sortable: true,
      renderer: (val) => (
        <span style={{ cursor: 'pointer' }} title={String(val)}>{String(val)}</span>
      )
    },
    {
      key: 'accountName',
      header: 'Учетная запись',
      width: 180,
      dataIndex: 'accountName',
      sortable: true
    },
    {
      key: 'userName',
      header: 'Пользователь',
      width: 120,
      dataIndex: 'userName'
    },
    {
      key: 'userPhone',
      header: 'Телефон',
      width: 120,
      dataIndex: 'userPhone'
    },
    {
      key: 'category',
      header: 'Категория',
      width: 180,
      dataIndex: 'category',
      renderer: (val) => String(categoryLabels[val as string] || val)
    },
    {
      key: 'priority',
      header: 'Приоритет',
      width: 100,
      dataIndex: 'priority',
      renderer: (val) => {
        const colors: Record<string, string> = {
          'low': '#9e9e9e',
          'normal': '#2196f3',
          'high': '#f44336'
        };
        const labels: Record<string, string> = {
          'low': 'Низкий',
          'normal': 'Обычный',
          'high': 'Высокий'
        };
        return (
          <span style={{ 
            color: colors[val as string] || '#333',
            fontWeight: val === 'high' ? 600 : 400
          }}>
            {String(labels[val as string] || val)}
          </span>
        );
      }
    },
    {
      key: 'status',
      header: 'Статус',
      width: 100,
      dataIndex: 'status',
      renderer: (val) => (
        <span style={{ 
          color: statusColors[val as string] || '#333',
          fontWeight: 500
        }}>
          {String(statusLabels[val as string] || val)}
        </span>
      )
    }
  ], []);

  // Дополнительные кнопки
  const customButtons = (
    <>
      <button 
        className="x-btn"
        onClick={() => {
          const ticket = mockSupportTickets.find(t => t._id === selected);
          if (ticket) openModal('ticketReply', ticket);
        }}
        disabled={!selected}
        title="Ответить"
      >
        <img src="/images/ico16_eventsmsgs.png" alt="" />
        <span>Ответить</span>
      </button>
      <button 
        className="x-btn"
        onClick={() => {
          console.log('Close ticket:', selected);
          // TODO: API call to close ticket
        }}
        disabled={!selected}
        title="Закрыть тикет"
      >
        <img src="/images/ico16_okcrc.png" alt="" />
        <span>Закрыть</span>
      </button>
    </>
  );

  return (
    <GridPanel
      data={filteredTickets}
      columns={columns}
      getRowKey={(rec) => rec._id}
      selectedKeys={selected ? [selected] : []}
      onSelectionChange={(keys) => setSelected(keys[0] || null)}
      onRowDoubleClick={(record, column) => {
        if (column) {
          openModal('ticketDetails', record);
        }
      }}
      getRowClass={(record) => {
        if (record.priority === 'high' && record.status !== 'close') {
          return 'warning';
        }
        return '';
      }}
      toolbar={
        <GridToolbar
          onRefresh={() => console.log('Refresh tickets')}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          hideAdd={true}
          hideDelete={true}
          customButtons={customButtons}
        />
      }
      summary={
        <span>
          <b>Всего: {filteredTickets.length}</b>
          <span style={{ marginLeft: 20, color: statusColors.open }}>
            Открыто: <b>{stats.open}</b>
          </span>
          <span style={{ marginLeft: 15, color: statusColors['in-progress'] }}>
            В работе: <b>{stats.inProgress}</b>
          </span>
          <span style={{ marginLeft: 15, color: statusColors.close }}>
            Закрыто: <b>{stats.closed}</b>
          </span>
        </span>
      }
    />
  );
}
