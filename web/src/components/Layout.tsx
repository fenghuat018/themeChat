import { Outlet } from 'react-router-dom';

import { NavBar } from './NavBar';
import { ToastContainer } from './ToastContainer';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
}
