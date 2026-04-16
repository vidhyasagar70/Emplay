const runtimeApiBaseUrl = (globalThis as { __API_BASE_URL__?: string }).__API_BASE_URL__;

export const API_BASE_URL = runtimeApiBaseUrl || 'http://localhost:4000';
