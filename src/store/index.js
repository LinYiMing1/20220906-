import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 登录请求成功后后端返回的的 token
    tokenObj: {}
  },
  getters: {},
  mutations: {
    // 在组件中调用这个方法，存储【修改】state 中的数据
    SET_TOKEN(state, token) {
      state.tokenObj = token
    }
  }
})
