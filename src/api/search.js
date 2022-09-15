// 封装所有【搜索】相关的 API
import request from '@/utils/request'

/**
 * 获取搜索建议 发送 get 请求
 * @param {Number|String} q 搜索的关键词
 * @returns Promise
 */
export const getSuggestionsAPI = (q) => {
  return request({
    url: 'v1_0/suggestion',
    params: {
      q
    }
  })
}

/**
 * 获取搜索结果
 * @param {Number} page 分页页数，非必填，默认值是1
 * @param {Number} per_page 一页数据的数量
 * @param {String} q 搜索的关键词
 * @returns Promise
 */
export const getResultsAPI = (/* eslint-disable-line*/ page, per_page, q) => {
  return request({
    url: 'v1_0/search',
    params: {
      page,
      per_page,
      q
    }
  })
}
