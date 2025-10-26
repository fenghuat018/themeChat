import { useEffect, useState } from 'react';

import { api } from '../lib/api';
import { useToastStore } from '../store/toast';
import type { Room } from '../types';

type PaginatedRooms = {
  results: Room[];
};

export function ExplorePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pushToast = useToastStore((state) => state.pushToast);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get<PaginatedRooms>('rooms/explore/');
        setRooms(response.data.results);
      } catch (err) {
        console.error(err);
        setError('Unable to load rooms.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleJoin = async (room: Room) => {
    try {
      await api.post(`rooms/${room.id}/join/`);
      setRooms((prev) => prev.filter((item) => item.id !== room.id));
      pushToast({ type: 'success', message: `You joined ${room.name}.` });
    } catch (err) {
      console.error(err);
      pushToast({ type: 'error', message: 'Could not join room.' });
    }
  };

  if (loading) {
    return <p className="text-slate-400">Loading rooms…</p>;
  }

  if (error) {
    return <p className="text-rose-400">{error}</p>;
  }

  if (!rooms.length) {
    return <p className="text-slate-400">You have explored all public rooms. 🎉</p>;
  }

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold text-white">Explore Themes</h1>
        <p className="text-sm text-slate-400">
          Browse public rooms and jump into the conversations that match your vibe.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {rooms.map((room) => (
          <article
            key={room.id}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg transition hover:border-brand-400 hover:shadow-brand-500/20"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">{room.name}</h2>
              <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs uppercase tracking-wide text-brand-200">
                {room.theme}
              </span>
            </div>
            <p className="text-sm text-slate-400">Join the room to unlock themed chats and meet fellow enthusiasts.</p>
            <button
              type="button"
              onClick={() => handleJoin(room)}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-400"
            >
              Join Room
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
