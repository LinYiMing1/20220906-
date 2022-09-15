<template>
  <div>
    <van-cell
     v-for="(item,index) in hightLightSuggestions"
     :key="index"
     icon="search"
     @click="$emit('change-keywords',suggestions[index])"
    >
    <template #title>
      <span v-html="item"></span>
    </template>
    </van-cell>
  </div>
</template>

<script>
// * 浏览器内置的 API
// -- Boolean(数据) ==> 返回一个布尔值
// * v-html 能够识别含有 html 标签的数据，可以用它渲染数据
// * [].map(()=>{})
// -- 返回一个长度和原数组一致的新数组
// -- ()=>{} 返回的结果就是 .map() 方法那一项的返回值
// * 动态正则【动态正则能识别变量，字面量正则不能】
// -- new RegExp(字符串，修饰符'ig') //'ig' 忽略大小写
// ---- regular[规律的]  expression[表达式]
// -- const a = 'apple'
// -- const reg = new RegExp(a,'ig) // /apple/
// * string.replace('被替换的字符','替换成的字符)
// * string.replace(正则，函数)
// -- 这个回调函数接收一个 match 参数，match 是匹配到的字符，函数的返回值会作为替换的结果

// 1. 引入 API
import { getSuggestionsAPI } from '@/api'

// 2. 利用第三方方法合集 lodash 中的方法防抖
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  // 0. 接收父组件的传值
  props: {
    keywords: {
      type: String,
      required: true
    }
  },

  // 1. 自身数据
  data() {
    return {
      suggestions: []
    }
  },

  // 2. 自身方法
  methods: {
    // 2.1 获取搜索建议【不能依靠 created 调用这个请求函数，因为它只在初始化后调用一次，后面 keywords 再变化，不会再调用】
    // -- 利用 debounce() 防抖
    getSuggestions: debounce(async function() {
      try {
        const { data } = await getSuggestionsAPI(this.keywords)
        // console.log(data)
        // 过滤掉【空】的结果
        // this.suggestions = data.data.options.filter(item => Boolean(item))
        // 简写：合并同类项
        // Boolean() 本身就是一个函数，所以可以作为 [].filter() 方法的回调函数， [].filter() 方法会自动给 Boolean() 函数传参，Boolean() 函数执行结果会返回布尔值，刚好 [].filter() 也需要布尔值来判断是否过滤
        this.suggestions = data.data.options.filter(Boolean)
      } catch (error) {
        if (error.response) {
          this.$toast.fail('获取搜索建议失败，请重试~')
        } else {
          throw error
        }
      }
    }, 300)
  },

  // 3. 数据监听
  watch: {
    // 3.1 监听 keywords 这个数据，每次数据变化，都调用一次 getSuggestions() 函数
    keywords: {
      // 01 初始化立即监听一次，否则第一次输入某个值，watch 监听不到 keywords 的变化，因为先有第一次的数据，才动态渲染出子组件 SearchSuggestion，子组件里面的 keywords 一开始就有值，当然没办法监听到数据的变化，从而调用 getSuggestions() 函数
      // 02 注意：基本数据类型一般不需要开启深度监听
      immediate: true,
      handler: 'getSuggestions'
    }
  },

  // 4. 计算属性
  computed: {
    hightLightSuggestions() {
      const reg = new RegExp(this.keywords, 'ig')
      return this.suggestions.map((str) => {
        return str.replace(reg, (match) => `<span style="color:red">${match}</span>`)
      })
    }
  }
}
</script>

<style>

</style>
