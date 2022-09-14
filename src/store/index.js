import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      key: 'HEIMATOUTIAO_TOKEN',
      // storage: window.sessionStorage,
      reducer({ tokenObj, myChannels }) {
        // 函数收到的参数是 state 这个对象，可以接收参数的同时将 tokenObj 属性解构出来
        return { tokenObj, myChannels }
      }
    })
  ],
  state: {
    // 登录请求成功后后端返回的的 token
    tokenObj: {},
    myChannels: []
  },
  getters: {
    // 计算属性，用于标识用户是否登录
    isLogin(state) {
      // 需要把 state.tokenObj.token 变成布尔值输出，而不是 return 它的内容本身，所以需要两次取反，
      return !!state.tokenObj.token
    }
  },
  mutations: {
    // 1. 在组件中调用这个方法，存储【修改】state 中的数据
    SET_TOKEN(state, token) {
      // 01 将 token 存储在 vuex 中
      state.tokenObj = token
    },
    // 2. 在组件中调用这个方法，存储【修改】state 中的数据
    /**
     * 用户在未登录状态下，将用户操作后的 channels 数据持久化
     * @param {Array} channels 删除或添加后最新的 channels
     */
    SET_CHANNELS(state, channels) {
      state.myChannels = channels
    }
  }
})
