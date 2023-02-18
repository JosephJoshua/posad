import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

const routes = (
  <>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
  </>
);

const router = createBrowserRouter(createRoutesFromElements(routes));
export default router;
