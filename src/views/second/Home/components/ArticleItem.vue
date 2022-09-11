<template>
  <div>
    <!-- 1. 没有图片的数据结构 -->
    <van-cell v-if="article.cover.type === 0" :title="article.title" :label="label" >
    </van-cell>

    <!-- 2. 有一张图片的数据结构 -->
    <van-cell v-if="article.cover.type === 1" :title="article.title" >
           <van-image
           width="100"
           height="100"
           :src="article.cover.images[0]"/>
    </van-cell>

    <!-- 3. 有三张图片的结构 -->
    <van-cell  v-else  :title="article.title">
        <template #label>
            <van-image
            v-for="(item,index) in article.cover.images"
            :key="index"
            width="100"
            height="100"
            :src="item"/>
        </template>
    </van-cell>

  </div>
</template>

<script>
export default {
  name: 'ArticleItem',

  props: {
    article: {
      type: Object,
      default: () => ({}) // 默认值是一个空对象
    }
  },
  computed: {
    label() {
      /* eslint-disable */ 
      const { aut_name, comm_count, pubdate } = this.article
      return `${aut_name} ${comm_count}评论 ${pubdate}`
    }
  }

}
</script>

<style>

</style>
