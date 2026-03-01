# 💳 Web Billing — Runbook

> Тег: `ЧЕРНОВИК` | Обновлён: `2026-06-02` | Версия: `0.1`
> **Статус:** PostMVP — сервис не реализован, только шаблон.

## Запуск шаблона

```bash
cd services/web-billing
npm install
npm run dev         # Vite dev server → http://localhost:3002
```

## Docker

```bash
docker build -t wayrecall/web-billing .
docker run -p 3002:80 wayrecall/web-billing
```

## Текущее состояние

Проект содержит **пустой Vite + React + TypeScript шаблон** без бизнес-логики.
Для начала работы см. [ARCHITECTURE.md](ARCHITECTURE.md) — планируемые экраны и API.

## Предстоящие задачи

| # | Задача | Приоритет |
|---|--------|-----------|
| 1 | Реализовать Billing Service (Scala backend) | P1 |
| 2 | Настроить Tailwind CSS + Shadcn/ui | P1 |
| 3 | Реализовать аутентификацию (shared с web-frontend) | P1 |
| 4 | Экран «Тарифы» (CRUD) | P1 |
| 5 | Экран «Подписки» | P1 |
| 6 | Экран «Счета» (генерация PDF) | P2 |
| 7 | Интеграция с ЮKassa | P2 |
| 8 | Экран «Финансовый Dashboard» | P2 |
| 9 | Экспорт финансовых отчётов | P3 |
