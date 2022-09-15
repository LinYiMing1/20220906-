<template>
  <div class="result">
    <van-list
    @load="getResults"
    v-model="loading"
    :finished="finished"
    finished-text="宝子，没有数据了"
    :error.sync="error"
    error-text="宝子，别放弃，再试一次吧"
    >
      <van-cell
        v-for="item in results"
        :key="item.art_id"
        :title="item.title"
        @click="$router.push({
          path: '/detail',
          query: { articleId: item.art_id }
         })"
      >
      </van-cell>
    </van-list>
  </div>
</template>

<script>
// 1. 引入 API
import { getResultsAPI } from '@/api'
export default {
  name: 'SearchResult',

  // 0. 接收父组件的传值
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  // 1. 初始化后钩子函数
  // 2. 自身数据
  data() {
    return {
      loading: false,
      finished: false,
      error: false,
      page: 1,
      perPage: 10,
      results: []
    }
  },
  // 3. 自身方法
  methods: {
    // 3.1 发送请求，获取【搜索结果】
    async getResults() {
      try {
        // 00 手动设置错误，调试
        /*  if (Math.random() < 0.8) {
          throw new Error()
        } */
        // 01 发送请求，并传参
        const { data } = await getResultsAPI(this.page++, this.perPage, this.keywords)
        const results = data.data.results
        // console.log(data)

        if (results.length === 0) {
        // 02 如果后端已经没有数据可以返回了，将 finished 改为 true，禁止再次触发 load 事件，并且显示 finished-text 提示文本
          this.finished = true
        }

        // 03 保存数据
        // this.results.push([...data.data.results])
        this.results = [...this.results, ...results]
      } catch (error) {
        // 04 如果出错，显示 error-text 文本
        this.error = true
      } finally {
        // 05 关闭 loading【无论成功还是失败，都要关闭 loading】
        this.loading = false
      }
    }
  }
  // 4. 计算属性
  // 5. 监听数据

}
</script>

<style lang="less" scoped>
.result {
  height: calc(100vh - 108px);
  // overflow: auto;
  // overflow: scroll;
  overflow: overlay;

}

</style>
