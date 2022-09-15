<template>
  <div>
    <!-- 1. 搜索框 -->
    <van-nav-bar class="nav_bar">
      <template #title>
        <van-button
          icon="search"
          size="small"
          round block
          @click="$router.push('/search')"
        >
        搜索
        </van-button>
      </template>
    </van-nav-bar>

    <!-- 2. 频道及文章展示 -->
    <!-- 2.1 点击切换导航 -->
    <!--
      01 swipeable：在内容区，左右滑动切换
      02 active：是 van-tab 的索引值
     -->
    <van-tabs v-model="active" swipeable>
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
      <!-- 2.2 文章详情 -->
      <!-- 内容太多，封装成 ArticleList 子组件 -->
      <article-list :id="item.id"></article-list>
      </van-tab>
      <!-- 2.3 更多，小图标 -->
      <span class="toutiao toutiao-gengduo" @click="isShow=true"></span>
    </van-tabs>

    <!-- 3. 弹出层：默认隐藏 -->
    <van-popup
    v-if="isShow"
    v-model="isShow"
    position="bottom"
    :style="{height: '100%'}"
    closeable
    close-icon-position="top-left">
      <!-- 3.1 将内容拆除成单独的 ChannelEdit 子组件 -->
      <!--
        3.2 父组件给子组件传值
          -- my-channels 和 myChannels 效果一样
        3.3 子组件通过自定义事件给父组件传值，实现 active 高亮切换效果
       -->
       <channel-edit
       :my-channels="channels"
       @change-active="[(isShow=false),(active=$event)]"
       @del-channel="delChannel"
       @add-channel="addChannel"
       ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
// * ??【空值合并操作符】，和 || 效果一样哒~
// * ?.【可选链操作符】 if (error.response?.status===400){...} es11语法，如果 ? 前面是 undefined，就不会继续执行，并且会抛出 undefined 值

// 【我的频道】在后端中其实有两套系统
// --01 用户登陆了
//   - 我的频道是用户自己的频道
//   - 数据持久化到线上的服务器
// --02 用户未登录
//   - 我的频道是默认频道信息
//   - 数据持久化到本地存储

// 1. 引入 API
import { getChannelAPI, delChannelAPI, addChannelAPI } from '@/api'

// 2. 引入子组件 ArticleList
import ArticleList from './components/ArticleList.vue'

// 3. 引入子组件 ChannelEdit
import ChannelEdit from './components/ChannelEdit.vue'

// 4. 引入 vuex
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Home',
  // 0.0 注册子组件
  components: {
    ArticleList,
    ChannelEdit
  },

  // 0. 初始化后钩子函数
  created() {
    this.initChannels()
  },

  // 1. 数据
  data() {
    return {
      active: 0,
      channels: [],
      isShow: false
    }
  },

  // 2. 方法
  methods: {
    // 0.0 解构 vuex 上的方法
    ...mapMutations(['SET_CHANNELS']),
    // 2.0 初始化请求
    initChannels() {
      // 01 判断是否登录
      if (this.isLogin) {
        // -- 如果登陆了
        // ---- 发送请求回去数据【因为登录会有 token，所以请求到的是用户自己的频道】
        this.getChannel()
      } else {
        // -- 如果未登录
        // ---- 如果本地存储有数据，直接拿本地存储中的数据
        // ---- 如果本地存储没有数据，依然要发送请求获取数据【因为未登录没有 token，所以请求到的是默认频道】
        /* this.channels = JSON.parse(localStorage.getItem('HEIMATOUTIAO_TOKEN')).myChannels */
        const myChannels = this.$store.state.myChannels
        // console.log(myChannels)
        if (myChannels.length === 0) {
          this.getChannel()
        } else {
          // this.getChannel()
          this.channels = myChannels
          // console.log(this.channels)
        }
      }
    },

    // 2.1 获取频道
    async getChannel() {
      try {
        const { data } = await getChannelAPI()
        console.log(data)
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
    },

    // 2.2 接收子组件 ChannelEdit 的传值，删除对应导航
    async delChannel(id) {
      try {
        // 00 先获取删除后的数组
        const newChannels = this.channels.filter((item) => item.id !== id)

        // 01 判断用户是否登录
        // -- 如果登录了，发送请求
        // -- 如果没登录，本地存储
        if (this.isLogin) {
          // -- 登录状态下，需要发送请求，让后端也同步删除，实现持久化
          await delChannelAPI(id)
        } else {
          // -- 未登录状态下，可以将数据同步到 vuex 中，利用 'vuex-persistedstate' 这个第三方库，将修改后的数据存在浏览器本地，实现持久化
          this.SET_CHANNELS(newChannels)
        }

        // 02 在视图层删除频道
        this.channels = newChannels

        // 03 弹出提示
        this.$toast.success('删除频道成功啦~~')
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast.fail('请登录再删除哦~~~')
        } else {
          throw error
        }
      }
    },

    // 2.2 接收子组件 ChannelEdit 的传值，添加对应导航
    async addChannel(item) {
      try {
        // 01 判断用户是否登录
        // -- 如果登录了，发送请求
        // -- 如果没登录，本地存储
        if (this.isLogin) {
          // -- 需要发送请求，让后端也同步添加，实现持久化【添加到后端数组的最后】
          await addChannelAPI(item.id, this.channels.length)
        } else {
          // -- 未登录状态下，可以将数据同步到 vuex 中，利用 'vuex-persistedstate' 这个第三方库，将修改后的数据存在浏览器本地，实现持久化
          //  -- 解构现有的 channels 数组，一项一项添加进新数组，再把要添加的 item 对象放在后面
          this.SET_CHANNELS([...this.channels, item])
        }
        // 02 在视图层添加频道
        this.channels.push(item)
        // 03 弹出提示
        this.$toast.success('添加频道成功啦~~')
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$toast.fail('请登录再添加哦~~~')
        } else {
          throw error
        }
      }
    }
  },

  // 3. 计算属性
  computed: {
    // 3.1 判断用户是否登录
    ...mapGetters(['isLogin'])
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
