/**
 * EquipmentPanel — вкладка "Оборудование"
 *
 * Legacy: EquipmentStorePanel.js → EDS.store.EquipmentStore
 * MongoDB: коллекция `equipments`
 *
 * Оборудование = физическое устройство (GPS-трекер, радиозакладка,
 * спящий блок). Имеет IMEI, серийный номер, SIM-карту.
 * Статус: free (на складе), installed (установлен), broken (неисправен).
 */
import { useMemo } from 'react';
import { GridPanel, type Column } from './GridPanel';
import { GridToolbar } from './GridToolbar';
import { useBillingStore } from '../store/billingStore';
import type { Equipment } from '../types';

export function EquipmentPanel() {
  const { 
    equipment, 
    selectedEquipmentId, 
    setSelectedEquipmentId,
    searchQuery,
    setSearchQuery,
    openModal,
    refreshData,
    isAdmin
  } = useBillingStore();

  // Фильтрация по поиску
  const filteredEquipment = useMemo(() => {
    if (!searchQuery) return equipment;
    const q = searchQuery.toLowerCase();
    return equipment.filter(eq => 
      eq.eqtype.toLowerCase().includes(q) ||
      eq.accountName.toLowerCase().includes(q) ||
      eq.objectName.toLowerCase().includes(q) ||
      eq.eqIMEI.includes(q) ||
      eq.eqSerNum.toLowerCase().includes(q) ||
      eq.eqModel.toLowerCase().includes(q)
    );
  }, [equipment, searchQuery]);

  // Колонки таблицы (как в legacy EquipmentStorePanel.js)
  const columns: Column<Equipment>[] = useMemo(() => [
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
      renderer: (_val, rec) => {
        let icon = '/images/ico16_device_def.png';
        if (rec.status === 'broken') icon = '/images/ico16_device_err.png';
        else if (rec.status === 'installed') icon = '/images/ico16_device_ok.png';
        return <img src={icon} alt="" style={{ cursor: 'pointer' }} />;
      }
    },
    {
      key: 'eqtype',
      header: 'Тип устройства',
      width: 220,
      dataIndex: 'eqtype',
      sortable: true,
      renderer: (val) => (
        <span style={{ cursor: 'pointer' }}>{String(val)}</span>
      )
    },
    {
      key: 'accountName',
      header: 'Учетная запись',
      width: 170,
      dataIndex: 'accountName',
      sortable: true
    },
    {
      key: 'objectName',
      header: 'Объект',
      width: 170,
      dataIndex: 'objectName',
      sortable: true
    },
    {
      key: 'eqMark',
      header: 'Марка',
      width: 110,
      dataIndex: 'eqMark',
      sortable: true
    },
    {
      key: 'eqModel',
      header: 'Модель',
      width: 110,
      dataIndex: 'eqModel',
      sortable: true
    },
    {
      key: 'eqSerNum',
      header: 'Серийный номер',
      width: 110,
      dataIndex: 'eqSerNum',
      sortable: true
    },
    {
      key: 'eqIMEI',
      header: 'IMEI',
      width: 130,
      dataIndex: 'eqIMEI',
      sortable: true
    },
    {
      key: 'simNumber',
      header: 'Абонентский номер',
      width: 110,
      dataIndex: 'simNumber',
      sortable: true,
      hidden: !isAdmin
    },
    {
      key: 'eqFirmware',
      header: 'Прошивка',
      width: 170,
      dataIndex: 'eqFirmware',
      sortable: true
    },
    {
      key: 'history',
      header: 'История',
      width: 60,
      align: 'center',
      hidden: !isAdmin,
      renderer: () => (
        <img 
          src="/images/ico16_eventsmsgs.png" 
          alt="История" 
          title="Посмотреть историю оборудования"
          style={{ cursor: 'pointer' }} 
        />
      )
    },
    {
      key: 'simICC',
      header: 'ICC',
      width: 150,
      dataIndex: 'simICC',
      sortable: true
    },
    {
      key: 'status',
      header: 'Статус',
      width: 100,
      dataIndex: 'status',
      renderer: (val) => {
        switch (val) {
          case 'free': return 'Свободно';
          case 'installed': return 'Установлено';
          case 'broken': return 'Неисправно';
          default: return String(val);
        }
      }
    }
  ], []);

  // Получить класс строки
  const getRowClass = (record: Equipment) => {
    if (record.status === 'broken') return 'blocked';
    return '';
  };

  return (
    <GridPanel
      data={filteredEquipment}
      columns={columns}
      getRowKey={(rec) => rec._id}
      getRowClass={getRowClass}
      selectedKeys={selectedEquipmentId ? [selectedEquipmentId] : []}
      onSelectionChange={(keys) => setSelectedEquipmentId(keys[0] || null)}
      onRowDoubleClick={(record, column) => {
        if (column?.key === 'eqtype' || column?.key === 'icon') {
          openModal('equipmentForm', record);
        }
      }}
      onRowClick={(record, column) => {
        if (column?.key === 'icon') {
          openModal('equipmentForm', record);
        } else if (column?.key === 'history') {
          openModal('equipmentHistory', record);
        }
      }}
      toolbar={
        <GridToolbar
          onAdd={() => openModal('equipmentForm', null)}
          onDelete={() => {
            if (selectedEquipmentId) {
              console.log('Delete equipment:', selectedEquipmentId);
            }
          }}
          onRefresh={refreshData}
          onExport={() => console.log('Export equipment')}
          deleteDisabled={!selectedEquipmentId || !isAdmin}
          addDisabled={!isAdmin}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
        />
      }
      summary={
        <span><b>Всего позиций: {filteredEquipment.length}</b></span>
      }
    />
  );
}
