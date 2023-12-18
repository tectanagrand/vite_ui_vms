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
import NavSection from 'src/components/nav/NavSection';
import ListReqStat from 'src/pages/dashboard/ListReqStat';
import FormUserPage from 'src/pages/FormUserPage';
import User from 'src/pages/dashboard/User';
import MenuAccessPage from 'src/pages/MenuAccessPage';
import ListUserGroup from 'src/pages/dashboard/ListUserGroup';
import RefactorFormVendorPage from 'src/pages/RefactorFormVendorPage';
import QRPage from 'src/pages/QRPage';
import TestPage from 'src/pages/TestPage';
import ListMasterBank from 'src/pages/dashboard/ListMasterBank';
import TicketInvalid from 'src/pages/TicketInvalid';

export const routes = createBrowserRouter([
  {
    path: 'frm/:formtype/:token',
    element: <RefactorFormVendorPage />,
    loader: async ({ params }) => {
      const checkValid = await axios.post(`${process.env.REACT_APP_URL_LOC}/ticket/checkvalid`, {
        ticket_id: params.token,
      });
      if (checkValid.status === 403) {
        throw new Response('Ticket is closed', { ticket_id: checkValid.data.message });
      }
      return {
        type: 'new',
        token: params.token,
      };
    },
    errorElement: <TicketInvalid />,
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
    path: 'user',
    element: <FormUserPage />,
  },
  {
    path: 'dashboard',
    element: <Dashboard />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'form/:token',
        element: <RefactorFormVendorPage />,
        loader: ({ params }) => {
          return {
            type: 'form',
            token: params.token,
          };
        },
        // loader: async ({ params }) => {
        //   const response = await formLoader(params);
        //   if (response.data.data.cur_pos === 'VENDOR' || response.data.data.cur_pos === 'PROC') {
        //     return { ...response.data, role: '', section: 'VENDOR' };
        //   } else {
        //     return { ...response.data, role: '', section: 'MDM' };
        //   }
        // },
      },
      {
        path: 'ticket',
        element: <ListTicket />,
      },
      {
        path: 'vendor',
        element: <ListVendor />,
      },
      {
        path: 'ticketreqstat',
        element: <ListReqStat />,
      },
      {
        path: 'users',
        element: <User />,
      },
      {
        path: 'users/create',
        element: <FormUserPage />,
      },
      {
        path: 'securitygroup',
        element: <ListUserGroup />,
      },
      {
        path: 'securitygroup/create',
        element: <MenuAccessPage />,
      },
      {
        path: 'banks',
        element: <ListMasterBank />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="login" />,
  },
  {
    path: '/nav',
    element: <NavSection />,
  },
  {
    path: '/accessmenu',
    element: <MenuAccessPage />,
  },
  {
    path: '/qr',
    element: <QRPage />,
  },
  {
    path: 'testpage',
    element: <TestPage />,
  },
  {
    path: 'invalidticket',
    element: <TicketInvalid />,
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
