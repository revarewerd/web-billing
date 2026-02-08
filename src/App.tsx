/**
 * =====================================================
 * BILLING ADMIN — Административная панель биллинга
 * =====================================================
 *
 * Это АДМИНКА — для управления учётными записями, объектами, тарифами,
 * оборудованием, пользователями и т.д. Доступна только администраторам/дилерам.
 *
 * Legacy аналог: /billing/index.html (ExtJS 4.2.1 Gray Theme)
 * Legacy Java:   ru.sosgps.wayrecall.billing.* (Ext.Direct RPC)
 * API контракт:  docs/BILLING_API_CONTRACT.md
 *
 * ❗ Вторая вебка проекта — web-frontend (services/web-frontend/) — это
 * пользовательский мониторинг с картой, треками, уведомлениями.
 * API контракт мониторинга: docs/MONITORING_API_CONTRACT.md
 *
 * Стек: React 19 + TypeScript + Vite + Zustand (state) + vanilla CSS
 * (без TailwindCSS — CSS написан вручную под ExtJS Gray Theme)
 */
import { BillingApp } from './components/BillingApp';

function App() {
  return <BillingApp />;
}

export default App
