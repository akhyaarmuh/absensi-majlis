import {
  Register,
  Login,
  ForgotPassword,
  Dashboard,
  Present,
  Region,
  Member,
  Event,
  User,
  Setting,
} from './pages';

export const routes = [
  {
    title: 'auth pages',
    layout: 'auth',
    pages: [
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'event/:id/pdf-preview',
        element: <Event.PDFPreview />,
      },
    ],
  },
  {
    title: 'dashboard pages',
    layout: 'dashboard',
    pages: [
      {
        path: '/',
        element: <Dashboard />,
        auth: true,
      },

      {
        path: 'region',
        element: <Region.List />,
        auth: true,
      },
      {
        path: 'region/create',
        element: <Region.Form type="create" />,
        auth: true,
      },
      {
        path: 'region/:id/update',
        element: <Region.Form type="update" />,
        auth: true,
      },

      {
        path: 'member',
        element: <Member.List />,
        auth: true,
      },
      {
        path: 'member/create',
        element: <Member.Form type="create" />,
        auth: true,
      },
      {
        path: 'member/:id/update',
        element: <Member.Form type="update" />,
        auth: true,
      },
      {
        path: 'member/:id/detail',
        element: <Member.Detail />,
        auth: true,
      },
      {
        path: 'member/:id/upload-image',
        element: <Member.UploadImage />,
        auth: true,
      },

      {
        path: 'event',
        element: <Event.List />,
        auth: true,
      },
      {
        path: 'event/create',
        element: <Event.Form type="create" />,
        auth: true,
      },
      {
        path: 'event/:id/update',
        element: <Event.Form type="update" />,
        auth: true,
      },
      {
        path: 'event/:id/create-present',
        element: <Present.Create />,
        auth: true,
      },
      {
        path: 'event/:id/detail',
        element: <Event.Detail />,
        auth: true,
      },

      {
        path: 'user',
        element: <User.List />,
        auth: true,
      },

      {
        path: 'user-setting',
        element: <Setting.User />,
        auth: true,
      },
      {
        path: 'restore',
        element: <Setting.Restore />,
        auth: true,
      },
    ],
  },
];

export default routes;
