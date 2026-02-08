/**
 * RecycleBinPanel — вкладка "Корзина" (только для админа)
 *
 * Legacy: RecycleBinPanel.js → EDS.store.RecycleBin
 *
 * Soft-delete: удалённые объекты попадают сюда.
 * Можно восстановить или удалить окончательно.
 * Типы: account, object, user, equipment.
 */
import { useMemo, useState } from 'react';
import { GridPanel, type Column } from './GridPanel';
import { GridToolbar } from './GridToolbar';
import { useBillingStore } from '../store/billingStore';
import { mockTrashItems } from '../api/mock';
import type { TrashItem } from '../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Маппинг типов сущностей
const entityTypeLabels: Record<string, string> = {
  'account': 'Учетная запись',
  'object': 'Объект',
  'user': 'Пользователь',
  'equipment': 'Оборудование',
  'tariff': 'Тариф',
  'role': 'Роль',
  'geozone': 'Геозона',
  'group': 'Группа объектов',
  'retranslator': 'Ретранслятор'
};

// Иконки для типов
const entityTypeIcons: Record<string, string> = {
  'account': '/images/coins.png',
  'object': '/images/lorry.png',
  'user': '/images/user.png',
  'equipment': '/images/server.png',
  'geozone': '/images/zone.png'
};

export function RecycleBinPanel() {
  const { 
    searchQuery,
    setSearchQuery,
    openModal
  } = useBillingStore();
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Фильтрация по поиску
  const filteredItems = useMemo(() => {
    if (!searchQuery) return mockTrashItems;
    const q = searchQuery.toLowerCase();
    return mockTrashItems.filter(item => 
      item.entityName.toLowerCase().includes(q) ||
      item.accountName.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Колонки таблицы
  const columns: Column<TrashItem>[] = useMemo(() => [
    {
      key: 'rownum',
      header: '№',
      width: 40,
      renderer: (_val, _rec, index) => index + 1
    },
    {
      key: 'removalTime',
      header: 'Время удаления',
      width: 140,
      dataIndex: 'removalTime',
      sortable: true,
      renderer: (val) => format(new Date(val as string), 'dd.MM.yyyy HH:mm', { locale: ru })
    },
    {
      key: 'type',
      header: 'Тип',
      width: 40,
      dataIndex: 'type',
      renderer: (val) => {
        const icon = entityTypeIcons[val as string];
        if (icon) {
          return <img src={icon} alt="" style={{ width: 16, height: 16 }} />;
        }
        return null;
      }
    },
    {
      key: 'typeName',
      header: 'Категория',
      width: 140,
      dataIndex: 'type',
      renderer: (val) => String(entityTypeLabels[val as string] || val)
    },
    {
      key: 'entityName',
      header: 'Название',
      width: 200,
      dataIndex: 'entityName',
      sortable: true
    },
    {
      key: 'accountName',
      header: 'Учетная запись',
      width: 180,
      dataIndex: 'accountName',
      sortable: true
    },
    {
      key: 'payload',
      header: 'Данные',
      flex: 1,
      dataIndex: 'payload',
      renderer: (val) => (
        <span 
          style={{ 
            color: '#666', 
            fontSize: '11px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '250px',
            display: 'inline-block'
          }}
          title={String(val)}
        >
          {String(val)}
        </span>
      )
    }
  ], []);

  // Кнопки восстановления и удаления
  const customButtons = (
    <>
      <button 
        className="x-btn"
        onClick={() => {
          console.log('Restore items:', Array.from(selectedIds));
          // TODO: API call to restore
        }}
        disabled={selectedIds.size === 0}
        title="Восстановить"
      >
        <img src="/images/ico16_okcrc.png" alt="" />
        <span>Восстановить</span>
      </button>
      <button 
        className="x-btn"
        onClick={() => {
          if (confirm('Удалить выбранные элементы безвозвратно?')) {
            console.log('Permanently delete:', Array.from(selectedIds));
            // TODO: API call to delete permanently
          }
        }}
        disabled={selectedIds.size === 0}
        title="Удалить навсегда"
      >
        <img src="/images/ico16_cancel.png" alt="" />
        <span>Удалить навсегда</span>
      </button>
    </>
  );

  // Обработчик выбора строки
  const handleRowClick = (record: TrashItem) => {
    const newSelected = new Set(selectedIds);
    // Одиночный выбор (для множественного нужен keyboard event)
    newSelected.clear();
    newSelected.add(record._id);
    setSelectedIds(newSelected);
  };

  return (
    <GridPanel
      data={filteredItems}
      columns={columns}
      getRowKey={(rec) => rec._id}
      selectedKeys={Array.from(selectedIds)}
      onSelectionChange={(keys) => setSelectedIds(new Set(keys))}
      onRowDoubleClick={(record, column) => {
        if (column) {
          openModal('trashDetails', record);
        }
      }}
      toolbar={
        <GridToolbar
          onRefresh={() => console.log('Refresh trash')}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          hideAdd={true}
          hideDelete={true}
          customButtons={customButtons}
        />
      }
      summary={
        <span>
          <b>Всего в корзине: {filteredItems.length}</b>
          {selectedIds.size > 0 && (
            <span style={{ marginLeft: 20 }}>
              Выбрано: <b>{selectedIds.size}</b>
            </span>
          )}
        </span>
      }
    />
  );
}
