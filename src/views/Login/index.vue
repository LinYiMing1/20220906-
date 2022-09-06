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
    <van-form @submit="onSubmit" class="form">
     <van-field
    v-model="mobile"
    name="mobile"
    placeholder="请输入手机号"
    :rules="[
     { required: true, message: '请填写手机号' },
     {
      pattern:/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
      message:'手机格式错误'
     }
    ]"
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
    :rules="[
     { required: true, message: '请输入验证码' },
     { pattern: /[0-9]{6}/, message:'验证码格式错误'}
    ]"
     >
      <!-- 利用具名插槽，渲染字体图标 -->
     <template #label>
        <span class="toutiao toutiao-yanzhengma"></span>
     </template>
      </van-field>
     <div style="margin: 16px;">
       <van-button block type="info" native-type="submit">登录</van-button>
     </div>
   </van-form>
</div>
</template>

<script>
export default {
  data () {
    return {
      mobile: '',
      code: ''
    }
  },
  methods: {
    onSubmit (values) {
      console.log('submit', values)
    }
  }
}
</script>

<style lang="less" scoped>
// scoped 的样式只能作用于当前组件，所以直接通过 vant 组件的类名修改样式，不生效
// vue-cli 提供了语法：:deep() 深度选择器【注意：vue 的语法，写纯 css 不生效】
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
}

</style>
