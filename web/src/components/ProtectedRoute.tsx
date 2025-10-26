import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthStore } from '../store/auth';

export function ProtectedRoute() {
  const ready = useAuthStore((state) => state.ready);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const location = useLocation();

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center text-slate-300">
        Checking session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
