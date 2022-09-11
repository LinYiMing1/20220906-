// 封装所有关于【新闻】的 API
import request from '@/utils/request'

/**
 * 获取文章 发送 get 请求
 * @param {String | Number} id 频道的 id
 * @param {Number} timestamp 请求新的推荐数据传当前的时间戳，请求下一次数据，传上一次请求的返回值作为此次的时间戳
 */
export const getArticlesAPI = (id, timestamp) => {
  return request({
    url: '/v1_0/articles',
    params: {
      channel_id: id,
      timestamp
    }
  })
}
