/**
 * EquipmentTypesPanel — вкладка "Типы оборудования" (только для админа)
 *
 * Legacy: EquipmentTypesPanel.js → EDS.store.EquipmentTypes
 *
 * Справочник моделей трекеров: Teltonika FMB120, Wialon, Ruptela, и т.д.
 * Указывает протокол (teltonika/wialon/ruptela/navtelecom),
 * сервер и порт подключения (connection-manager порты 5001-5004).
 */
import { useMemo } from 'react';
import { GridPanel, type Column } from './GridPanel';
import { GridToolbar } from './GridToolbar';
import { useBillingStore } from '../store/billingStore';
import { mockEquipmentTypes } from '../api/mock';
import type { EquipmentType } from '../types';

export function EquipmentTypesPanel() {
  const { 
    searchQuery,
    setSearchQuery,
    openModal
  } = useBillingStore();

  // Фильтрация по поиску
  const filteredTypes = useMemo(() => {
    if (!searchQuery) return mockEquipmentTypes;
    const q = searchQuery.toLowerCase();
    return mockEquipmentTypes.filter(t => 
      t.equipmentType.toLowerCase().includes(q) ||
      t.mark.toLowerCase().includes(q) ||
      t.model.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Колонки таблицы
  const columns: Column<EquipmentType>[] = useMemo(() => [
    {
      key: 'rownum',
      header: '№',
      width: 40,
      renderer: (_val, _rec, index) => index + 1
    },
    {
      key: 'equipmentType',
      header: 'Тип',
      width: 120,
      dataIndex: 'equipmentType',
      sortable: true
    },
    {
      key: 'mark',
      header: 'Марка',
      width: 120,
      dataIndex: 'mark',
      sortable: true
    },
    {
      key: 'model',
      header: 'Модель',
      width: 150,
      dataIndex: 'model',
      sortable: true
    },
    {
      key: 'server',
      header: 'Сервер',
      flex: 1,
      dataIndex: 'server',
      sortable: true
    },
    {
      key: 'port',
      header: 'Порт',
      width: 80,
      dataIndex: 'port',
      align: 'right'
    }
  ], []);

  return (
    <GridPanel
      data={filteredTypes}
      columns={columns}
      getRowKey={(rec) => rec._id}
      onRowDoubleClick={(record, column) => {
        if (column?.key === 'equipmentType' || column?.key === 'mark' || column?.key === 'model') {
          openModal('equipmentTypeForm', record);
        }
      }}
      toolbar={
        <GridToolbar
          onAdd={() => openModal('equipmentTypeForm', null)}
          onDelete={() => console.log('Delete equipment type')}
          onRefresh={() => console.log('Refresh equipment types')}
          deleteDisabled={true}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
      }
      summary={
        <span><b>Всего позиций: {filteredTypes.length}</b></span>
      }
    />
  );
}
