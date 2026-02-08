/**
 * AccountForm — модальное окно редактирования учётной записи
 *
 * Legacy: AccountForm.js (Ext.window.Window + Ext.form.Panel)
 * API: accountData.loadData(id) + accountData.updateData(data)
 *
 * Поля: имя, комментарий, тариф, способ оплаты,
 * лимит дней, лимит валюты, % аб.платы.
 * Открывается через: useBillingStore().openModal('accountForm', account)
 */
import { useState } from 'react';
import { useBillingStore } from '../store/billingStore';
import { mockTariffs, mockBalanceHistory } from '../api/mock';
import type { Account } from '../types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface AccountFormProps {
  account: Account | null;
  onClose: () => void;
  onSave: (data: Partial<Account>) => void;
}

// Секция accordion
interface AccordionSectionProps {
  title: string;
  icon?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function AccordionSection({ title, icon, defaultOpen = false, children }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="accordion-section">
      <div 
        className="accordion-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <span style={{ fontSize: 10 }}>▼</span> : <span style={{ fontSize: 10 }}>▶</span>}
        {icon && <img src={icon} alt="" style={{ width: 16, height: 16, marginLeft: 4 }} />}
        <span>{title}</span>
      </div>
      {isOpen && (
        <div className="accordion-content">
          {children}
        </div>
      )}
    </div>
  );
}

// Модальное окно истории баланса
interface BalanceHistoryModalProps {
  accountId: string;
  onClose: () => void;
}

function BalanceHistoryModal({ accountId, onClose }: BalanceHistoryModalProps) {
  // Фильтруем историю по аккаунту (в реальном случае - API запрос)
  const history = mockBalanceHistory.filter(h => h.accountId === accountId);
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" style={{ width: 600 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span>История баланса</span>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body" style={{ maxHeight: 400, overflow: 'auto' }}>
          <table className="simple-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Тип</th>
                <th>Сумма</th>
                <th>Новый баланс</th>
                <th>Комментарий</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#999' }}>
                    История пуста
                  </td>
                </tr>
              ) : (
                history.map(item => (
                  <tr key={item._id}>
                    <td>{format(new Date(item.timestamp), 'dd.MM.yyyy HH:mm', { locale: ru })}</td>
                    <td>{item.type === 'credit' ? 'Пополнение' : 'Списание'}</td>
                    <td style={{ 
                      color: item.type === 'credit' ? '#4caf50' : '#f44336',
                      fontWeight: 500
                    }}>
                      {item.type === 'credit' ? '+' : '-'}{Math.abs(item.amount).toFixed(2)} р.
                    </td>
                    <td>{item.newBalance.toFixed(2)} р.</td>
                    <td>{item.comment}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="modal-footer">
          <button className="x-btn" onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
}

export function AccountForm({ account, onClose, onSave }: AccountFormProps) {
  const { isAdmin } = useBillingStore();
  const isNew = !account;
  
  // Состояние формы
  const [formData, setFormData] = useState({
    name: account?.name || '',
    fullClientName: account?.fullClientName || '',
    comment: account?.comment || '',
    tariffId: account?.tariffId || '',
    paymentWay: account?.paymentWay || 'prepay',
    daysLimit: account?.daysLimit || 0,
    currencyLimit: account?.currencyLimit || 0,
    percentMonthlyFeeLimit: account?.percentMonthlyFeeLimit || 0,
    blocked: account?.blocked || false,
    blockedReason: account?.blockedReason || ''
  });
  
  const [showBalanceHistory, setShowBalanceHistory] = useState(false);
  
  // Обработчик изменения поля
  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Обработчик сохранения
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-window" style={{ width: 500 }} onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <span>{isNew ? 'Новая учетная запись' : `Редактирование: ${account?.name}`}</span>
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={{ maxHeight: '70vh', overflow: 'auto' }}>
              {/* Основная информация */}
              <AccordionSection title="Основное" icon="/images/account-icon16.png" defaultOpen={true}>
                <div className="form-row">
                  <label>Имя *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-row">
                  <label>Полное название клиента</label>
                  <input
                    type="text"
                    value={formData.fullClientName}
                    onChange={e => handleChange('fullClientName', e.target.value)}
                  />
                </div>
                
                <div className="form-row">
                  <label>Комментарий</label>
                  <textarea
                    value={formData.comment}
                    onChange={e => handleChange('comment', e.target.value)}
                    rows={3}
                  />
                </div>
              </AccordionSection>
              
              {/* Биллинг */}
              <AccordionSection title="Биллинг" icon="/images/coin.gif" defaultOpen={true}>
                <div className="form-row">
                  <label>Тариф</label>
                  <select
                    value={formData.tariffId}
                    onChange={e => handleChange('tariffId', e.target.value)}
                  >
                    <option value="">-- Выберите тариф --</option>
                    {mockTariffs.map(t => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-row">
                  <label>Способ оплаты</label>
                  <select
                    value={formData.paymentWay}
                    onChange={e => handleChange('paymentWay', e.target.value)}
                  >
                    <option value="prepay">Предоплата</option>
                    <option value="postpay">Постоплата</option>
                  </select>
                </div>
                
                {!isNew && account && (
                  <div className="form-row balance-row">
                    <label>Баланс</label>
                    <div className="balance-display">
                      <span style={{ 
                        fontSize: 18, 
                        fontWeight: 600,
                        color: account.balance >= 0 ? '#4caf50' : '#f44336'
                      }}>
                        {account.balance.toFixed(2)} р.
                      </span>
                      <button 
                        type="button"
                        className="x-btn"
                        onClick={() => setShowBalanceHistory(true)}
                        title="История баланса"
                      >
                        <img src="/images/ico16_msghist.png" alt="" />
                      </button>
                      {isAdmin && (
                        <button 
                          type="button"
                          className="x-btn"
                          onClick={() => console.log('Add balance')}
                          title="Пополнить баланс"
                        >
                          <img src="/images/ico16_plus_def.png" alt="" />
                          Пополнить
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </AccordionSection>
              
              {/* Лимиты */}
              <AccordionSection title="Лимиты" icon="/images/ico16_report.png">
                <div className="form-row">
                  <label>Лимит дней</label>
                  <input
                    type="number"
                    value={formData.daysLimit}
                    onChange={e => handleChange('daysLimit', parseInt(e.target.value) || 0)}
                    min={0}
                  />
                  <small>Количество дней отсрочки при отрицательном балансе</small>
                </div>
                
                <div className="form-row">
                  <label>Лимит суммы</label>
                  <input
                    type="number"
                    value={formData.currencyLimit}
                    onChange={e => handleChange('currencyLimit', parseFloat(e.target.value) || 0)}
                    min={0}
                    step={0.01}
                  />
                  <small>Максимальная сумма задолженности (р.)</small>
                </div>
                
                <div className="form-row">
                  <label>Лимит % от абон. платы</label>
                  <input
                    type="number"
                    value={formData.percentMonthlyFeeLimit}
                    onChange={e => handleChange('percentMonthlyFeeLimit', parseInt(e.target.value) || 0)}
                    min={0}
                    max={100}
                  />
                  <small>Процент от абонентской платы</small>
                </div>
              </AccordionSection>
              
              {/* Блокировка (только для админа) */}
              {isAdmin && (
                <AccordionSection title="Блокировка" icon="/images/ico16_cancel.png">
                  <div className="form-row checkbox-row">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.blocked}
                        onChange={e => handleChange('blocked', e.target.checked)}
                      />
                      Заблокировать учетную запись
                    </label>
                  </div>
                  
                  {formData.blocked && (
                    <div className="form-row">
                      <label>Причина блокировки</label>
                      <textarea
                        value={formData.blockedReason}
                        onChange={e => handleChange('blockedReason', e.target.value)}
                        rows={2}
                      />
                    </div>
                  )}
                </AccordionSection>
              )}
            </div>
            
            <div className="modal-footer">
              <button type="submit" className="x-btn primary">
                {isNew ? 'Создать' : 'Сохранить'}
              </button>
              <button type="button" className="x-btn" onClick={onClose}>
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Модальное окно истории баланса */}
      {showBalanceHistory && account && (
        <BalanceHistoryModal 
          accountId={account._id} 
          onClose={() => setShowBalanceHistory(false)}
        />
      )}
    </>
  );
}
