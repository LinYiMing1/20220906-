<template>
  <div class="profile">
    <!-- 1. 头部部分 -->
    <header>
      <!-- 已登录状态下的结构 -->
      <div class="login banner" v-if="isLogin">
        <van-row></van-row>
        <!-- 用户头像，用户名 -->
        <van-row>
          <van-col span="12">
            <van-row type="flex" justify="space-around" align="center" style="height: 100%">
              <van-image round width="1.5rem" height="1.5rem" :src="userInfo.photo"></van-image>
              <span class="mobile">{{ userInfo.name }}</span>
            </van-row>
          </van-col>

          <van-col span="7"></van-col>

          <van-col span="5">
            <van-row type="flex" justify="center" align="center" style="height: 100%">
            <van-button size="mini" round class="edit_btn">编辑按钮</van-button>
            </van-row>
          </van-col>
        </van-row>
        <!-- 收藏。。。 -->
        <van-row>
          <van-grid class="grid" :border="false">
             <van-grid-item  text="头条">
              <template #icon>{{ userInfo.art_count }}</template>
             </van-grid-item>

             <van-grid-item  text="粉丝">
              <template #icon>{{ userInfo.fans_count }}</template>
             </van-grid-item>

             <van-grid-item  text="关注">
              <template #icon>{{ userInfo.follow_count }}</template>
             </van-grid-item>

             <van-grid-item  text="获赞">
              <template #icon>{{ userInfo.like_count }}</template>
             </van-grid-item>
          </van-grid>
        </van-row>
      </div>
      <!-- 未登录状态下的结构 -->
      <div class="logout banner" v-else @click="$router.push('/login')">
        <!-- <img src="" alt=""> -->
        <van-image width="1.76rem" height="1.76rem" :src="mobileSrc"></van-image>
        <span class="text">登录 / 注册</span>
      </div>
    </header>

    <!-- 2. 主体部分 -->
    <main>
      <!-- 收藏/历史 -->
      <van-grid column-num="2" clickable>
        <van-grid-item text="收藏" >
          <template #icon>
            <span class="toutiao toutiao-shoucang"></span>
          </template>
        </van-grid-item>
        <van-grid-item text="历史" >
          <template #icon>
            <span class="toutiao toutiao-lishi"></span>
          </template>
        </van-grid-item>
      </van-grid>
      <!-- 消息通知/小智同学 -->
      <div class="link">
        <van-cell title="消息通知" is-link />
        <van-cell title="小智同学" is-link />
      </div>
    </main>

    <!-- 3. 底部部分 -->
    <footer>
      <!-- block: 块级元素，块级元素的宽高等同父级盒子的宽高 -->
      <van-button block style="color: red" v-if="isLogin" @click="logout">退出</van-button>
    </footer>
  </div>
</template>

<script>
// 1. 按需引入 vuex 上的内置函数
import { mapGetters } from 'vuex'

// 2. 引入自定义图片，可以用 require('路径')，也可以用 es6 语法
// - 使用默认引入的方法引入图片
import mobileSrc from '@/assets/images/mobile.png'

// 3. 引入API
import { getUserInfoAPI } from '@/api'

export default {
  // 0. 初始化后钩子函数
  created() {
    // 获取用户信息
    this.getUserInfo()
  },
  // 1. 数据
  data() {
    return {
      mobileSrc,
      userInfo: {}
    }
  },

  // 2. 计算属性
  computed: {
  // 2.1 调用 vuex 的函数，传参，得到一个对象，解构
    ...mapGetters(['isLogin'])
  },

  // 3. 方法
  methods: {
    // 3.1 用户点击退出按钮，退出登录
    async logout() {
      await this.$dialog.confirm({
        title: '黑马头条',
        message: '是否确认退出该账号'
      })
      this.$store.commit('SET_TOKEN', {})
    },

    // 3.2 获取用户信息
    async getUserInfo () {
      try {
        if (!this.isLogin) return

        const { data } = await getUserInfoAPI()
        this.userInfo = data.data
      } catch (error) {
        // - axios 错误：给用户提示
        // - JS 导致的：给程序员提示
        if (error.response && error.response.status === 401) {
          this.$toast.fail('用户认证失败，请重新登陆')
        } else {
          throw error
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.profile {
  height: 100vh;
  background-color: #f5f7f9;

  .banner {
  width: 100%;
  height: 5.33333rem;
  background: url('../../../assets/images/banner.png') no-repeat 0 0 / cover;
}

.logout {
  display: flex;
  // 转换主轴
  flex-direction: column;
  // 主轴居中
  justify-content: center;
  // 副轴居中
  align-items: center;

  .text {
    font-size: 35px;
    color: #fff;
    margin-top: 10px
  }
}

.login {
  display: flex;
  flex-direction: column;

// 子代选择器
  > .van-row {
    flex: 1;

  }

  .van-col {
      height: 100%;
  }

  .mobile {
    font-size: 30px;
    color: #fff;
  }

  .edit_btn {
       width: 1.6rem;
       height: 0.42667rem;
       color: #666;
  }

  // van-grid
  :deep(.grid) {
    color: #fff;

    .van-grid-item__content {
      font-size: 30px;
      background-color: inherit;
    }

    .van-grid-item__text {
      color: #fff;
    }
  }
}

.link {
      margin: 10px 0;
    }

    .toutiao {
      font-size: 40px;
    }

    .toutiao-shoucang {
      color: red;
    }

    .toutiao-lishi {
      color: orange;
    }
}

</style>
