// 下载-->引入-->配置-->暴露-->使用
import axios from 'axios'
// axios.defaults.baseURL = 'http://toutiao.itheima.net'
// axios.defaults.timeout = 5000

// 考虑到不一定所有的页面都用同一个基础地址，用同一个 axios 发请求耦合性过高
// 利用 axios.create() 方法克隆一个新的 axios，一个基础地址的接口用一个新的 axios，不影响原始的 axios
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 5000
})
export default request
