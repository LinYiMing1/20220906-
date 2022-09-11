import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入登录
// import Login from '@/views/Login'
// SPA 单页面：一次性加载所有的页面
// - 缺点：首屏加载慢
// - 解决方式：路由懒加载
// -- 使用到了某个路由页面，再去请求它
// - 性能优化点
// -- 路由懒加载优化首屏加载速度
// -- webpackChunkName:"魔法注释" 【对于一些小的模块，可以将他们的 chunk 名命名成同一个名字，这样用户有需求1的时候，只需要用 chunk 名发送一次请求，就能同时得到多个同名模块的内容，再次触发需求2的时候，就不需要再发送一次请求了。节约了请求次数】

Vue.use(VueRouter)

// chunk[代码块] 一个或多个模块【app.js 是一个 chunk，一个单独的 layout 也是一个 chunk】
// 懒加载的 chunk，默认的名字是模块的路径【可以在浏览器的网络请求那边查看发送请求的 chunk 名】
// /* webpackChunkName:"新名字" */

const routes = [
  {
    path: '/',
    component: () => import('@/views/Layout'),
    redirect: '/ ', // 重定向到首页
    children: [
      {
        path: '/ ',
        component: () => import('@/views/second/Home')
      },
      {
        path: '/video',
        component: () =>
          import(/* webpackChunkName: "base" */ '@/views/second/Video')
      },
      {
        path: '/qa',
        component: () =>
          import(/* webpackChunkName: "base" */ '@/views/second/QA')
      },
      {
        path: '/profile',
        component: () => import('@/views/second/My')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login')
  }
]

const router = new VueRouter({
  routes
})

export default router
