import Vue from 'vue'
import Router from 'vue-router'
import SignUp from '@/components/SignUp'
import LogIn from '@/components/LogIn'
import Main from '@/components/Main'
import EnrollTask from '@/components/EnrollTask'
import ModifyTask from '@/components/ModifyTask'
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
      component: LogIn,
      // 로그인이 되어있으면 바로 메인페이지로 가도록 
      beforeEnter: auth.isLoggedIn
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      beforeEnter: auth.requireAuth
    },
    {
      path: '/enrolltask',
      name: 'enrollTask',
      component: EnrollTask,
      beforeEnter: auth.requireAuth
    },
    {
      path: '/showdetail/:taskNum',
      name: 'showDetail',
      component: ShowDetail,
      beforeEnter: auth.requireAuth
    },
    {
      path: '/modifytask/:taskNum',
      name: 'modifyTask',
      component: ModifyTask,
      beforeEnter: auth.requireAuth
    },
  ]
})
