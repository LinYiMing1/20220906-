import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 1. 组件想要声明一个变量，放到 vuex 中 --- state
// - 存：vuex 声明的变量，放到 status 中
// - 取：this.$store.status.count

// 2.1 vuex 修改数据 --- mutations
// - mutations：函数
// - 自产自销原则：vuex 自己的数据在 vuex 自己内部修改
// - 规范：函数的命名采用大驼峰
// - 参数：
// --- state：数据【固定参数名，不可改动】
// --- payload[载荷]：触发 mutations 时传的参数【自定义参数，可以自定义名字】

// 2.2 组件触发 vuex 中 mutations 中的方法
// - this.$store.commit('mutations 函数名')

// 3.1 vuex 的计算属性 --- getters --> computed
// - 参数：
// --- state：数据【固定参数名，不可改动】

// 3.2 组件触发 vuex 中getters 中的属性
// - this.$store.getters.方法名

// 4. 将 $store.state... 这种形式的数据在组件中简写
// - 第一步：手动将数据写在组件的计算属性 computed 中
// --- computed:{
// count(){
// return this.$store.state.count
// }
// }
// 【但是如果 state 中的数据过多，手动引入效率过低】
// - 第二步：利用 vuex 内置的 mapState() 函数，这个函数可以接收一个数组形式的参数，数组元素是变量名字符串，函数的返回值是一个对象，对象中包含所有根据参数中的变量名查找到的同名函数，例如：{count(){},num(){}...}
// - mapState --> 将 vuex 里面的 state 映射到组件中的 computed 中
// --- 组件引入 mapState 函数，函数的返回值是一个对象
// --- 参数：['映射的属性]
// --- 在组件中的 computed 结构 mapState() 函数返回的对象

// 5. 同理 mapState() mapGetters()

export default new Vuex.Store({
  state: {
    count: 0
  },
  getters: {
    bigNum(state) {
      return state.count * 10
    }
  },
  mutations: {
    SET_COUNT(state, num) {
      state.count += num
    }
  }
})
