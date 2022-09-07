<template>
<div>
    <!-- 1. 头部导航 -->
    <van-nav-bar title="登录" class="nav-bar"/>
    <!-- 2. 底部表单 -->
    <!-- van-field：输入框、text、password、文本..... -->
    <!-- v-model：用户输入的值 -->
    <!-- name：用于标识表单项 -->
    <!-- rules：表单的校验规则，是一个数组[]，里面有很多对象{}
        01 required：是否是必填字段，值是布尔值
        02 message：校验不通过时的提示信息
        03 pattern：匹配的正则
        04 trigger：规则触发的时机 onBlur[默认失焦时触发]/onChange
    -->
    <van-form @submit="onSubmit" class="form" ref="form">
     <van-field
    v-model="mobile"
    name="mobile"
    placeholder="请输入手机号"
    :rules="mobileRules"
     >
     <!-- 利用具名插槽，渲染字体图标 -->
     <template #label>
        <span class="toutiao toutiao-shouji"></span>
     </template>
     </van-field>

     <van-field
    v-model="code"
    name="code"
    placeholder="请输入验证码"
    :rules="codeRules"
     >
      <!-- 利用具名插槽，渲染字体图标 -->
     <template #label>
        <span class="toutiao toutiao-yanzhengma"></span>
     </template>
     <!-- 利用具名插槽，实现发送验证码按钮 -->
     <template #button>
      <van-button round  size="small"  class="btn" v-if="isShowCodeBtn" @click="sendCode" native-type="button">获取验证码</van-button>
      <!-- 点击验证码按钮，出现互斥的倒计时结构 -->
     <van-count-down v-else :time="60 * 1000" format="ss秒" @finish="isShowCodeBtn = true"/>
     </template>
      </van-field>
     <div style="margin: 16px;">
       <van-button block type="info" native-type="submit">登录</van-button>
     </div>
   </van-form>
</div>
</template>

<script>
// 1. 引入校验规则
import { mobileRules, codeRules } from './rule'

// 2. 引入 API
import { login as loginAPI, sendCodeAPI } from '@/api'

// 3. token 身份证 标识用户
// --01 应用场景：标识用户是否登陆了
// --02 存储方式：
// ---- 本地存储：本地存储是非响应式的，不灵活，不能判断某个页面是否应该显示某些信息
// ---- 储存在 vuex 中【**】
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      mobile: '',
      code: '',
      mobileRules,
      codeRules,
      isShowCodeBtn: true
    }
  },
  methods: {
    // 0. 解构 vuex 的方法
    ...mapMutations(['SET_TOKEN']),
    // 1. 触发提交事件，发送 post 请求
    async onSubmit (values) {
      // 【vant 封装的 submit 事件只有在表单验证通过后才会触发】
      // console.log('submit', values)
      // this.$toast
      // 01 显示加载
      this.loading()
      // 02 登录请求
      try {
        const { data } = await loginAPI(this.mobile, this.code)
        // console.log(data)
        // ! 将 token 存进 vuex 中
        this.SET_TOKEN(data.data)
        // console.log(this.$store.state.tokenObj)
        // ! 通过路由管理器 $router.push() 跳转页面
        this.$router.push('/profile')
        // - 03 登录成功提示：success
        this.$toast.success('登录成功')
      } catch (error) {
        // - 04 登录失败提示：fail
        // 细分登录失败的原因
        // error：错误对象
        // -- 1）原生 JS 错误，浏览器抛出
        // -- 2）Promise.reject() 执行的结果，axios 封装的 error 对象
        // ---- error.response.data 后端实际返回的数据
        // ---- error.response.status 后端实际返回的状态码
        if (error.response && error.response.status === 400) {
          this.$toast.fail(error.response.data.message)
        } else {
          // JS 错误;后端返回 507[服务器错误]
          console.dir(error) // 在控制台打印错误对象提示开发者
          this.$toast.clear() // 手动清除提示，主要是 loading
        }
      }
    },

    // 2. 单独封装 loading 显示加载函数
    loading () {
      // - 01 加载提示：loading
      // -- message：提示文案
      // -- forbidClick：禁止点击
      // -- duration：展示的时长，单位是毫秒，如果值为 0，提示不会消失
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
    },

    // 3. 点击获取验证码，发送获取验证码的请求
    async sendCode () {
      // 01 验证用户是否输入了有效的手机号
      //  利用 vant 组件实例上的 validate() 方法，该方法返回的是一个 promise 实例
      // -- 给 from 绑定 ref，利用 vue 自带的 $refs.form 找到 ref="form" 的 dom 元素
      // -- $refs.form.validate()，这个元素是 vant 组件，组件上内置了 validate() 方法
      await this.$refs.form.validate('mobile')
      // 02 显示加载
      this.loading()
      // 03 验证成功，发送请求
      try {
        await sendCodeAPI(this.mobile)
        // 04 显示倒计时
        this.isShowCodeBtn = false
        // 05 成功发送
        this.$toast.success('发送验证码成功')
      } catch (error) {
        // 06 细分发送验证失败的原因
        if (error.response && (error.response.status === 429 || error.response.status === 404)) {
          // - axios 的错误
          this.$toast.fail(error.response.data.message)
        } else {
          // - 浏览器错误或后端端口错误
          // console.dir(error)
          // - 手动关闭 loading
          this.$toast.clear()
          // - 抛出错误
          throw error
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
// scoped 的样式只能作用于当前组件，所以直接通过 vant 组件的类名修改样式，不生效
// vue-cli 提供了语法：:deep() 深度选择器【注意：vue 的语法，只能写在 .vue 文件中，写纯 css 不生效】
.nav-bar {
    background-color: #3296fa;

 :deep(.van-nav-bar__title) {
     color:#fff;
 }
}

:deep(.form) {
 .van-cell__title {
    flex:1;
 }
 .van-cell__value {
    flex:20;
 }
 .toutiao {
    font-size: 40px;
 }
 .btn {
  height: 0.64rem;
  background-color: #eee;
  color:#a58594;
 }
}

</style>
