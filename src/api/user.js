// 封装所有【用户】相关的接口[根据后端的接口文档划分]
// 1.1 引入
import request from '@/utils/request'
// import { from } from 'core-js/core/array'

/**
 * 登录 post 请求
 * @param {Number} mobile  手机号
 * @param {Number} code  验证码
 * @returns Promise
 */
export const login = (mobile, code) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
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

// 编辑更新用户个人资料
/**
 * 更新用户头像
 * @param {*} file 裁剪过后的图片的 File 对象
 * @returns Promise
 */
export const uploadPhotoAPI = (file) => {
  const fm = new FormData()
  fm.append('photo', file)
  return request({
    url: 'v1_0/user/photo',
    method: 'PATCH',
    // data:表单数据，不能传对象，否则 axios 会自动将对象转化成二进制 JSON
    data: fm
  })
}

/**
 * 更新用户数据
 * @param {String} name 用户更新的昵称
 * @param {String} gender 用户更新的性别
 * @param {String} birthday 用户更新的生日
 * @returns Promise
 */
export const updateUserAPI = (data) => {
  // const obj = { name, gender, birthday }
  // const data = {}
  // for (const k in obj) {
  //   if (obj[k]) {
  //     data[k] = obj[k]
  //   }
  // }
  // console.log(data)
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data
  })
}

// 获取用户个人信息
/**
 * 获取用户个人信息
 * @returns Promise
 */
export const getUserAPI = () => {
  return request({
    url: '/v1_0/user/profile'
  })
}
