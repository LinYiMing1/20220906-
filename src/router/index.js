import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入登录
// import Login from '@/views/Login'
// SPA 单页面：一次性加载所有的页面
// - 缺点：首屏加载慢
// - 解决方式：路由懒加载
// -- 使用到了某个路由页面，再去请求它

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login')

  }
]

const router = new VueRouter({
  routes
})

export default router
