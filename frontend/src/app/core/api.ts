type ApiImportMetaEnv = {
	readonly NG_APP_API_BASE_URL?: string;
	readonly VITE_API_BASE_URL?: string;
	readonly API_BASE_URL?: string;
};

const runtimeApiBaseUrl = (globalThis as { __API_BASE_URL__?: string }).__API_BASE_URL__;
const buildApiBaseUrl = (import.meta as { env?: ApiImportMetaEnv }).env?.NG_APP_API_BASE_URL
	|| (import.meta as { env?: ApiImportMetaEnv }).env?.VITE_API_BASE_URL
	|| (import.meta as { env?: ApiImportMetaEnv }).env?.API_BASE_URL;

export const API_BASE_URL = runtimeApiBaseUrl || buildApiBaseUrl || 'http://localhost:4000';
