function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  page404: '/404',
  page500: '/500',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  profile: path(ROOTS_DASHBOARD, '/profile'),

  sim: {
    root: path(ROOTS_DASHBOARD, '/sims'),

    report: path(ROOTS_DASHBOARD, '/report'),

    newCategory: path(ROOTS_DASHBOARD, '/sims/category/new'),
    categories: path(ROOTS_DASHBOARD, '/sims/categories'),

    newProduct: path(ROOTS_DASHBOARD, '/sims/product/new'),
    products: path(ROOTS_DASHBOARD, '/sims/products'),

    newBill: path(ROOTS_DASHBOARD, '/sims/bill/new'),
    bills: path(ROOTS_DASHBOARD, '/sims/bills'),

    newBillItem: path(ROOTS_DASHBOARD, '/sims/billItem/new'),
    billItems: path(ROOTS_DASHBOARD, '/sims/billItems'),

    newUser: path(ROOTS_DASHBOARD, '/sims/user/new'),
    users: path(ROOTS_DASHBOARD, '/sims/users'),

    newRole: path(ROOTS_DASHBOARD, '/sims/role/new'),
    roles: path(ROOTS_DASHBOARD, '/sims/roles'),

    newSim: path(ROOTS_DASHBOARD, '/sims/sim/new'),
    sims: path(ROOTS_DASHBOARD, '/sims/sims'),

    newPostCategory: path(ROOTS_DASHBOARD, '/sims/post-category/new'),
    postCategories: path(ROOTS_DASHBOARD, '/sims/post-categories'),

    newPost: path(ROOTS_DASHBOARD, '/sims/post/new'),
    posts: path(ROOTS_DASHBOARD, '/sims/posts'),

    newTag: path(ROOTS_DASHBOARD, '/sims/tag/new'),
    tags: path(ROOTS_DASHBOARD, '/sims/tags'),

    newOperator: path(ROOTS_DASHBOARD, '/sims/operator/new'),
    operators: path(ROOTS_DASHBOARD, '/sims/operators'),

    newUserOrder: path(ROOTS_DASHBOARD, '/sims/user-order/new'),
    userOrders: path(ROOTS_DASHBOARD, '/sims/user-orders'),

    newOrder: path(ROOTS_DASHBOARD, '/sims/order/new'),
    orders: path(ROOTS_DASHBOARD, '/sims/orders'),

    newSetting: path(ROOTS_DASHBOARD, '/sims/setting/new'),

    newEmail: path(ROOTS_DASHBOARD, '/sims/email/new'),
    emails: path(ROOTS_DASHBOARD, '/sims/emails'),

    newPriceConfig: path(ROOTS_DASHBOARD, '/sims/price-config/new'),
    priceConfigs: path(ROOTS_DASHBOARD, '/sims/price-configs'),

    newProfitConfig: path(ROOTS_DASHBOARD, '/sims/profit-config/new'),
    profitConfigs: path(ROOTS_DASHBOARD, '/sims/profit-configs'),

    caches: path(ROOTS_DASHBOARD, '/sims/caches'),

    newPrivilege: path(ROOTS_DASHBOARD, '/sims/privilege/new'),
    privileges: path(ROOTS_DASHBOARD, '/sims/privileges'),

  },

  dashboard: {
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
  },
};

