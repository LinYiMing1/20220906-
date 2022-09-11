// 下载-->引入-->配置-->暴露-->使用
import axios from 'axios'
// axios.defaults.baseURL = 'http://toutiao.itheima.net'
// axios.defaults.timeout = 5000
// 引入 vuex
import store from '@/store'

// 1. 克隆、配置
// 考虑到不一定所有的页面都用同一个基础地址，用同一个 axios 发请求耦合性过高
// 利用 axios.create() 方法克隆一个新的 axios，一个基础地址的接口用一个新的 axios，不影响原始的 axios
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 5000
})

// 2. 请求拦截器：请求做某些事情
// 实现需求：当用户登录，所有的请求都带上 Authorization 【axios 请求的参数可以多写，后端可以不接受不需要的参数，但不可以少写】
request.interceptors.request.use(
  // 01
  // - 每一次发送请求都会执行这个函数【监测到某个 axios 请求发送后才执行这个函数】
  // - 在发送请求之前做些什么
  // -
  function (config) {
    // config 是每一次请求的配置对象，可以通过条件语句，给某些符合条件的请求统一配置一些参数或设置
    const {
      getters: { isLogin },
      state: { tokenObj }
    } = store

    if (isLogin) {
      config.headers.Authorization = `Bearer ${tokenObj.token}`
    }

    // 【重新配置完配置对象，一定要 return 出去】
    return config
  },
  // 02
  function (error) {
    console.log(error)
  }
)

export default request
