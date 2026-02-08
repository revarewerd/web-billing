/**
 * EventsPanel — вкладка "Панель событий" (только для админа)
 *
 * Legacy: EventsPanel.js → EDS.store.DomainEventsViewStore
 * MongoDB: коллекция `domainEventsView`
 *
 * Лог всех действий в системе (Event Sourcing):
 * создание/удаление объектов, изменения баланса, логины и т.д.
 * Фильтры по типу события и диапазону дат.
 */
import { useMemo, useState } from 'react';
import { GridPanel, type Column } from './GridPanel';
import { GridToolbar } from './GridToolbar';
import { useBillingStore } from '../store/billingStore';
import { mockSystemEvents } from '../api/mock';
import type { SystemEvent } from '../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Маппинг типов событий
const eventTypeLabels: Record<string, string> = {
  'CREATE': 'Создание',
  'UPDATE': 'Обновление',
  'DELETE': 'Удаление',
  'LOGIN': 'Вход',
  'LOGOUT': 'Выход',
  'COMMAND_SENT': 'Команда отправлена',
  'BALANCE_CHANGED': 'Изменение баланса',
  'STATUS_CHANGED': 'Изменение статуса'
};

// Маппинг типов агрегатов
const aggregateTypeLabels: Record<string, string> = {
  'account': 'Учетная запись',
  'object': 'Объект',
  'user': 'Пользователь',
  'equipment': 'Оборудование',
  'tariff': 'Тариф',
  'role': 'Роль',
  'geozone': 'Геозона',
  'group': 'Группа'
};

export function EventsPanel() {
  const { 
    searchQuery,
    setSearchQuery,
    openModal
  } = useBillingStore();
  
  const [selected, setSelected] = useState<string | null>(null);

  // Фильтрация по поиску
  const filteredEvents = useMemo(() => {
    if (!searchQuery) return mockSystemEvents;
    const q = searchQuery.toLowerCase();
    return mockSystemEvents.filter(e => 
      e.aggregateName.toLowerCase().includes(q) ||
      e.userName.toLowerCase().includes(q) ||
      e.payloadType.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Колонки таблицы
  const columns: Column<SystemEvent>[] = useMemo(() => [
    {
      key: 'rownum',
      header: '№',
      width: 40,
      renderer: (_val, _rec, index) => index + 1
    },
    {
      key: 'time',
      header: 'Время',
      width: 140,
      dataIndex: 'time',
      sortable: true,
      renderer: (val) => format(new Date(val as string), 'dd.MM.yyyy HH:mm:ss', { locale: ru })
    },
    {
      key: 'aggregateId',
      header: 'ID',
      width: 80,
      dataIndex: 'aggregateId'
    },
    {
      key: 'aggregateType',
      header: 'Тип',
      width: 130,
      dataIndex: 'aggregateType',
      renderer: (val) => String(aggregateTypeLabels[val as string] || val)
    },
    {
      key: 'aggregateName',
      header: 'Название',
      width: 180,
      dataIndex: 'aggregateName',
      sortable: true
    },
    {
      key: 'payloadType',
      header: 'Событие',
      width: 140,
      dataIndex: 'payloadType',
      renderer: (val) => {
        const label = eventTypeLabels[val as string] || val;
        let color = '#333';
        if (val === 'CREATE') color = '#4caf50';
        if (val === 'DELETE') color = '#f44336';
        if (val === 'UPDATE') color = '#2196f3';
        return <span style={{ color }}>{label as string}</span>;
      }
    },
    {
      key: 'userName',
      header: 'Пользователь',
      width: 130,
      dataIndex: 'userName',
      sortable: true
    },
    {
      key: 'eventDataPreview',
      header: 'Данные',
      flex: 1,
      dataIndex: 'eventDataPreview',
      renderer: (val) => (
        <span 
          style={{ 
            color: '#666', 
            fontSize: '11px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '300px',
            display: 'inline-block'
          }}
          title={String(val)}
        >
          {String(val)}
        </span>
      )
    }
  ], []);

  return (
    <GridPanel
      data={filteredEvents}
      columns={columns}
      getRowKey={(rec) => rec._id}
      selectedKeys={selected ? [selected] : []}
      onSelectionChange={(keys) => setSelected(keys[0] || null)}
      onRowDoubleClick={(record, column) => {
        if (column) {
          openModal('eventDetails', record);
        }
      }}
      toolbar={
        <GridToolbar
          onRefresh={() => console.log('Refresh events')}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          hideAdd={true}
          hideDelete={true}
        />
      }
      summary={
        <span><b>Всего позиций: {filteredEvents.length}</b></span>
      }
    />
  );
}
