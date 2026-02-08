/**
 * SubdealersPanel — вкладка "Дилеры" (только для админа)
 *
 * Legacy: AllSubdealersPanel.js → EDS.store.AllSubdealers
 *
 * Субдилер = партнёр, который перепродаёт услуги мониторинга.
 * Имеет свои учётные записи, комиссию, баланс.
 */
import { useMemo, useState } from 'react';
import { GridPanel, type Column } from './GridPanel';
import { GridToolbar } from './GridToolbar';
import { useBillingStore } from '../store/billingStore';
import { mockSubdealers } from '../api/mock';
import type { Subdealer } from '../types';

export function SubdealersPanel() {
  const { 
    searchQuery,
    setSearchQuery,
    openModal
  } = useBillingStore();
  
  const [selected, setSelected] = useState<string | null>(null);

  // Фильтрация по поиску
  const filteredSubdealers = useMemo(() => {
    if (!searchQuery) return mockSubdealers;
    const q = searchQuery.toLowerCase();
    return mockSubdealers.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.contactPerson.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Суммарный баланс
  const totalBalance = useMemo(() => 
    filteredSubdealers.reduce((sum, s) => sum + s.balance, 0),
    [filteredSubdealers]
  );

  // Колонки таблицы
  const columns: Column<Subdealer>[] = useMemo(() => [
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
      renderer: () => <img src="/images/account-icon16.png" alt="" style={{ cursor: 'pointer' }} />
    },
    {
      key: 'name',
      header: 'Имя',
      width: 200,
      dataIndex: 'name',
      sortable: true,
      renderer: (val) => (
        <span style={{ cursor: 'pointer', color: '#15c' }}>{String(val)}</span>
      )
    },
    {
      key: 'contactPerson',
      header: 'Контактное лицо',
      width: 180,
      dataIndex: 'contactPerson',
      sortable: true
    },
    {
      key: 'email',
      header: 'Email',
      width: 200,
      dataIndex: 'email'
    },
    {
      key: 'phone',
      header: 'Телефон',
      width: 140,
      dataIndex: 'phone'
    },
    {
      key: 'accountsCount',
      header: 'Уч. записей',
      width: 100,
      dataIndex: 'accountsCount',
      align: 'right'
    },
    {
      key: 'objectsCount',
      header: 'Объектов',
      width: 80,
      dataIndex: 'objectsCount',
      align: 'right'
    },
    {
      key: 'balance',
      header: 'Баланс',
      width: 120,
      dataIndex: 'balance',
      align: 'right',
      renderer: (val) => {
        const value = val as number;
        const color = value < 0 ? '#f44336' : value > 0 ? '#4caf50' : '#333';
        return <span style={{ color, fontWeight: 500 }}>{value.toFixed(2)} р.</span>;
      }
    },
    {
      key: 'commission',
      header: 'Комиссия %',
      width: 100,
      dataIndex: 'commission',
      align: 'right',
      renderer: (val) => `${val}%`
    }
  ], []);

  // Дополнительные кнопки
  const customButtons = (
    <>
      <button 
        className="x-btn"
        onClick={() => {
          const rec = mockSubdealers.find(s => s._id === selected);
          if (rec) openModal('subdealerSettings', rec);
        }}
        disabled={!selected}
        title="Настройки"
      >
        <img src="/images/ico16_options.png" alt="" />
      </button>
      <button 
        className="x-btn"
        onClick={() => {
          const rec = mockSubdealers.find(s => s._id === selected);
          if (rec) openModal('subdealerStats', rec);
        }}
        disabled={!selected}
        title="Статистика"
      >
        <img src="/images/ico16_report.png" alt="" />
      </button>
    </>
  );

  return (
    <GridPanel
      data={filteredSubdealers}
      columns={columns}
      getRowKey={(rec) => rec._id}
      selectedKeys={selected ? [selected] : []}
      onSelectionChange={(keys) => setSelected(keys[0] || null)}
      onRowDoubleClick={(record, column) => {
        if (column?.key === 'name' || column?.key === 'rownum') {
          openModal('subdealerForm', record);
        }
      }}
      toolbar={
        <GridToolbar
          onAdd={() => openModal('subdealerForm', null)}
          onDelete={() => console.log('Delete subdealer')}
          onRefresh={() => console.log('Refresh subdealers')}
          deleteDisabled={!selected}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          customButtons={customButtons}
        />
      }
      summary={
        <span>
          <b>Всего позиций: {filteredSubdealers.length}</b>
          <span style={{ marginLeft: 20 }}>
            Общий баланс: <b style={{ color: totalBalance >= 0 ? '#4caf50' : '#f44336' }}>
              {totalBalance.toFixed(2)} р.
            </b>
          </span>
        </span>
      }
    />
  );
}
