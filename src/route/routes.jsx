import { Navigate, createBrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { lazy } from 'react';
// import ErrorPage from '../pages/ErrorPage';
// import Error404 from 'src/pages/Error404';
// import LoginPage from 'src/pages/LoginPage';
// import Dashboard from 'src/pages/dashboard/Dashboard';
// import ListTicket from 'src/pages/dashboard/ListTicket';
// import ListVendor from 'src/pages/dashboard/ListVendor';
// import ListReqStat from 'src/pages/dashboard/ListReqStat';
// import FormUserPage from 'src/pages/FormUserPage';
// import User from 'src/pages/dashboard/RefactorUser';
// import MenuAccessPage from 'src/pages/MenuAccessPage';
// import ListUserGroup from 'src/pages/dashboard/ListUserGroup';
// import RefactorFormVendorPage from 'src/pages/RefactorFormVendorPage';
// import ListMasterBank from 'src/pages/dashboard/ListMasterBank';
// import TicketInvalid from 'src/pages/TicketInvalid';
// import ResetPassword from 'src/pages/ResetPassword';

const ErrorPage = lazy(() => import('../pages/ErrorPage'));
const Error404 = lazy(() => import('src/pages/Error404'));
const LoginPage = lazy(() => import('src/pages/LoginPage'));
const Dashboard = lazy(() => import('src/pages/dashboard/Dashboard'));
const ListTicket = lazy(() => import('src/pages/dashboard/ListTicket'));
const ListVendor = lazy(() => import('src/pages/dashboard/ListVendor'));
const ListReqStat = lazy(() => import('src/pages/dashboard/ListReqStat'));
const FormUserPage = lazy(() => import('src/pages/FormUserPage'));
const User = lazy(() => import('src/pages/dashboard/RefactorUser'));
const MenuAccessPage = lazy(() => import('src/pages/MenuAccessPage'));
const ListUserGroup = lazy(() => import('src/pages/dashboard/ListUserGroup'));
const RefactorFormVendorPage = lazy(() => import('src/pages/RefactorFormVendorPage'));
const ListMasterBank = lazy(() => import('src/pages/dashboard/ListMasterBank'));
const TicketInvalid = lazy(() => import('src/pages/TicketInvalid'));
const ResetPassword = lazy(() => import('src/pages/ResetPassword'));

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
    errorElement: <ErrorPage />,
  },
  {
    path: 'resetpass',
    element: <ResetPassword />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'dashboard',
    element: <Dashboard />,
    loader: () => {
      return null;
    },
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
        path: 'account/edit',
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
    path: 'invalidticket',
    element: <TicketInvalid />,
    errorElement: <ErrorPage />,
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
