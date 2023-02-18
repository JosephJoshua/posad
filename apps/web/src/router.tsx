import { useAuthContext } from '@posad/react-core/libs/firebase';
import { FC, PropsWithChildren } from 'react';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

const ProtectedRoute: FC = () => {
  const { isLoading, isAuthenticated } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

const AuthRoute: FC = () => {
  const { isLoading, isAuthenticated } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const routes = (
  <>
    <Route path="/" element={<ProtectedRoute />}>
      <Route index element={<HomePage />} />
    </Route>

    <Route path="/auth" element={<AuthRoute />}>
      <Route path="login" element={<LoginPage />} />
    </Route>
  </>
);

const router = createBrowserRouter(createRoutesFromElements(routes));
export default router;
