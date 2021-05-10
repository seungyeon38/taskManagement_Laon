import Vue from 'vue'
import Router from 'vue-router'
import SignUp from '@/components/SignUp'
import LogIn from '@/components/LogIn'
import Main from '@/components/Main'
import EnrollTask from '@/components/EnrollTask'
import ShowDetail from '@/components/ShowDetail'

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: '/signUp',
      name: 'signUp',
      component: SignUp
    },
    {
      path: '/logIn',
      name: 'login',
      component: LogIn
    },
    {
      path: '/main',
      name: 'main',
      component: Main
    },
    {
      path: '/enrollTask',
      name: 'enrollTask',
      component: EnrollTask
    },
    {
      path: '/showDetail/:taskNum',
      name: 'showDetail',
      component: ShowDetail
    },
    
    
  
  ]
})
