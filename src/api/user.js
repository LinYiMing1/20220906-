// 封装所有【用户】相关的接口[根据后端的接口文档划分]
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
