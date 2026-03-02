> Тег: `АКТУАЛЬНО` | Обновлён: `2026-03-02` | Версия: `1.0`

# 📖 Изучение Web Billing

> Руководство по Web Billing — React SPA для управления биллингом.

---

## 1. Назначение

**Web Billing** — административная панель биллинга (PostMVP):
- Управление аккаунтами, тарифами, подписками
- Управление оборудованием и типами оборудования
- Субдилеры и партнёры
- Роли и пользователи биллинга
- Корзина (удалённые объекты)
- Журнал событий

**Порт:** 3002 (Vite dev server). **Статус:** ЧЕРНОВИК / PostMVP

---

## 2. Архитектура

```
src/
├── App.tsx              — главный layout (BillingApp)
├── main.tsx             — entry point
├── api/
│   ├── client.ts        — HTTP клиент (fetch wrapper)
│   ├── endpoints.ts     — API URL endpoints
│   ├── mock.ts          — Mock данные для разработки
│   └── types.ts         — API response типы
├── store/billingStore.ts — Zustand store
├── types/index.ts       — TypeScript типы
└── components/
    ├── BillingApp.tsx         — Главный layout с sidebar navigation
    ├── AccountsPanel.tsx      — Управление аккаунтами
    ├── AccountForm.tsx        — Форма создания/редактирования аккаунта
    ├── TariffsPanel.tsx       — Управление тарифами
    ├── EquipmentPanel.tsx     — Оборудование (трекеры, SIM-карты)
    ├── EquipmentTypesPanel.tsx — Типы оборудования
    ├── ObjectsPanel.tsx       — Объекты (ТС)
    ├── GroupsPanel.tsx        — Группы объектов
    ├── SubdealersPanel.tsx    — Партнёры/субдилеры
    ├── UsersPanel.tsx         — Пользователи биллинга
    ├── RolesPanel.tsx         — Роли и права
    ├── RetranslatorsPanel.tsx — Ретрансляторы
    ├── EventsPanel.tsx        — Журнал событий
    ├── RecycleBinPanel.tsx    — Корзина (удалённые)
    ├── SupportPanel.tsx       — Поддержка
    ├── GridPanel.tsx          — Универсальная таблица (TanStack Table)
    ├── GridToolbar.tsx        — Toolbar для таблиц
    └── PlaceholderPanel.tsx   — Заглушка для нереализованных панелей
```

---

## 3. Технологии

| Библиотека | Назначение |
|-----------|-----------|
| React 19 | UI framework |
| TypeScript 5.9 | Типизация |
| Vite 7 | Сборка |
| TanStack Table 8 | Таблицы (сортировка, пагинация, фильтрация) |
| Zustand 5 | State management |
| date-fns 4 | Форматирование дат |
| Lucide | Иконки |

---

## 4. Таблицы (TanStack Table)

Основной паттерн — GridPanel как универсальная таблица:
```typescript
<GridPanel
  columns={columns}
  data={accounts}
  onRowClick={handleSelect}
  toolbar={<GridToolbar onSearch={...} onFilters={...} />}
  pagination={{ pageSize: 50 }}
/>
```

---

## 5. Как запустить

```bash
cd services/web-billing
npm install
npm run dev   # → http://localhost:3002
```

---

## 6. Интеграция с backend

Планируется отдельный billing-service (Scala), который пока не реализован. Web Billing работает на mock данных.

Аналог в legacy Stels: billing module на Axon CQRS (Accounts, Equipment, Tariffs, Dealers, Finance).

---

*Версия: 1.0 | Обновлён: 2 марта 2026*
