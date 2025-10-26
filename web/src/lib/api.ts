import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

type AccessTokenGetter = () => string | null;
type RefreshExecutor = () => Promise<string | null>;
type UnauthorizedHandler = () => void | Promise<void>;

declare module 'axios' {
  // Allow retry flag on config objects
  interface InternalAxiosRequestConfig<D = any> {
    _retry?: boolean;
  }
}

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api/';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const attachAuthInterceptors = (
  getAccessToken: AccessTokenGetter,
  refreshAccessToken: RefreshExecutor,
  onUnauthorized: UnauthorizedHandler,
) => {
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.setAuthorization(`Bearer ${token}`);
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config: InternalAxiosRequestConfig & { _retry?: boolean } =
        error.config;
      if (!config || config._retry) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401) {
        config._retry = true;
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          config.headers.setAuthorization(`Bearer ${newAccessToken}`);
          return api.request(config);
        }
        await onUnauthorized();
      }

      return Promise.reject(error);
    },
  );
};
