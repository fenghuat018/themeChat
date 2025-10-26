import { useEffect, useState } from 'react';

import { api } from '../lib/api';
import { useToastStore } from '../store/toast';
import type { Message } from '../types';

type PaginatedMessages = {
  results: Message[];
};

export function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pushToast = useToastStore((state) => state.pushToast);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get<PaginatedMessages>('messages/unread/');
        setMessages(response.data.results);
      } catch (err) {
        console.error(err);
        setError('Unable to load messages.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <p className="text-slate-400">Checking for unread messages…</p>;
  }

  if (error) {
    return <p className="text-rose-400">{error}</p>;
  }

  if (!messages.length) {
    return <p className="text-slate-400">You&apos;re all caught up. ✨</p>;
  }

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold text-white">Unread Messages</h1>
        <p className="text-sm text-slate-400">
          Click any message to preview. Full chat is coming in a future milestone.
        </p>
      </header>
      <div className="flex flex-col gap-3">
        {messages.map((message) => (
          <button
            key={message.id}
            type="button"
            onClick={() =>
              pushToast({
                type: 'info',
                message: `Message preview from ${message.sender.username}: ${message.snippet || '(no text)'}`,
              })
            }
            className="flex flex-col items-start gap-1 rounded-lg border border-slate-800 bg-slate-900/70 px-5 py-4 text-left transition hover:border-brand-400 hover:shadow-lg"
          >
            <span className="text-sm font-semibold text-white">{message.room.name}</span>
            <span className="text-xs text-slate-400">
              From {message.sender.username} • {new Date(message.created_at).toLocaleString()}
            </span>
            <span className="text-sm text-slate-200">{message.snippet || 'No preview available.'}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
