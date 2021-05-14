// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import vueMoment from 'vue-moment';
import {store} from './store';

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;


Vue.use(Element);
Vue.use(vueMoment);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

export function requireAuth(to, from, next) {
  axios({ 
    url: `http://localhost:3000/session`,
    method: 'get',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: "same-origin"    
  }).then(res => {
      console.log("requireAuth res.data: " + JSON.stringify(res.data))
      if(res.data.auth){
        console.log("requireAuth if")
        return next();
      }
      else{
        console.log("requireAuth else")
        alert("로그인해주세요!")
        next('/login');
      }
  }).catch((ex) => {
      console.log("ERROR!!!: ", ex)
  })
}

