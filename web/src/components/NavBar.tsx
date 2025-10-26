import { NavLink, useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/auth';

const links = [
  { to: '/explore', label: 'Explore' },
  { to: '/groups', label: 'Groups' },
  { to: '/messages', label: 'Messages' },
];

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-brand-500/30 text-white'
      : 'text-slate-200 hover:bg-slate-700/60 hover:text-white'
  }`;

export function NavBar() {
  const ready = useAuthStore((state) => state.ready);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/explore" className="text-lg font-semibold text-white">
          ThemeChat
        </NavLink>
        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          {!ready && <span className="text-slate-400">Loading…</span>}
          {ready && !isAuthenticated && (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className="text-slate-200 hover:text-white">
                Login
              </NavLink>
              <span className="text-slate-600">/</span>
              <NavLink to="/register" className="text-slate-200 hover:text-white">
                Register
              </NavLink>
            </div>
          )}
          {ready && isAuthenticated && user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white">
                  {user.profile?.nickname?.[0]?.toUpperCase() ?? user.username[0]?.toUpperCase() ?? 'U'}
                </div>
                <div className="leading-tight">
                  <div className="font-medium text-white">{user.profile?.nickname ?? user.username}</div>
                  <div className="text-xs text-slate-400">{user.email ?? 'OAuth user'}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-slate-600 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-slate-400 hover:text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
