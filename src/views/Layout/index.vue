<template>
  <div>
    <!-- 二级路由展示区 -->
    <router-view></router-view>
    <!-- 底部导航 -->
    <!-- route：路由模式，拿 item 的 to 属性和当前路由的 path 对比，如果一样的话，就高亮[可以删掉 active 了] -->
    <van-tabbar  class="tabbar" route>
      <van-tabbar-item to="/ ">
        <template #icon>
          <span class="toutiao toutiao-shouye"></span>
          <span class="text">首页</span>
        </template>
      </van-tabbar-item >
      <van-tabbar-item to="/video">
        <template #icon>
          <span class="toutiao toutiao-shipin"></span>
          <span class="text">视频</span>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/qa">
        <template #icon>
          <span class="toutiao toutiao-wenda"></span>
          <span class="text">问答</span>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/profile">
        <template #icon>
          <span class="toutiao toutiao-wode"></span>
          <span class="text">{{isLogin ? '我的' : '未登录'}}</span>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
// 1. 按需引入 vuex 上的内置函数
import { mapGetters } from 'vuex'
export default {
  data() {
    return {

    }
  },
  // 2. 计算属性
  computed: {
  // 2.1 调用 vuex 的函数，传参，得到一个对象，解构
    ...mapGetters(['isLogin'])
  }
}
</script>

<style lang="less" scoped>
.tabbar {
    :deep(.van-tabbar-item__icon){
        height: 100%;
        // 开启 flex 布局
        display: flex;
        // 转换主轴
        flex-direction: column;
        // 水平居中【原垂直居中】
        align-items: center;
        justify-content: space-evenly;
    }

    .toutiao {
        font-size: 40px;;
    }

    .text {
        font-size: 30px;
    }
}

</style>
