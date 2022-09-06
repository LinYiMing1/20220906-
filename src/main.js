import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入 iconfont 的 css
import '@/assets/fonts/iconfont.css'
// 引入 vant 组件
import Vant from 'vant'
import 'vant/lib/index.css'
// 引入 flexible 适配包
import 'amfe-flexible'

Vue.config.productionTip = false

Vue.use(Vant)
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
