import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ExplorePage } from './pages/ExplorePage';
import { GroupsPage } from './pages/GroupsPage';
import { LoginPage, RegisterPage } from './pages/LoginPage';
import { MessagesPage } from './pages/MessagesPage';
import { OAuthCallbackPage } from './pages/OAuthCallbackPage';
import { useAuthStore } from './store/auth';

function App() {
  const bootstrap = useAuthStore((state) => state.bootstrap);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/explore" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="oauth/callback" element={<OAuthCallbackPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="explore" element={<ExplorePage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="messages" element={<MessagesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/explore" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
