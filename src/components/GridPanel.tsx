/**
 * =====================================================
 * GridPanel — базовая таблица (React-аналог Ext.grid.Panel)
 * =====================================================
 *
 * Legacy аналог: WRGrid = Ext.grid.Panel (custom subclass)
 * Используется во ВСЕХ вкладках billing admin.
 *
 * Column<T> — аналог Ext.grid.column.Column:
 *   dataIndex — поле из объекта (record[dataIndex])
 *   renderer  — функция кастомного рендера ячейки
 *   sortable  — можно ли сортировать по клику на заголовок
 *   flex/width — размеры колонки
 *
 * Props:
 *   data            — массив записей (Account[], BillingObject[], ...)
 *   columns         — конфигурация колонок
 *   selectedKeys    — выделенные строки (аналог Ext.selection.Model)
 *   toolbar         — тулбар над таблицей (GridToolbar)
 *
 * CSS: index.css — .ext-grid-*, .x-grid-row-selected и т.д.
 */
import { useState, useMemo, type ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  width?: number | string;
  flex?: number;
  dataIndex?: keyof T;
  sortable?: boolean;
  hidden?: boolean;
  align?: 'left' | 'center' | 'right';
  renderer?: (value: unknown, record: T, index: number) => ReactNode;
}

interface GridPanelProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowKey: (record: T) => string;
  getRowClass?: (record: T) => string;
  selectedKeys?: string[];
  onRowClick?: (record: T, column?: Column<T>) => void;
  onRowDoubleClick?: (record: T, column: Column<T>) => void;
  onSelectionChange?: (keys: string[]) => void;
  multiSelect?: boolean;
  toolbar?: ReactNode;
  summary?: ReactNode;
  loading?: boolean;
}

export function GridPanel<T>({
  data,
  columns,
  getRowKey,
  getRowClass,
  selectedKeys = [],
  onRowClick,
  onRowDoubleClick,
  onSelectionChange,
  multiSelect = false,
  toolbar,
  summary,
  loading
}: GridPanelProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Фильтруем скрытые колонки
  const visibleColumns = useMemo(() => 
    columns.filter(col => !col.hidden), 
    [columns]
  );

  // Сортировка
  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    const column = columns.find(c => c.key === sortColumn);
    if (!column || !column.dataIndex) return data;

    return [...data].sort((a, b) => {
      const aVal = a[column.dataIndex as keyof T];
      const bVal = b[column.dataIndex as keyof T];
      
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, columns, sortColumn, sortDirection]);

  // Обработчик сортировки
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;
    if (sortColumn === column.key) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column.key);
      setSortDirection('asc');
    }
  };

  // Обработчик клика по строке
  const handleRowClick = (record: T, column: Column<T>, e: React.MouseEvent) => {
    const key = getRowKey(record);
    
    if (multiSelect && e.ctrlKey) {
      const newKeys = selectedKeys.includes(key)
        ? selectedKeys.filter(k => k !== key)
        : [...selectedKeys, key];
      onSelectionChange?.(newKeys);
    } else {
      onSelectionChange?.([key]);
    }
    
    onRowClick?.(record, column);
  };

  // Вычисляем ширину колонок
  const getColumnStyle = (col: Column<T>) => {
    if (col.width) {
      return { width: typeof col.width === 'number' ? `${col.width}px` : col.width };
    }
    if (col.flex) {
      return { flex: col.flex };
    }
    return {};
  };

  return (
    <div className="grid-panel">
      {/* Toolbar */}
      {toolbar}

      {/* Summary */}
      {summary && <div className="grid-summary">{summary}</div>}

      {/* Header */}
      <div className="grid-header">
        {visibleColumns.map(col => (
          <div
            key={col.key}
            className={`grid-header-cell ${col.sortable ? 'sortable' : ''}`}
            style={{ ...getColumnStyle(col), textAlign: col.align || 'left' }}
            onClick={() => handleSort(col)}
          >
            {col.header}
            {sortColumn === col.key && (
              <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
            )}
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="grid-body">
        {loading ? (
          <div style={{ padding: 20, textAlign: 'center' }}>Загрузка...</div>
        ) : sortedData.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#888' }}>
            Нет данных
          </div>
        ) : (
          sortedData.map((record, rowIndex) => {
            const key = getRowKey(record);
            const rowClass = getRowClass ? getRowClass(record) : '';
            const isSelected = selectedKeys.includes(key);

            return (
              <div
                key={key}
                className={`grid-row ${rowClass} ${isSelected ? 'selected' : ''}`}
                onDoubleClick={() => onRowDoubleClick?.(record, visibleColumns[0])}
              >
                {visibleColumns.map(col => {
                  const value = col.dataIndex ? record[col.dataIndex] : null;
                  const content = col.renderer 
                    ? col.renderer(value, record, rowIndex)
                    : String(value ?? '');

                  return (
                    <div
                      key={col.key}
                      className="grid-cell"
                      style={{ ...getColumnStyle(col), textAlign: col.align || 'left' }}
                      onClick={(e) => handleRowClick(record, col, e)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onRowDoubleClick?.(record, col);
                      }}
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
