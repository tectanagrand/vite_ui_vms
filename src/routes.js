import { redirect, useRoutes } from 'react-router-dom';
import FormVendorPage from './pages/FormVendorPage';
import axios from 'axios';

async function formLoader({ formType, token }) {
  if (formType == 'newform') {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL_LOC}/form/new/${token}`);
      if (response.status == 401) {
        redirect('/login');
      } else {
        return response.data;
      }
    } catch (error) {
      redirect('/404');
      return 0;
    }
  } else if (formType == 'form') {
    return { data: 'yes' };
  }
}

export default function Router() {
  const routes = useRoutes([
    {
      path: 'frm/:formtype/:token',
      loader: (params) => {
        formLoader(params);
      },
      element: <FormVendorPage />,
    },
  ]);
  return routes;
}
