import { useRoutes } from 'react-router-dom';
import FormVendorPage from './pages/FormVendorPage';

export default function Router() {
  const routes = useRoutes([{ path: '/form', element: <FormVendorPage /> }]);
  return routes;
}
