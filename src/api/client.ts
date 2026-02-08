/**
 * =====================================================
 * API Client — HTTP-клиент для billing admin
 * =====================================================
 *
 * Обёртка над fetch с типизацией ApiResponse<T>.
 *
 * Legacy использовал Ext.data.Store с proxy: {type: 'direct', directFn: ...},
 * а также Ext.Ajax.request для прямых HTTP-вызовов.
 *
 * Здесь всё через fetch + JSON.
 * Позже можно перейти на TanStack Query (React Query)
 * для кеширования, ретраев и инвалидации.
 *
 * GridParams соответствует legacy Ext.data.Store params:
 *   {page, start, limit, sort: [{property, direction}], filters: [...]}
 */

import { API_BASE_URL } from './endpoints';
import type { ApiResponse, PaginatedResponse, GridParams } from './types';

// Конфигурация
interface ApiConfig {
  baseUrl: string;
  headers: Record<string, string>;
}

const defaultConfig: ApiConfig = {
  baseUrl: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Преобразование GridParams в query string
function buildQueryString(params?: GridParams): string {
  if (!params) return '';
  
  const parts: string[] = [];
  
  if (params.page !== undefined) parts.push(`page=${params.page}`);
  if (params.start !== undefined) parts.push(`start=${params.start}`);
  if (params.limit !== undefined) parts.push(`limit=${params.limit}`);
  if (params.query) parts.push(`query=${encodeURIComponent(params.query)}`);
  
  if (params.sort?.length) {
    parts.push(`sort=${encodeURIComponent(JSON.stringify(params.sort))}`);
  }
  
  if (params.filters?.length) {
    parts.push(`filters=${encodeURIComponent(JSON.stringify(params.filters))}`);
  }
  
  return parts.length ? `?${parts.join('&')}` : '';
}

// HTTP методы
async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultConfig.headers,
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return {
        success: false,
        error: error.message || `HTTP ${response.status}`,
        code: response.status,
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// CRUD операции
export const apiClient = {
  // GET запрос
  async get<T>(url: string, params?: GridParams): Promise<ApiResponse<T>> {
    const queryString = buildQueryString(params);
    return request<T>(`${url}${queryString}`);
  },
  
  // GET список с пагинацией
  async getList<T>(url: string, params?: GridParams): Promise<ApiResponse<PaginatedResponse<T>>> {
    const queryString = buildQueryString(params);
    return request<PaginatedResponse<T>>(`${url}${queryString}`);
  },
  
  // POST запрос
  async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
  
  // PUT запрос
  async put<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    return request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  // PATCH запрос
  async patch<T>(url: string, data: unknown): Promise<ApiResponse<T>> {
    return request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  
  // DELETE запрос
  async delete<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return request<T>(url, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  },
};

export default apiClient;
