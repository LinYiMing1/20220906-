<template>
  <div>
  <van-button type="primary">主要按钮</van-button>
  <van-button type="primary">主要按钮</van-button>
  <van-button type="primary">主要按钮</van-button>
  <div class="box1"></div>
  </div>
</template>

<script>
// rem 适配【1rem = 设备根节点的大小，不同的设备设置不同的根节点大小】
// 1. 让 1rem 动态跟随设备视口的大小而变化
// --01 利用第三方包 flexible 实现 1rem = 1/10视口宽
// --02 npm i amfe-flexible -D
// --03 在 main.js 中引入包
// 2. 所有样式使用 rem 为单位
// --01 利用一个 css 预处理器[和 less 性质一样] post-css【vue 已经帮我们下好了，但是原生的 webpack 需要额外引用】
// --02 post-css 自己能做的事很少，还要额外下载插件
// ---- 比如可以下载 postcss-pxtorem
// ---- 告诉 postcss 这个预处理器，我们要使用 pxtorem 这个插件 --> 创建 .postcssrc.js 文件

export default {

}
</script>

<style scoped>
.box1 {
  width: 2rem;
  height: 2rem;
  background-color: gold;
}

</style>
