import { Navigate, createBrowserRouter, redirect, useRoutes } from 'react-router-dom';
import FormVendorPage from '../pages/FormVendorPage';
import axios from 'axios';
import ErrorPage from '../pages/ErrorPage';
import Error404 from 'src/pages/Error404';
import LoginPage from 'src/pages/LoginPage';
import Cookies from 'js-cookie';

async function formLoader({ formtype: formType, token }) {
  if (formType == 'newform') {
    const response = await axios.get(`${process.env.REACT_APP_URL_LOC}/ticket/form/new/${token}`);
    if (response.status == 500) {
      throw new Error({ status: 500, statusText: response.message });
    } else if (response.status == 404) {
      throw new Error({ status: 404, statusText: response.message });
    } else {
      return response.data;
    }
  } else if (formType == 'form') {
    axios.defaults.headers.common.Authorization =
      'Bearer ' + (Cookies.get('jwttoken') === undefined ? '' : Cookies.get('jwttoken'));
    const response = await axios.get(`${process.env.REACT_APP_URL_LOC}/ticket/form/${token}`);
    if (response.status == 500) {
      throw new Error({ status: 500, statusText: response.message });
    } else if (response.status == 401) {
      console.log(response.status);
      redirect('/login');
    } else {
      return response.data;
    }
  }
  return null;
}

export const routes = createBrowserRouter([
  {
    path: 'frm/:formtype/:token',
    element: <FormVendorPage />,
    loader: async ({ params }) => {
      const response = await formLoader(params);
      return response;
    },
    errorElement: <ErrorPage />,
  },
  {
    path: '/',
    children: [
      { path: '404', element: <Error404 /> },
      { path: '', element: <Navigate to="login" /> },
    ],
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <Navigate to="/404" />,
  },
]);

// export default function Router() {
// const routes = useRoutes([
//   {
//     path: 'frm/newform/:token',
//     element: <FormVendorPage />,
//     loader: async (params) => {
//       await formLoader(params);
//     },
//     errorElement: <ErrorPage />,
//   },
//   {
//     path: '/',
//     children: [{ path: '404', element: <Error404 /> }],
//   },
//   {
//     path: '*',
//     element: <Navigate to="/404" />,
//   },
// ]);
// return routes;
// }
