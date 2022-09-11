// 封装所有【用户】相关的接口[根据后端的接口文档划分]
// 1.1 引入
import request from '@/utils/request'

/**
 * 登录 post 请求
 * @param {Number} mobile  手机号
 * @param {Number} code  验证码
 * @returns Promise
 */
export const login = (mobile, code) => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}

/**
 * 发送验证码 get 请求
 * @param {String} mobile  手机号
 * @returns Promise
 */
export const sendCodeAPI = (mobile) => {
  return request({
    url: `/v1_0/sms/codes/${mobile}`
  })
}

// 实现需求：当用户登录，所有的请求都带上 Authorization 【axios 请求的参数可以多写，后端可以不接受不需要的参数，但不可以少写】

/**
 * 获取用户信息，发送 get 请求
 * @returns Promise
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/v1_0/user'
    // headers: {
    //   Authorization: `Bearer ${store.state.tokenObj.token}`
    // }
  })
}
