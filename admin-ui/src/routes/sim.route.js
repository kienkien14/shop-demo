import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import { PATH_AFTER_LOGIN } from '../config';
import RoleBasedGuard from '../guards/RoleBasedGuard';
import AuthGuard from '../guards/AuthGuard';


// ----------------------------------------------------------------------
const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed',
            }),
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

const CategoryList = Loadable(lazy(() => import('../pages/sim/category/CategoryList')));
const CategoryCreate = Loadable(lazy(() => import('../pages/sim/category/CategoryCreate')));
const ProductList = Loadable(lazy(() => import('../pages/sim/product/ProductList')));
const ProductCreate = Loadable(lazy(() => import('../pages/sim/product/ProductCreate')));
const BillList = Loadable(lazy(() => import('../pages/sim/bill/BillList')));
const BillCreate = Loadable(lazy(() => import('../pages/sim/bill/BillCreate')));
const BillDetail = Loadable(lazy(() => import('../pages/sim/bill/BillDetail')));
const BillItemList = Loadable(lazy(() => import('../pages/sim/billItem/BillItemList')));
const BillItemCreate = Loadable(lazy(() => import('../pages/sim/billItem/BillItemCreate')));
const UserList = Loadable(lazy(() => import('../pages/sim/user/UserList')));
const MediaUserCreate = Loadable(lazy(() => import('../pages/sim/user/MediaUserCreate')));
const UserEdit = Loadable(lazy(() => import('../pages/sim/user/UserEdit')));


const simsRoute = {
  path: 'sims',
  element: (
    <RoleBasedGuard >
      <Outlet />
    </RoleBasedGuard>
  ),
  children: [
    { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },

    { path: 'categories', element: <CategoryList /> },
    { path: 'category/new', element: <CategoryCreate /> },
    { path: 'category/:id/view', element: <CategoryCreate /> },
    { path: 'category/:id/edit', element: <CategoryCreate /> },

    { path: 'products', element: <ProductList /> },
    { path: 'product/new', element: <ProductCreate /> },
    { path: 'product/:id/view', element: <ProductCreate /> },
    { path: 'product/:id/edit', element: <ProductCreate /> },

    { path: 'bills', element: <BillList /> },
    { path: 'bill/new', element: <BillCreate /> },
    { path: 'bill/:id/detail', element: <BillDetail /> },
    { path: 'bill/:id/view', element: <BillCreate /> },
    { path: 'bill/:id/edit', element: <BillCreate /> },

    { path: 'billItems', element: <BillItemList /> },
    { path: 'billItem/new', element: <BillItemCreate /> },
    { path: 'billItem/:id/view', element: <BillItemCreate /> },
    { path: 'billItem/:id/edit', element: <BillItemCreate /> },

    // user
    { path: 'users', element: <UserList /> },
    { path: 'user/new', element: <MediaUserCreate /> },
    { path: 'user/:id/view', element: <UserEdit /> },
    { path: 'user/:id/edit/info', element: <UserEdit /> },
    // { path: 'user/:id/edit/role', element: <UserEdit /> },
    // { path: 'user/:id/edit/email', element: <UserEdit /> },
    // { path: 'user/:id/edit/phone', element: <UserEdit /> },
    // { path: 'user/:id/edit/status', element: <UserEdit /> },
    // { path: 'user/:id/edit/uid', element: <UserEdit /> },

    // { path: 'user/:id/reset/password', element: <UserEdit /> },

    // cache
    // { path: 'caches', element: <MediaCacheList /> },s
    // { path: 'cache/:name/keys', element: <MediaCacheKeyList /> },
  ],
};

export default simsRoute;
