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

async function formLoader({ token }) {
  axios.defaults.headers.common.Authorization =
    'Bearer ' + (Cookies.get('accessToken') === undefined ? '' : Cookies.get('accessToken'));
  const response = await axios.get(`${process.env.REACT_APP_URL_LOC}/ticket/form/${token}`);
  const data = response.data.data;
  const valueForm = {
    emailRequestor: data.email_proc ? data.email_proc : '',
    deptRequestor: data.dep_proc ? data.dep_proc : '',
    titlecomp: data.title ? data.title : '',
    localovs: data.local_ovs ? data.local_ovs : '',
    name1: data['name_1'] ? data['name_1'] : '',
    country: data.country ? data.country : '',
    street: data.street ? data.street : '',
    postal: data.postal ? data.postal : '',
    city: data.city ? data.city : '',
    telf: data.telf1 ? data.telf1 : '',
    fax: data.fax ? data.fax : '',
    email: data.email ? data.email : '',
    ispkp: data.is_pkp ? data.is_pkp : false,
    npwp: data.npwp ? data.npwp : '',
    paymthd: data.pay_mthd ? data.pay_mthd : '',
    payterm: data.pay_term ? data.pay_term : '',
    company: data.company ? data.company : '',
    purchorg: data.purch_org ? data.purch_org : '',
    vengroup: data.ven_group ? data.ven_group : '',
    venacc: data.ven_acc ? data.ven_acc : '',
    ventype: data.ven_type ? data.ven_type : '',
    currency: data.lim_curr ? data.lim_curr : '',
    description: data.description ? data.description : '',
    is_tender: data.is_tender ? data.is_tender : false,
    vendorcode: data.ven_code ? data.ven_code : data.header,
    remarks: data.remarks ? data.remarks : '',
    limit: data.limit_vendor ? data.limit_vendor : '',
    reject_by: data.reject_by ? data.reject_by : '',
    is_active: data.ticket_stat,
  };
  console.log(data);
  return {
    ticket_id: data.ticket_id,
    ticket_num: data.ticket_num,
    ven_id: data.ven_id === null ? data.ticket_ven_id : data.ven_id,
    ticketState: data.ticket_state,
    data: valueForm,
  };
}

async function newformLoader({ token }) {
  axios.defaults.headers.common.Authorization =
    'Bearer ' + (Cookies.get('accessToken') === undefined ? '' : Cookies.get('accessToken'));
  const response = await axios.get(`${process.env.REACT_APP_URL_LOC}/ticket/newform/${token}`);
  const data = response.data.data;
  if (data === undefined) {
    throw new Response('Not Found', { status: 404, statusText: 'Not Found' });
  }
  const valueForm = {
    emailRequestor: data.email_proc ? data.email_proc : '',
    deptRequestor: data.dep_proc ? data.dep_proc : '',
    titlecomp: data.title ? data.title : '',
    localovs: data.local_ovs ? data.local_ovs : '',
    name1: data['name_1'] ? data['name_1'] : '',
    country: data.country ? data.country : '',
    street: data.street ? data.street : '',
    postal: data.postal ? data.postal : '',
    city: data.city ? data.city : '',
    telf: data.telf1 ? data.telf1 : '',
    fax: data.fax ? data.fax : '',
    email: data.email ? data.email : '',
    ispkp: data.is_pkp ? data.is_pkp : false,
    npwp: data.npwp ? data.npwp : '',
    paymthd: data.pay_mthd ? data.pay_mthd : '',
    payterm: data.pay_term ? data.pay_term : '',
    company: data.company ? data.company : '',
    purchorg: data.purch_org ? data.purch_org : '',
    vengroup: data.ven_group ? data.ven_group : '',
    venacc: data.ven_acc ? data.ven_acc : '',
    ventype: data.ven_type ? data.ven_type : '',
    currency: data.lim_curr ? data.lim_curr : '',
    description: data.description ? data.description : '',
    is_tender: data.is_tender ? data.is_tender : false,
    vendorcode: data.ven_code ? data.ven_code : data.header,
    remarks: data.remarks ? data.remarks : '',
    limit: data.limit_vendor ? data.limit_vendor : '',
    reject_by: data.reject_by ? data.reject_by : '',
    is_active: data.ticket_stat,
  };

  const perm = {
    INIT: {
      create: false,
      read: false,
      update: true,
      delete: false,
    },
    CREA: {
      create: false,
      read: false,
      update: false,
      delete: false,
    },
    FINA: {
      create: false,
      read: false,
      update: false,
      delete: false,
    },
  };

  return {
    ticket_id: data.ticket_id,
    ticket_num: data.ticket_num,
    ven_id: data.ven_id === null ? data.ticket_ven_id : data.ven_id,
    ticketState: data.ticket_state,
    data: valueForm,
    permission: perm,
  };
}

export const routes = createBrowserRouter([
  {
    path: 'frm/:formtype/:token',
    element: <RefactorFormVendorPage />,
    loader: async ({ params }) => {
      const response = await newformLoader(params);
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
        loader: async ({ params }) => {
          return await formLoader(params);
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
    path: '/refactor',
    element: <RefactorFormVendorPage />,
    loader: async () => {
      const loader = await formLoader({ token: '6c7a753f-2881-4c41-afd2-bb3696b3d306' });
      return loader;
    },
  },
  {
    path: '/qr',
    element: <QRPage />,
  },
  {
    path: 'testpage',
    element: <TestPage />,
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
