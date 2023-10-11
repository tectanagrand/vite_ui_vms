import axios from 'axios';
import { useContext, createContext, useState, useEffect, useMemo } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [jwttoken, setJWTToken_] = useState(Cookies.get('jwttoken'));
  const setJWTToken = (newToken) => {
    setJWTToken_(newToken);
  };
  useEffect(() => {
    console.log(jwttoken);
    if (jwttoken) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + jwttoken;
      Cookies.set('jwttoken', jwttoken);
    } else {
      Cookies.remove('jwttoken');
    }
  }, [jwttoken]);

  const contextValue = useMemo(() => ({ jwttoken, setJWTToken }), [jwttoken]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
