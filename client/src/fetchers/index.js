import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { refreshToken } from './auth';
import { setExpiredToken } from '../features/user';

// axios.defaults.baseURL = 'http://localhost:5000/api/v1';
axios.defaults.baseURL = '/api/v1';
axios.defaults.withCredentials = true;

let store;

export const injectStore = (_store) => {
  store = _store;
};

export const axiosWT = axios.create();

axiosWT.interceptors.request.use(
  async (config) => {
    const currentDate = new Date();
    const expiredToken = store.getState().user.exp;
    if (expiredToken * 1000 < currentDate.getTime()) {
      const accessToken = await refreshToken();
      config.headers['Authorization'] = `Bearer ${accessToken}`;
      axiosWT.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      const decoded = jwt_decode(accessToken);
      store.dispatch(setExpiredToken(decoded.exp));
    }
    return config;
  },
  (error) => Promise.reject(error)
);
