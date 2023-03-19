import { Routes, Route } from 'react-router-dom';

import routes from './routes';
import { LayoutDashboard, PrivateRoute } from './components';

const App = () => {
  return (
    <Routes>
      {/* dashboard */}
      <Route exact path="/" element={<LayoutDashboard />}>
        {routes.map(
          ({ layout, pages }) =>
            layout === 'dashboard' &&
            pages.map(({ path, element, auth }) => {
              if (auth)
                return (
                  <Route path={path} element={<PrivateRoute>{element}</PrivateRoute>} />
                );

              return <Route path={path} element={element} />;
            })
        )}
      </Route>

      {/* route auth */}
      {routes.map(
        ({ layout, pages }) =>
          layout === 'auth' &&
          pages.map(({ path, element }) => <Route path={path} element={element} />)
      )}

      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default App;
