import Login from '../../pages/Login.vue'
import Dashboard from './Dashboard.vue'
import GroupDetail from '../../pages/Groups/GroupDetail.vue'
import GroupManage from '../../pages/Groups/GroupManage.vue'
import GroupAnalytics from '../../pages/Groups/GroupAnalytics.vue'

export default [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/groups/:groupId/manage',
    name: 'GroupManage',
    component: GroupManage,
    meta: { requiresAuth: true }
  },
  {
    path: '/groups/:groupId/analytics',
    name: 'GroupAnalytics',
    component: GroupAnalytics,
    meta: { requiresAuth: true }
  },
  {
    path: '/groups/:groupId',
    name: 'GroupDetail',
    component: GroupDetail,
    meta: { requiresAuth: true }
  }
]