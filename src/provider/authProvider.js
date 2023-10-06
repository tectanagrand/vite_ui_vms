import axios from 'axios';
import { useContext, createContext, useState, useEffect, useMemo } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [jwttoken, setJWTToken_] = useState(localStorage.getItem('token'));
  const setJWTToken = (newToken) => {
    setJWTToken_(newToken);
  };
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [jwttoken]);

  const contextValue = useMemo(() => ({ jwttoken, setJWTToken }), [jwttoken]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthProvider);
};

export default AuthProvider;
