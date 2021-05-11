import Vue from 'vue'
import Router from 'vue-router'
import SignUp from '@/components/SignUp'
import LogIn from '@/components/LogIn'
import Main from '@/components/Main'
import EnrollTask from '@/components/EnrollTask'
import ShowDetail from '@/components/ShowDetail'
const auth = require('../main.js') 

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/signup',
      name: 'signUp',
      component: SignUp
    },
    {
      path: '/login',
      name: 'logIn',
      component: LogIn
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      beforeEnter: auth.requireAuth
      // beforeEnter: requireAuth()
    },
    {
      path: '/enrolltask',
      name: 'enrollTask',
      component: EnrollTask,
      beforeEnter: auth.requireAuth
      // beforeEnter: requireAuth()
    },
    {
      path: '/showdetail/:taskNum',
      // path: '/showdetail',
      name: 'showDetail',
      component: ShowDetail,
      beforeEnter: auth.requireAuth
      // beforeEnter: requireAuth()
    },
  ]
})
