import axios from 'axios';
import Cookies from 'js-cookie';

export const axiosPrivate = axios.create({
  baseURL: process.env.REACT_APP_URL_LOC,
  withCredentials: true,
});

export const axiosPrivWO = axios.create({
  baseURL: process.env.REACT_APP_URL_LOC,
  withCredentials: true,
});
