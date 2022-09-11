<template>
  <div>
    <!-- 1. 搜索框 -->
    <van-nav-bar class="nav_bar">
      <template #title>
        <van-button icon="search" size="small" round block>搜索</van-button>
      </template>
    </van-nav-bar>
    <!-- 2. 频道及文章展示 -->
    <!-- 2.1 点击切换导航 -->
    <!--
      01 swipeable：在内容区，左右滑动切换
     -->
    <van-tabs v-model="active" swipeable>
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
      <!-- 2.2 文章详情 -->
      <!-- 内容太多，封装成 ArticleList 子组件 -->
      <article-list :id="item.id"></article-list>
      </van-tab>
      <span class="toutiao toutiao-gengduo"></span>
    </van-tabs>
  </div>
</template>

<script>
// * ??【空值合并操作符】，和 || 效果一样哒~
// * ?.【可选链操作符】 if (error.response?.status===400){...} es11语法，如果 ? 前面是 undefined，就不会继续执行，并且会抛出 undefined 值

// 1. 引入 API
import { getChannelAPI } from '@/api'

// 2. 引入子组件 ArticleList
import ArticleList from './components/ArticleList.vue'
export default {
  // 0.0 注册子组件
  components: {
    ArticleList
  },

  // 0. 初始化后钩子函数
  created() {
    this.getChannel()
  },

  // 1. 数据
  data() {
    return {
      active: 0,
      channels: []
    }
  },

  // 2. 方法
  methods: {
    // 2.1 获取频道
    async getChannel() {
      try {
        const { data } = await getChannelAPI()
        // console.log(data)
        this.channels = data.data.channels
      } catch (error) {
        if (!error.response) {
          throw error
        } else {
          const status = error.response.status
          // * ??【空值合并操作符】，和 || 效果一样哒~
          // * ?.【可选链操作符】 if (error.response?.status===400){...} es11语法，如果 ? 前面是 undefined，就不会继续执行，并且会抛出 undefined 值
          status === 507 && this.$toast.fail('请刷新')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>

/* 头部搜索样式 */
.nav_bar {
  background-color: #3296fa;

  :deep(.van-nav-bar__title) {
    // inherit 继承
    // unset 不设置
    max-width: unset;
  }

  .van-button--default {
    background-color: #5babfa;
    border: 0;
    color: #fff;
    font-size:  30px;
  }

  .van-icon {
    color: #fff;
  }

  .van-button--block {
    width: 7.4rem;
  }
}

/* tabs导航条样式 */
:deep(.van-tabs__wrap) {
  padding-right: 66px;

  .van-tabs__nav {
    padding-left: 0;
    padding-right: 0;

    /* tab标签 */
    .van-tab {
      border: 1px solid #eee;
      width: 200px;
      height: 82px;
    }

    /* tab标签下划线 */
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 40px;
    }
  }
}

/* 字体图标 */
.toutiao-gengduo {
  position: absolute;
  top: 0;
  right: 0;
  width: 66px;
  height: 82px;
  font-size: 40px;
  line-height: 82px;
  text-align: center;
  opacity: 0.6;
  border-bottom: 1px solid #eee;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 1px;
    background-image: url('~@/assets/images/gradient-gray-line.png');
  }
}

</style>
