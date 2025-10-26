import { api, API_BASE_URL } from './api';
import type { OAuthProvider } from '../types';
import { useAuthStore } from '../store/auth';

export const getProviders = async (): Promise<OAuthProvider[]> => {
  const response = await api.get<{ providers: OAuthProvider[] }>('auth/providers/');
  return response.data.providers;
};

export const oauthLogin = (providerId: string) => {
  const loginUrl = `${API_BASE_URL}auth/${providerId}/login/`;
  window.location.href = loginUrl;
};

export const completeOAuthCallback = async (): Promise<void> => {
  const store = useAuthStore.getState();
  const params = new URLSearchParams(window.location.search);
  const access = params.get('access');
  const refresh = params.get('refresh');
  const error = params.get('error');

  if (error) {
    throw new Error(error);
  }

  if (!access || !refresh) {
    throw new Error('Missing OAuth tokens in callback URL.');
  }

  store.setTokens(access, refresh);
  await store.fetchMe();
  window.history.replaceState({}, document.title, '/oauth/callback');
};
