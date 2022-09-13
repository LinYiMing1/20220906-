<template>
  <div class="article">
    <!--
      van-pull-refresh 实现下拉刷新加载下一页
     -->
     <van-pull-refresh v-model="refreshLoading" @refresh="getNextPageArticle">
       <!--
      van-list 实现滚动条下滑请求下一页：
      01 load：滚动条与底部小于 offset 的时候触发 load 事件
      02 offset：offset 默认值是300
      03 immediate-check：初渲染的时候是否执行 load 事件，默认值是 true
      04 v-model="loading" 解决高触发问题，防抖
        -- loading 为 true 的时候，load 事件不会被触发
        -- loading 为 false 的时候，load 事件会触发
        -- loading 会在 load 事件执行后，被 van-list 组件自动设置为 true，所以想要加载下一次事件，请求结束后，需要手动更改 loading 为 false
      05 finished：Boolean
        -- finished 为 true 的时候，load 事件不会被触发
        -- finished 为 false 的时候，load 事件会被触发
      06 error.sync：Boolean
        -- 如果 error 为 true，可以显示错误文本提示
     -->
       <van-list
           @load="getNextPageArticle"
           offset="100"
           :immediate-check="false"
           v-model="loading"
           :finished="finished"
           finished-text="没有更多文章了哟~~~~~"
           :error.sync="error"
           error-text="请求失败，请刷新重试哟~~~~~"
          >

            <!-- 文章详情内容有多种的结构，所以分装一个子组件 -->
            <article-item v-for="item in articles" :key="item.art_id" :article="item"></article-item>

       </van-list>
     </van-pull-refresh>

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
      articles: [],
      preTimestamp: '',
      loading: false,
      finished: false,
      error: false,
      refreshLoading: false
    }
  },
  // 4. 自身方法
  methods: {
    // 4.1 发送 axios 请求第一页的文章
    async getFirstPageArticle() {
      try {
        const { data } = await getArticlesAPI(this.id, +new Date())
        // console.log(data)
        this.articles = data.data.results
        this.preTimestamp = data.data.pre_timestamp
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
    },

    // 4.2 页面滚动到距离底部 100px，触发请求下一页事件
    async getNextPageArticle() {
      try {
        // 00 手动设置错误，测试效果
        // if (Math.random() < 0.5) {
        //   throw new Error()
        // }
        // 01 发送请求
        const { data } = await getArticlesAPI(this.id, this.preTimestamp)
        // 02 请求结束后根据后端返回的 pre_timestamp 是否为 null 来判断，此次请求得来的数据是否是数据库中最后的数据，如果是，将 van-list 的 finished 属性值改为 true，不允许下一次 load 事件的触发
        if (!data.data.pre_timestamp) {
          this.finished = true
        }
        // 03 追加数据，push 数组的每一项，所以要先解构
        // - 需要先判断是下拉刷新还是滚动条下滑，来决定数据追加在数组的前面还是后面
        // - 滚动条下滑的时候，van-list 的 load 事件会自动将 loading 改为 true。
        // - 下拉刷新的时候，van-pull-refresh 的 refresh 事件会自动将 refreshLoading 改为 true
        if (this.loading) {
          this.articles.push(...data.data.results)
        } else {
          this.articles.unshift(...data.data.results)
        }

        // 04 更新时间戳
        this.preTimestamp = data.data.pre_timestamp
        // // 05 手动更改 loading 值
        // this.loading = false
      } catch (error) {
        // 05 如果监测到错误，手动将 error 改为 true
        this.error = true
      } finally {
        // 06 无论此次请求成功还是失败，都要手动将被更改为 true 的 loading 值改为 false，方便开启下一次 load 或 refresh 事件
        // // 如果此次请求失败，直接跳到 error 语句中，不执行 try 语句，所以 loading 没有手动改为 false，会无法开启下一次请求
        this.loading = false
        this.refreshLoading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
/* 让一个盒子拥有自己的滚动条 */
// - 1. 定高 2. overflow: auto/scroll/overlay
.article {
  height: calc(100vh - 92px - 83px - 100px);
  overflow: auto;;

  // & 符号代表这个元素的父级元素
  // :: 伪元素
  // -- .article::after {...} === &::after {...}
  // -- ::-webkit-scrollbar：滚动槽
  // -- ::-webkit-scrollbar-thumb：滚动的滑块
  &::-webkit-scrollbar {
    width: 10px;
    background-color: transparent; // 移动端本身的默认值就是 transparent，但 pc 端会有别的样式
  }

  &::-webkit-scrollbar-thumb {
    background-color: #3296fa;
    border-radius: 10px;
  }
}

</style>
