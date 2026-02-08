/**
 * Точка входа React-приложения billing admin.
 * Запуск: cd services/web-billing && npm run dev (порт 3001)
 *
 * index.css содержит все стили, эмулирующие ExtJS Gray Theme.
 * Никаких CSS-фреймворков — всё вручную для 1:1 совпадения с legacy.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
