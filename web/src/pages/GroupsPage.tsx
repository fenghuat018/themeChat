import { useEffect, useState } from 'react';

import { api } from '../lib/api';
import { useToastStore } from '../store/toast';
import type { Room } from '../types';

type PaginatedRooms = {
  results: Room[];
};

export function GroupsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pushToast = useToastStore((state) => state.pushToast);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get<PaginatedRooms>('rooms/joined/');
        setRooms(response.data.results);
      } catch (err) {
        console.error(err);
        setError('Unable to load your groups.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return <p className="text-slate-400">Loading your groups…</p>;
  }

  if (error) {
    return <p className="text-rose-400">{error}</p>;
  }

  if (!rooms.length) {
    return <p className="text-slate-400">You have not joined any rooms yet. Explore themes to get started.</p>;
  }

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold text-white">Your Groups</h1>
        <p className="text-sm text-slate-400">Rooms you&apos;ve already joined appear here.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {rooms.map((room) => (
          <article
            key={room.id}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg transition hover:border-brand-400 hover:shadow-brand-500/20"
          >
            <h2 className="text-xl font-semibold text-white">{room.name}</h2>
            <p className="mt-2 text-sm text-slate-400">Theme: {room.theme}</p>
            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-brand-400/50 px-4 py-2 text-sm font-semibold text-brand-200 transition hover:border-brand-300 hover:text-brand-100"
              onClick={() => pushToast({ type: 'info', message: 'Chat view not implemented yet.' })}
            >
              Open chat
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
