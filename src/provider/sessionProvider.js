import axios from 'axios';
import { useContext, createContext, useState, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';

const SessionContext = createContext();

const SessionProvider = ({ children }) => {
  const [session, setSession_] = useState({
    fullname: Cookies.get('fullname'),
    username: Cookies.get('username'),
    email: Cookies.get('email'),
    accessToken: Cookies.get('accessToken'),
    user_id: Cookies.get('user_id'),
    role: Cookies.get('role'),
    permission: JSON.parse(sessionStorage.getItem('permission')),
    groupid: Cookies.get('groupid'),
  });

  const setSession = (data) => {
    setSession_({
      fullname: data.fullname,
      username: data.username,
      email: data.email,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user_id: data.user_id,
      role: data.role,
      permission: data.permission,
      groupid: data.groupid,
    });
  };

  const setAccessToken = (act) => {
    setSession_((prev) => ({ ...prev, accessToken: act }));
  };
  const logOut = () => {
    setSession_({});
    sessionStorage.clear();
  };

  const getPermission = (page) => {
    if (sessionStorage.getItem('permission') === null) {
      return '';
    }
    const permissions = JSON.parse(sessionStorage.getItem('permission'));
    const curPermission = permissions[page];
    return curPermission;
  };

  useEffect(() => {
    const addSession = setTimeout(() => {
      if (session.accessToken) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + session.accessToken;
        Cookies.set('accessToken', session.accessToken);
        Cookies.set('fullname', session.fullname);
        Cookies.set('email', session.email);
        Cookies.set('username', session.username);
        Cookies.set('user_id', session.user_id);
        Cookies.set('role', session.role);
        Cookies.set('groupid', session.groupid);
        sessionStorage.setItem('permission', JSON.stringify(session.permission));
      } else {
        Cookies.remove('fullname');
        Cookies.remove('email');
        Cookies.remove('username');
        Cookies.remove('user_id');
        Cookies.remove('role');
        Cookies.remove('accessToken');
        Cookies.remove('groupid');
        sessionStorage.clear();
      }
      return () => {
        clearTimeout(addSession);
      };
    }, 500);

    return () => {
      clearTimeout(addSession);
    };
  }, [session]);

  const contextValue = useMemo(() => ({ session, setSession, logOut, getPermission, setAccessToken }), [session]);

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  return useContext(SessionContext);
};

export default SessionProvider;
