<template>
  <div>
    <!-- 文章详情内容有多种的结构，所以分装一个子组件 -->
    <article-item v-for="item in articles" :key="item.art_id" :article="item"></article-item>

  </div>
</template>

<script>
// 获取时间戳的方法
// - +new Date()
// - Date.now()
// - new Date.valueof()

// 1. 引入 API
import { getArticlesAPI } from '@/api'

// 2. 引入子组件 （文章详情内容有多种的结构，所以分装一个子组件）
import ArticleItem from './ArticleItem.vue'

export default {
  name: 'ArticleList',

  // 0. 注册子组件
  components: {
    ArticleItem
  },

  // 1. 接收父组件 Home 的传值
  props: {
    // 01 导航的 id
    id: [String, Number]
  },

  // 2. 初始化后钩子函数
  created() {
    this.getFirstPageArticle()
  },

  // 3. 自身数据
  data() {
    return {
      articles: []
    }
  },
  // 4. 自身方法
  methods: {
    // 4.1 发送 axios 请求第一页的文章
    async getFirstPageArticle() {
      try {
        const { data } = await getArticlesAPI(this.id, +new Date())
        console.log(data)
        this.articles = data.data.results
      } catch (error) {
        // - js 错误，直接上抛；400 上抛中文；507 原封不动上抛
        const status = error.response?.status
        if (!error.response || status === 507) {
          throw error
        } else {
          if (status === 400) {
            throw new Error(error.response.data.message)
          }
        }
      }
    }
  }
}
</script>

<style>

</style>
