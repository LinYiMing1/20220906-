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
      // -- 实现如果标签样式是 vant 组件值为 37.5，如果是基于2倍图[700px]的自定义的标签值为 75
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
