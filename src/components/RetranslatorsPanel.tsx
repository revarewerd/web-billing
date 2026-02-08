/**
 * RetranslatorsPanel — вкладка "Ретранслятор" (только для админа)
 *
 * Legacy: RetranslatorPanel.js → EDS.store.RetranslatorStore
 *
 * Ретрансляция = пересылка GPS-данных на внешний сервер.
 * Например, клиент хочет дублировать данные трекера на свой Wialon.
 * Настройки: хост, порт, протокол, привязанные объекты.
 */
import { useMemo, useState } from 'react';
import { GridPanel, type Column } from './GridPanel';
import { GridToolbar } from './GridToolbar';
import { useBillingStore } from '../store/billingStore';
import { mockRetranslators } from '../api/mock';
import type { Retranslator } from '../types';

export function RetranslatorsPanel() {
  const { 
    searchQuery,
    setSearchQuery,
    openModal
  } = useBillingStore();
  
  const [selected, setSelected] = useState<string | null>(null);

  // Фильтрация по поиску
  const filteredRetranslators = useMemo(() => {
    if (!searchQuery) return mockRetranslators;
    const q = searchQuery.toLowerCase();
    return mockRetranslators.filter(r => 
      r.name.toLowerCase().includes(q) ||
      r.host.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Колонки таблицы
  const columns: Column<Retranslator>[] = useMemo(() => [
    {
      key: 'rownum',
      header: '№',
      width: 40,
      renderer: (_val, _rec, index) => index + 1
    },
    {
      key: 'status',
      header: '',
      width: 30,
      renderer: (_val, rec) => (
        <img 
          src={rec.isActive ? '/images/ico16_globeact.png' : '/images/ico16_globe.png'}
          alt=""
          title={rec.isActive ? 'Активен' : 'Остановлен'}
        />
      )
    },
    {
      key: 'name',
      header: 'Имя',
      width: 200,
      dataIndex: 'name',
      sortable: true,
      renderer: (val) => (
        <span style={{ cursor: 'pointer' }} title={String(val)}>{String(val)}</span>
      )
    },
    {
      key: 'host',
      header: 'Хост',
      flex: 1,
      dataIndex: 'host',
      sortable: true
    },
    {
      key: 'port',
      header: 'Порт',
      width: 80,
      dataIndex: 'port',
      align: 'right'
    },
    {
      key: 'protocol',
      header: 'Протокол',
      width: 100,
      dataIndex: 'protocol'
    },
    {
      key: 'objectsCount',
      header: 'Объектов',
      width: 80,
      dataIndex: 'objectsCount',
      align: 'right'
    }
  ], []);

  // Дополнительные кнопки для ретранслятора
  const customButtons = (
    <>
      <button 
        className="x-btn"
        onClick={() => console.log('Start retranslator', selected)}
        disabled={!selected}
        title="Запустить"
      >
        <img src="/images/ico16_okcrc.png" alt="" />
      </button>
      <button 
        className="x-btn"
        onClick={() => console.log('Stop retranslator', selected)}
        disabled={!selected}
        title="Остановить"
      >
        <img src="/images/ico16_cancel.png" alt="" />
      </button>
      <button 
        className="x-btn"
        onClick={() => {
          const rec = mockRetranslators.find(r => r._id === selected);
          if (rec) openModal('retranslatorConfig', rec);
        }}
        disabled={!selected}
        title="Настройки"
      >
        <img src="/images/ico16_options.png" alt="" />
      </button>
    </>
  );

  return (
    <GridPanel
      data={filteredRetranslators}
      columns={columns}
      getRowKey={(rec) => rec._id}
      selectedKeys={selected ? [selected] : []}
      onSelectionChange={(keys) => setSelected(keys[0] || null)}
      onRowDoubleClick={(record, column) => {
        if (column?.key === 'name' || column?.key === 'rownum') {
          openModal('retranslatorForm', record);
        }
      }}
      toolbar={
        <GridToolbar
          onAdd={() => openModal('retranslatorForm', null)}
          onDelete={() => console.log('Delete retranslator')}
          onRefresh={() => console.log('Refresh retranslators')}
          deleteDisabled={!selected}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          customButtons={customButtons}
        />
      }
      summary={
        <span><b>Всего позиций: {filteredRetranslators.length}</b></span>
      }
    />
  );
}
