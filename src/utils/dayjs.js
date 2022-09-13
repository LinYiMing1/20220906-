// 封装所有关于第三方包 dayjs 的配置
// dayjs 默认的语言是英文，可以按需根据文档更改全局语言配置

// 1. 下载 --> 引入 dayjs
import dayjs from 'dayjs'

// 2.1 根据需求查看文档，引入 dayjs 中下载好的第三方插件【不同的需求可能需要不同的插件，具体看文档】
const relativeTime = require('dayjs/plugin/relativeTime')
// 2.1 引入中文包
require('dayjs/locale/zh-cn')

// 3.1 继承
dayjs.extend(relativeTime)
// 3.2 配置中文
dayjs.locale('zh-cn')

// 4. 暴露
export default dayjs
