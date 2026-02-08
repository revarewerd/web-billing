/**
 * TariffsPanel — вкладка "Тарифы" (только для админа)
 *
 * Legacy: AllTariffsPanel.js → EDS.store.AllTariffs
 * MongoDB: коллекция `tariffs`
 *
 * Тариф определяет абонентскую плату за объект.
 * Привязывается к учётной записи.
 * Суммы в КОПЕЙКАХ (делим на 100 для отображения).
 */
import { useMemo } from 'react';
import { GridPanel, type Column } from './GridPanel';
import { GridToolbar } from './GridToolbar';
import { useBillingStore } from '../store/billingStore';
import { mockTariffs } from '../api/mock';
import type { Tariff } from '../types';

export function TariffsPanel() {
  const { 
    searchQuery,
    setSearchQuery,
    openModal
  } = useBillingStore();

  // Фильтрация по поиску
  const filteredTariffs = useMemo(() => {
    if (!searchQuery) return mockTariffs;
    const q = searchQuery.toLowerCase();
    return mockTariffs.filter(t => 
      t.name.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Колонки таблицы
  const columns: Column<Tariff>[] = useMemo(() => [
    {
      key: 'rownum',
      header: '№',
      width: 40,
      renderer: (_val, _rec, index) => index + 1
    },
    {
      key: 'icon',
      header: '',
      width: 30,
      renderer: () => (
        <img src="/images/coin.gif" alt="" style={{ width: 16, height: 16 }} />
      )
    },
    {
      key: 'name',
      header: 'Имя',
      flex: 1,
      dataIndex: 'name',
      sortable: true,
      renderer: (val) => (
        <span style={{ cursor: 'pointer', color: '#15c' }} title={String(val)}>{String(val)}</span>
      )
    },
    {
      key: 'monthlyFee',
      header: 'Абон. плата',
      width: 100,
      dataIndex: 'monthlyFee',
      align: 'right',
      renderer: (val) => `${val} р.`
    },
    {
      key: 'objectsCount',
      header: 'Объектов',
      width: 80,
      dataIndex: 'objectsCount',
      align: 'right'
    },
    {
      key: 'period',
      header: 'Период',
      width: 80,
      dataIndex: 'period',
      renderer: (val) => {
        switch(val) {
          case 'month': return 'Месяц';
          case 'day': return 'День';
          case 'year': return 'Год';
          default: return String(val);
        }
      }
    }
  ], []);

  return (
    <GridPanel
      data={filteredTariffs}
      columns={columns}
      getRowKey={(rec) => rec._id}
      onRowDoubleClick={(record, column) => {
        if (column?.key === 'name' || column?.key === 'icon') {
          openModal('tariffForm', record);
        }
      }}
      onRowClick={(record, column) => {
        if (column?.key === 'icon') {
          openModal('tariffForm', record);
        }
      }}
      toolbar={
        <GridToolbar
          onAdd={() => openModal('tariffForm', null)}
          onDelete={() => console.log('Delete tariff')}
          onRefresh={() => console.log('Refresh tariffs')}
          deleteDisabled={true}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
      }
      summary={
        <span><b>Всего позиций: {filteredTariffs.length}</b></span>
      }
    />
  );
}
