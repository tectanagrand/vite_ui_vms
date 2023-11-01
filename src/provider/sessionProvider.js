import axios from 'axios';
import { useContext, createContext, useState, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';

const SessionContext = createContext();

const SessionProvider = ({ children }) => {
  const [session, setSession_] = useState({
    fullname: Cookies.get('fullname'),
    username: Cookies.get('username'),
    email: Cookies.get('email'),
    jwttoken: Cookies.get('jwttoken'),
    user_id: Cookies.get('user_id'),
    role: Cookies.get('role'),
  });
  const setSession = ({ fullname, username, email, token, id, role }) => {
    setSession_({ fullname: fullname, username: username, email: email, jwttoken: token, user_id: id, role: role });
  };
  const logOut = () => {
    setSession_({});
  };
  useEffect(() => {
    if (session.jwttoken) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + session.jwttoken;
      Cookies.set('jwttoken', session.jwttoken);
      Cookies.set('fullname', session.fullname);
      Cookies.set('email', session.email);
      Cookies.set('username', session.username);
      Cookies.set('user_id', session.user_id);
      Cookies.set('role', session.role);
    } else {
      Cookies.remove('jwttoken');
      Cookies.remove('fullname');
      Cookies.remove('email');
      Cookies.remove('username');
      Cookies.remove('user_id');
      Cookies.remove('role');
    }
  }, [session]);

  const contextValue = useMemo(() => ({ session, setSession, logOut }), [session]);

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
};

export const useSession = () => {
  return useContext(SessionContext);
};

export default SessionProvider;
