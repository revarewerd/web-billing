# 💳 Web Billing — Панель управления биллингом

> Тег: `ЧЕРНОВИК` | Обновлён: `2026-06-02` | Версия: `0.1`
> **Статус:** PostMVP — не реализовано, только шаблон проекта

## Обзор

**Web Billing** — веб-приложение для управления биллингом и подписками клиентов.
Управление тарифами, просмотр баланса, история платежей, выставление счетов.

| Параметр | Значение |
|----------|----------|
| **Блок** | PostMVP |
| **Порт** | 3002 (dev) |
| **Framework** | React + TypeScript + Vite |
| **Статус** | Пустой шаблон, функциональность не реализована |

## Планируемая функциональность

| Функция | Описание | Приоритет |
|---------|----------|-----------|
| Тарифы | CRUD тарифных планов (per device/month, per GPS point, flat) | P1 |
| Подписки | Управление подписками организаций | P1 |
| Баланс | Просмотр текущего баланса, история операций | P1 |
| Счета | Автоматическое формирование счетов, PDF экспорт | P2 |
| Платежи | Интеграция с платёжными системами (ЮKassa и др.) | P2 |
| Тарификация | Расчёт стоимости по пробегу / кол-ву устройств / GPS точек | P2 |
| Отчёты | Финансовая отчётность для администратора | P3 |
| Уведомления | Предупреждения о низком балансе, истечении подписки | P3 |

## Текущее состояние

Директория содержит пустой Vite + React + TypeScript шаблон:

```
services/web-billing/
├── src/           # Исходники (шаблон)
├── public/        # Статика
├── docker/        # Docker конфигурация
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
└── Dockerfile
```

## Legacy-справка

В старой системе (legacy-stels) биллинг реализован в:
- `monitoring/target/dist/billingwebapp/` — ExtJS UI
- Таблицы: `tariffs`, `balanceHistoryWithDetails`, `yandexPayment`, `billingRoles`
- Spring HTTP сессии: `billingwebapp-sessions`

**При реализации:** изучить legacy-схему в `docs/stels/LEGACY_DATABASE_SCHEMA.md` §I (Биллинг и платежи).

## Технологический стек (планируемый)

| Категория | Технология | Примечание |
|-----------|-----------|-----------|
| Framework | React 18 + TypeScript 5 | Аналогично web-frontend |
| Build | Vite 5 | Уже настроен |
| State | Zustand | Аналогично web-frontend |
| UI | Tailwind CSS + Shadcn/ui | Аналогично web-frontend |
| Forms | React Hook Form + Zod | Для тарифов и платежей |
| PDF | react-pdf / jsPDF | Генерация счетов |
| Charts | Recharts | Финансовая аналитика |

## Связанные документы

- [ARCHITECTURE.md](ARCHITECTURE.md) — Планируемая архитектура
- [DECISIONS.md](DECISIONS.md) — Архитектурные решения
- [RUNBOOK.md](RUNBOOK.md) — Запуск
- [INDEX.md](INDEX.md) — Содержание документации
- [docs/stels/LEGACY_DATABASE_SCHEMA.md](../../../docs/stels/LEGACY_DATABASE_SCHEMA.md) — Legacy биллинг-схема (справка)
