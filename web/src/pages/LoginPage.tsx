import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { getProviders, oauthLogin } from '../lib/auth';
import { useAuthStore } from '../store/auth';
import { useToastStore } from '../store/toast';
import type { OAuthProvider } from '../types';

function OAuthButtons({ providers }: { providers: OAuthProvider[] }) {
  if (!providers.length) {
    return (
      <p className="text-sm text-slate-400">
        No OAuth providers configured. Please add credentials in the backend admin.
      </p>
    );
  }

  return (
    <div className="mt-6 grid gap-3">
      {providers.map((provider) => (
        <button
          key={provider.id}
          type="button"
          onClick={() => oauthLogin(provider.id)}
          className="flex items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-white transition hover:border-brand-400 hover:bg-slate-800"
        >
          <span className="text-base">🔐</span>
          <span>Continue with {provider.name}</span>
        </button>
      ))}
    </div>
  );
}

export function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const [providers, setProviders] = useState<OAuthProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const pushToast = useToastStore((state) => state.pushToast);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await getProviders();
        setProviders(data);
      } catch (error) {
        console.error(error);
        pushToast({ type: 'error', message: 'Unable to load OAuth providers.' });
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [pushToast]);

  if (isAuthenticated) {
    return <Navigate to="/explore" replace />;
  }

  return (
    <section className="mx-auto max-w-md rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
      <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-400">
        ThemeChat is OAuth-only. Choose a provider to sign in — no passwords required.
      </p>
      {loading ? (
        <p className="mt-6 text-sm text-slate-400">Loading providers…</p>
      ) : (
        <OAuthButtons providers={providers} />
      )}
    </section>
  );
}

export function RegisterPage() {
  return <LoginPage />;
}
