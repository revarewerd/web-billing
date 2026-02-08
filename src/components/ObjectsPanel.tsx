/**
 * ObjectsPanel — вкладка "Объекты" (GPS-трекеры/транспорт)
 *
 * Legacy: AllObjectsPanel.js → EDS.store.AllObjectsService
 * MongoDB: коллекция `objects`
 *
 * Объект = транспортное средство с GPS-трекером. К нему привязаны:
 * оборудование (Equipment), SIM-карта, GPS-данные, датчики.
 * Каждый объект принадлежит учётной записи (Account).
 *
 * Колонки: №, Иконка, Имя, Учётная запись, Трекер, IMEI, SIM,
 * Последнее сообщение, Протокол, Спутники, Скорость, Статус
 */
import { useMemo, useState } from 'react';
import { GridPanel, type Column } from './GridPanel';
import { GridToolbar } from './GridToolbar';
import { useBillingStore } from '../store/billingStore';
import { formatMoney } from '../api/mock';
import type { BillingObject } from '../types';

// Форматирование даты
function formatDate(timestamp: number | null): string {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Определение цвета по времени последнего сообщения
function getLatestMsgColor(timestamp: number | null): string {
  if (!timestamp) return 'inherit';
  
  const now = Date.now();
  const diff = now - timestamp;
  
  const min20 = 20 * 60 * 1000;
  const hour3 = 3 * 60 * 60 * 1000;
  const month1 = 30 * 24 * 60 * 60 * 1000;
  
  if (diff < min20) return 'green';
  if (diff < hour3) return 'gold';
  if (diff < month1) return 'red';
  return 'brown';
}

export function ObjectsPanel() {
  const { 
    objects, 
    selectedObjectIds, 
    setSelectedObjectIds,
    searchQuery,
    setSearchQuery,
    openModal,
    refreshData,
    isAdmin
  } = useBillingStore();
  
  const [autoRefreshGPS, setAutoRefreshGPS] = useState(false);

  // Фильтрация по поиску
  const filteredObjects = useMemo(() => {
    if (!searchQuery) return objects;
    const q = searchQuery.toLowerCase();
    return objects.filter(obj => 
      obj.name.toLowerCase().includes(q) ||
      obj.customName.toLowerCase().includes(q) ||
      obj.accountName.toLowerCase().includes(q) ||
      obj.eqIMEI.includes(q) ||
      obj.trackerModel.toLowerCase().includes(q) ||
      obj.uid?.includes(q)
    );
  }, [objects, searchQuery]);

  // Колонки таблицы (1:1 как в legacy AllObjectsPanel.js)
  const columns: Column<BillingObject>[] = useMemo(() => [
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
        <img src="/images/cars/car_002_blu_24.png" alt="" style={{ width: 16, height: 16, cursor: 'pointer' }} />
      )
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
      key: 'customName',
      header: 'Пользовательское имя',
      width: 170,
      dataIndex: 'customName',
      sortable: true
    },
    {
      key: 'comment',
      header: 'Комментарий',
      width: 170,
      dataIndex: 'comment',
      sortable: true,
      hidden: !isAdmin,
      renderer: (val) => (
        <span title={String(val || '')}>{String(val || '')}</span>
      )
    },
    {
      key: 'accountName',
      header: 'Учетная запись',
      width: 170,
      dataIndex: 'accountName',
      sortable: true,
      renderer: (val) => (
        <span title={String(val || '')}>{String(val || '')}</span>
      )
    },
    {
      key: 'uid',
      header: 'УИД',
      width: 170,
      dataIndex: 'uid',
      sortable: true,
      hidden: true,
      align: 'right'
    },
    {
      key: 'trackerModel',
      header: 'Трекер',
      width: 150,
      dataIndex: 'trackerModel',
      sortable: true
    },
    {
      key: 'eqIMEI',
      header: 'IMEI',
      width: 110,
      dataIndex: 'eqIMEI',
      sortable: true,
      align: 'right'
    },
    {
      key: 'simNumber',
      header: 'Телефон',
      width: 110,
      dataIndex: 'simNumber',
      sortable: true,
      align: 'right',
      hidden: !isAdmin
    },
    {
      key: 'cost',
      header: 'Абонентская плата',
      width: 110,
      dataIndex: 'cost',
      sortable: true,
      align: 'right',
      renderer: (val) => formatMoney(val as number)
    },
    {
      key: 'blocked',
      header: '',
      width: 32,
      dataIndex: 'blocked',
      sortable: true,
      renderer: (val) => val ? (
        <img src="/images/ico16_lock.png" alt="" title="Автомобиль заблокирован" />
      ) : null
    },
    {
      key: 'ignition',
      header: '',
      width: 32,
      dataIndex: 'ignition',
      sortable: true,
      renderer: (val) => (val !== 'unknown' && (val as number) > 0) ? (
        <img src="/images/ignition_key16.png" alt="" title="Зажигание включено" />
      ) : null
    },
    {
      key: 'speed',
      header: '',
      width: 32,
      dataIndex: 'speed',
      sortable: true,
      renderer: (val) => {
        const speed = val as number;
        const title = speed > 0 
          ? `Последнее состояние: автомобиль едет (скорость ${speed} км/ч)`
          : 'Последнее состояние: автомобиль стоит';
        const icon = speed > 0 ? '/images/ico16_car_move.png' : '/images/ico16_car_stop.png';
        return (
          <img src={icon} alt="" title={title} />
        );
      }
    },
    {
      key: 'radioUnit',
      header: '',
      width: 32,
      dataIndex: 'radioUnit',
      sortable: true,
      renderer: (val) => {
        const radio = val as BillingObject['radioUnit'];
        if (!radio?.installed) return null;
        
        const workDate = radio.workDate ? new Date(radio.workDate) : null;
        const isValid = workDate && (Date.now() - workDate.getTime()) < 365 * 24 * 60 * 60 * 1000;
        const icon = isValid ? '/images/ico16_radio_ok.png' : '/images/ico16_radio_err.png';
        const title = `${radio.type} ${radio.model}\nДата последнего проведения работ: ${workDate ? formatDate(workDate.getTime()) : 'н/д'}`;
        
        return <img src={icon} alt="" title={title} />;
      }
    },
    {
      key: 'sms',
      header: 'SMS',
      width: 32,
      dataIndex: 'sms',
      sortable: true,
      renderer: (val, rec) => {
        if (!rec.simNumber) return null;
        const icon = val ? '/images/ico16_msghist_yel.png' : '/images/ico16_msghist.png';
        return (
          <img 
            src={icon} 
            alt="" 
            title="Показать сообщения" 
            style={{ cursor: 'pointer' }}
          />
        );
      }
    },
    {
      key: 'latestmsg',
      header: 'Последнее сообщение',
      width: 170,
      dataIndex: 'latestmsg',
      sortable: true,
      renderer: (val, rec) => {
        const timestamp = val as number | null;
        if (!timestamp) return 'Сообщений не поступало';
        
        const color = getLatestMsgColor(timestamp);
        const protocol = rec.latestmsgprotocol || '';
        const text = `${formatDate(timestamp)} (${protocol})`;
        const title = rec.placeName 
          ? `Последнее положение: ${rec.placeName}\nКол-во спутников: ${rec.satelliteNum || 0}`
          : `Кол-во спутников: ${rec.satelliteNum || 0}`;
        
        return (
          <span style={{ color, cursor: 'pointer' }} title={title}>
            {text}
          </span>
        );
      }
    },
    {
      key: 'sleepertime',
      header: 'Сообщения от спящего блока',
      width: 250,
      dataIndex: 'sleeper',
      sortable: true,
      renderer: (val) => {
        const sleeper = val as BillingObject['sleeper'];
        if (!sleeper) return null;
        
        const time = sleeper.time ? formatDate(sleeper.time) : 'сообщений не поступало';
        return (
          <span title={sleeper.info} style={{ cursor: 'pointer' }}>
            {sleeper.alert} : {time} : {sleeper.battery}
          </span>
        );
      }
    },
    {
      key: 'placeName',
      header: 'Положение',
      width: 250,
      dataIndex: 'placeName',
      sortable: true,
      hidden: true,
      renderer: (val) => (
        <span title={String(val || '')}>{String(val || '')}</span>
      )
    }
  ], [isAdmin]);

  // Суммарные значения
  const totalCost = filteredObjects.reduce((sum, obj) => sum + obj.cost, 0);

  // Кастомные кнопки для toolbar
  const customToolbarButtons = (
    <label style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 16, fontSize: 11 }}>
      <input 
        type="checkbox" 
        checked={autoRefreshGPS}
        onChange={(e) => setAutoRefreshGPS(e.target.checked)}
      />
      Автообновление GPS-данных
    </label>
  );

  return (
    <GridPanel
      data={filteredObjects}
      columns={columns}
      getRowKey={(rec) => rec._id}
      getRowClass={(rec) => rec.blocked ? 'blocked' : ''}
      selectedKeys={selectedObjectIds}
      onSelectionChange={setSelectedObjectIds}
      multiSelect={true}
      onRowDoubleClick={(record, column) => {
        if (column.key === 'name' || column.key === 'icon') {
          openModal('objectForm', record);
        } else if (column.key === 'latestmsg') {
          openModal('terminalMessages', record);
        } else if (column?.key === 'sleepertime') {
          openModal('sleeperMessages', record);
        } else if (column?.key === 'sms' && record.simNumber) {
          openModal('trackerSMS', record);
        }
      }}
      onRowClick={(record, column) => {
        if (column?.key === 'icon') {
          openModal('objectForm', record);
        } else if (column?.key === 'sms' && record.simNumber) {
          openModal('trackerSMS', record);
        }
      }}
      toolbar={
        <GridToolbar
          onAdd={() => openModal('objectForm', null)}
          onDelete={() => {
            if (selectedObjectIds.length > 0) {
              console.log('Delete objects:', selectedObjectIds);
            }
          }}
          onRefresh={refreshData}
          onExport={() => console.log('Export objects')}
          deleteDisabled={selectedObjectIds.length === 0 || !isAdmin}
          addDisabled={!isAdmin}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          customButtons={customToolbarButtons}
        />
      }
      summary={
        <>
          <span><b>Всего позиций: {filteredObjects.length}</b></span>
          <span>Аб. плата: <b>{formatMoney(totalCost)}</b></span>
        </>
      }
    />
  );
}
