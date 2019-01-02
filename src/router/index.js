import Vue from 'vue'
import Router from 'vue-router'

// import Login from '../components/login.vue'
// @->src
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    name: 'home',
    path: '/',
    component: Home
    // redirect:{
    //   name:'login'
    // path:'/login',
    // component:Login
    // }
  },
  {
    name: 'login',
    path: '/login',
    component: Login

  }
  ]
})