/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { LoadingPage } from './';

import { login } from '../features/user';
import { setRegion } from '../features/region';
import { toggleSidenav } from '../features/tailwind';

import { axiosWT } from '../fetchers';
import { refreshToken } from '../fetchers/auth';
import { getAllRegion } from '../fetchers/region';

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.user.full_name);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        try {
          if (window.innerWidth >= 1024) {
            dispatch(toggleSidenav(true));
          }
            const accessToken = await refreshToken();
            const decoded = jwt_decode(accessToken);
            axiosWT.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            const { data } = await getAllRegion({ sort: 'name' });
            dispatch(setRegion(data.map((reg) => ({ value: reg._id, label: reg.name }))));
            dispatch(login(decoded));
            // dispatch(login({full_name: 'Muhammad Akhyar'}));
        } catch (error) {
          console.log(error);
          navigate('/login', { replace: true, state: { form: location } });
        }
      }
    };

    checkAuth();
  }, [user]);

  if (!user) return <LoadingPage />;

  return children;
};

export default PrivateRoute;
