import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
import welcome from '@/components/welcome'
import users from '@/components/user/users'
import rights from '@/components/power/rights'
import roles from '@/components/roles/roles'
import categories from '@/components/categories'
import params from '@/components/params'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{ path: '/', redirect: '/login' },
    { path: '/login', component: login },
    {
      path: '/home',
      component: home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: welcome },
        { path: '/users', component: users },
        { path: '/rights', component: rights },
        { path: '/roles', component: roles },
        { path: '/categories', component: categories },
        { path: '/params', component: params }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenstr = window.sessionStorage.getItem('token')
  if (!tokenstr) return next('/login')
  next()
})

export default router
