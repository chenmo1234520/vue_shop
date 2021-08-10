import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
import welcome from '@/components/welcome'
import users from '@/components/user/users'
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
        { path: '/users', component: users }
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
