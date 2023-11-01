import { Navigate, createBrowserRouter, redirect, useRoutes } from 'react-router-dom';
import FormVendorPage from '../pages/FormVendorPage';
import axios from 'axios';
import ErrorPage from '../pages/ErrorPage';
import Error404 from 'src/pages/Error404';
import LoginPage from 'src/pages/LoginPage';
import Dashboard from 'src/pages/dashboard/Dashboard';
import Cookies from 'js-cookie';
import { ListTicket, loaderTicket } from 'src/pages/dashboard/ListTicket';
import ListVendor from 'src/pages/dashboard/ListVendor';

async function formLoader({ token }) {
  axios.defaults.headers.common.Authorization =
    'Bearer ' + (Cookies.get('jwttoken') === undefined ? '' : Cookies.get('jwttoken'));
  const response = await axios.get(`${process.env.REACT_APP_URL_LOC}/ticket/form/${token}`);
  return response;
}

async function newformLoader({ token }) {
  const response = await axios.get(`${process.env.REACT_APP_URL_LOC}/ticket/newform/${token}`);
  return response;
}

export const routes = createBrowserRouter([
  {
    path: 'frm/:formtype/:token',
    element: <FormVendorPage />,
    loader: async ({ params }) => {
      const response = await newformLoader(params);
      return { ...response.data, role: 'VENDOR', section: 'VENDOR' };
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
    path: 'ticket',
    loader: loaderTicket,
    element: <ListTicket />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'vendor',
    element: <ListVendor />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'dashboard',
    element: <Dashboard />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'form/:token',
        element: <FormVendorPage />,
        loader: async ({ params }) => {
          const response = await formLoader(params);
          if (response.data.data.cur_pos === 'VENDOR' || response.data.data.cur_pos === 'PROC') {
            return { ...response.data, role: '', section: 'VENDOR' };
          } else {
            return { ...response.data, role: '', section: 'MDM' };
          }
        },
      },
      {
        path: 'ticket',
        element: <ListTicket />,
        loader: loaderTicket,
      },
      {
        path: 'vendor',
        element: <ListVendor />,
      },
    ],
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
