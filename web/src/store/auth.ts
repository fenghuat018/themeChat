import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { API_BASE_URL, api, attachAuthInterceptors } from '../lib/api';
import type { User } from '../types';
import { useToastStore } from './toast';

interface AuthState {
  ready: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  bootstrap: () => Promise<void>;
  setTokens: (access: string, refresh: string) => void;
  fetchMe: () => Promise<User | null>;
  refreshAccessToken: () => Promise<string | null>;
  clear: () => void;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
}

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ready: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      async bootstrap() {
        if (get().ready) {
          return;
        }
        const { accessToken, refreshToken } = get();
        if (!refreshToken) {
          set({ ready: true, user: null, accessToken: null });
          return;
        }

        try {
          let token = accessToken;
          if (!token) {
            token = await get().refreshAccessToken();
          }
          if (token) {
            await get().fetchMe();
          }
        } catch (error) {
          get().clear();
          console.error('Failed to bootstrap auth', error);
        } finally {
          set({ ready: true });
        }
      },
      setTokens(access, refresh) {
        set({ accessToken: access, refreshToken: refresh });
      },
      async fetchMe() {
        try {
          const response = await api.get<User>('auth/me/');
          set({ user: response.data });
          return response.data;
        } catch (error) {
          console.error('Unable to load current user', error);
          get().clear();
          return null;
        }
      },
      async refreshAccessToken() {
        const refresh = get().refreshToken;
        if (!refresh) {
          return null;
        }
        try {
          const response = await refreshClient.post<{ access: string }>('auth/token/refresh/', {
            refresh,
          });
          const accessToken = response.data.access;
          set({ accessToken });
          return accessToken;
        } catch (error) {
          console.warn('Refresh token invalid, clearing session');
          get().clear();
          return null;
        }
      },
      clear() {
        set({ accessToken: null, refreshToken: null, user: null });
      },
      async logout() {
        const refresh = get().refreshToken;
        try {
          if (refresh) {
            await api.post('auth/logout/', { refresh });
          }
        } catch (error) {
          console.warn('Logout request failed', error);
        } finally {
          get().clear();
          useToastStore.getState().pushToast({
            type: 'success',
            message: 'Signed out successfully.',
          });
        }
      },
      isAuthenticated() {
        return Boolean(get().accessToken);
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
);

attachAuthInterceptors(
  () => useAuthStore.getState().accessToken,
  () => useAuthStore.getState().refreshAccessToken(),
  () => useAuthStore.getState().clear(),
);
