import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

// 1. 封装本地存储；2. vuex-persistedstate[第三方插件实现数据持久化]

// 2. vuex-persistedstate -->
// --01 下载
// ---- npm i vuex-persistedstate@3.2.1
// --02 引入
// ---- import createPersistedState from 'vuex-persistedstate'
// --03 调用
// ---- plugins:[createPersistedState()] --- 直接这样写会把 state 中所有的数据都持久化，没必要
// --04 配置项：
// ---- key：默认值是 vuex，可以自定义命名本地存储的数据的 key
// ---- storage：默认值是本地存储，可以改成绘画存储
// ---- reducer：指定持久化哪些数据，是个函数，return 一个对象，这个对象作为本地存储的 value
// -------- 参数：state

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      key: 'HEIMATOUTIAO_TOKEN',
      // storage: window.sessionStorage,
      reducer({ tokenObj }) {
        // 函数收到的参数是 state 这个对象，可以接收参数的同时将 tokenObj 属性解构出来
        return tokenObj
      }
    })
  ],
  state: {
    // 登录请求成功后后端返回的的 token
    // tokenObj:
    //   JSON.parse(window.localStorage.getItem('HEIMATOUTIAO_TOKEN')) || {}
    tokenObj: {}
  },
  getters: {},
  mutations: {
    // 在组件中调用这个方法，存储【修改】state 中的数据
    SET_TOKEN(state, token) {
      // 01 将 token 存储在 vuex 中
      state.tokenObj = token
      // 02 为了避免刷新数据丢失的问题，再存一份数据到浏览器本地存储中
      // window.localStorage.setItem('HEIMATOUTIAO_TOKEN', JSON.stringify(token))
    }
  }
})
