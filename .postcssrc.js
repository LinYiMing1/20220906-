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

// 配置 post-css 这个预处理器的插件
// 所有的 post-css 的插件都是一个函数

// 引入 postcss-pxtorem 插件
const pxToRem = require('postcss-pxtorem')
module.exports = {
  // 插件
  plugins: [
    // 1.  postcss-pxtorem 插件
    // - 调用并传参
    pxToRem({
      // 01 根节点字体大小 -- 所有 vant 组件库的视口宽度都默认按照 375px 设置的
      //   rootValue: 37.5, // 相当于 1rem = 37.5px
      // -- 实现如果标签样式是 vant 组件值为 37.5，如果是基于2倍图[750px]的自定义的标签值为 75
      // -- 本质上实现视口差异化，毕竟不是所有的组件的宽度都默认是 375px
      rootValue: ({ file }) => {
        // rootValue 这个函数会自动收到所有的 css 文件作为参数
        // file 是当前编译的 css 的文件路径
        // 正则匹配当前文件有 vant 这个字段，就返回 37.5
        return /vant/.test(file) ? 37.5 : 75
      },
      // 02 所有属性都转成 rem
      propList: ['*']
    })
  ]
}
