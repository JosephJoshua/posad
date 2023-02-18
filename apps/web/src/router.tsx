import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import HomePage from './pages/HomePage';

const routes = <Route path="/" element={<HomePage />} />;

const router = createBrowserRouter(createRoutesFromElements(routes));
export default router;
