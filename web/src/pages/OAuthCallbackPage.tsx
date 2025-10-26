import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { completeOAuthCallback } from '../lib/auth';
import { useToastStore } from '../store/toast';

export function OAuthCallbackPage() {
  const [message, setMessage] = useState('Processing OAuth redirect…');
  const navigate = useNavigate();
  const pushToast = useToastStore((state) => state.pushToast);

  useEffect(() => {
    const finish = async () => {
      try {
        await completeOAuthCallback();
        pushToast({ type: 'success', message: 'Signed in successfully.' });
        navigate('/explore', { replace: true });
      } catch (error) {
        console.error(error);
        pushToast({ type: 'error', message: 'OAuth login failed.' });
        setMessage('OAuth login failed. You can close this tab and try again.');
      }
    };

    finish();
  }, [navigate, pushToast]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center text-slate-200">
      <div className="rounded-lg border border-slate-800 bg-slate-900/70 px-10 py-8 shadow-lg">
        <h1 className="text-xl font-semibold text-white">Please hold on…</h1>
        <p className="mt-3 text-sm text-slate-400">{message}</p>
      </div>
    </div>
  );
}
