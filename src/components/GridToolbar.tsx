/**
 * =====================================================
 * GridToolbar — тулбар над таблицей
 * =====================================================
 *
 * Legacy аналог: docked toolbar в Ext.grid.Panel
 *   dockedItems: [{xtype: 'toolbar', dock: 'top', items: [...]}]
 *
 * Стандартные кнопки:
 *   [Добавить] [Удалить] [Обновить] [Экспорт] | [Поиск...]
 *
 * Кнопки можно скрывать (hideAdd/hideDelete) и
 * добавлять кастомные (customButtons/children).
 */
import type { ReactNode } from 'react';

interface GridToolbarProps {
  onAdd?: () => void;
  onDelete?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  deleteDisabled?: boolean;
  addDisabled?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  children?: ReactNode;
  // Новые свойства для скрытия кнопок
  hideAdd?: boolean;
  hideDelete?: boolean;
  customButtons?: ReactNode;
}

export function GridToolbar({
  onAdd,
  onDelete,
  onRefresh,
  onExport,
  deleteDisabled = true,
  addDisabled = false,
  searchValue = '',
  onSearchChange,
  children,
  hideAdd = false,
  hideDelete = false,
  customButtons
}: GridToolbarProps) {
  const showAdd = onAdd && !hideAdd;
  const showDelete = onDelete && !hideDelete;
  
  return (
    <div className="grid-toolbar">
      {/* Добавить */}
      {showAdd && (
        <button 
          className="grid-btn" 
          onClick={onAdd}
          disabled={addDisabled}
          title="Добавить"
        >
          <img src="/images/ico16_plus_def.png" alt="" />
          Добавить
        </button>
      )}

      {/* Удалить */}
      {showDelete && (
        <button 
          className="grid-btn" 
          onClick={onDelete}
          disabled={deleteDisabled}
          title="Удалить"
        >
          <img src="/images/ico16_cancel.png" alt="" />
          Удалить
        </button>
      )}

      {/* Разделитель */}
      {(showAdd || showDelete) && <div className="grid-toolbar-separator" />}

      {/* Обновить */}
      {onRefresh && (
        <button 
          className="grid-btn" 
          onClick={onRefresh}
          title="Обновить"
        >
          <img src="/images/ico16_loading.png" alt="" />
          Обновить
        </button>
      )}

      {/* Выгрузить — как в legacy WRGrid: gridDataExport */}
      {onExport && (
        <button 
          className="grid-btn" 
          onClick={onExport}
          title="Выгрузить"
        >
          <img src="/images/ico16_download.png" alt="" />
          Выгрузить
        </button>
      )}

      {/* Дополнительные кастомные кнопки */}
      {customButtons && (
        <>
          <div className="grid-toolbar-separator" />
          {customButtons}
        </>
      )}

      {/* Дополнительные кнопки (children) */}
      {children}

      {/* Поиск (справа) — как в legacy WRGrid: лейбл "Искать:" + поле ввода */}
      {onSearchChange && (
        <div className="grid-search">
          <span className="grid-search-label">Искать:</span>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
