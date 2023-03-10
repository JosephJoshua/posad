import { LoadingPage } from '@posad/react-core/components/loading-page';
import { useAuthContext } from '@posad/react-core/libs/firebase';
import { FC } from 'react';
import {
  Navigate,
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductsBoughtPage from './pages/ProductsBoughtPage';
import RegisterPage from './pages/RegisterPage';

const ProtectedRoute: FC = () => {
  const { isLoading, isAuthenticated } = useAuthContext();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
};

const AuthRoute: FC = () => {
  const { isLoading, isAuthenticated } = useAuthContext();

  if (isLoading) {
    return <LoadingPage />;
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
      <Route path="products-bought" element={<ProductsBoughtPage />} />
    </Route>

    <Route path="/auth" element={<AuthRoute />}>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
    </Route>
  </>
);

const router = createBrowserRouter(createRoutesFromElements(routes));
export default router;
