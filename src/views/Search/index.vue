<template>
 <div>
    <!-- 1. 头部搜索框 -->
    <!-- 为了解决 ios 系统点击搜索框后弹出的输入法中没有“确认”按钮的 bug，在 van-search 外面再包一层 form ，具体看 vant 组件库文档 -->
    <!--
        01 search：vant 组件内置的 【搜索】事件，点击键盘上的搜索/回车按钮后触发
        02 focus：输入框聚焦事件
          -- 聚焦后禁止渲染 SearchResult 子组件，由于 isShowSearchResult 发生变化，数据驱动视图，计算属性 componentName 会重新计算，又会根据计算属性里面的条件语句再次判断输入框是否有值，依此判定此次聚焦事件发生后，渲染哪个子组件
     -->
   <form action="/">
      <van-search
      class="search"
      v-model.trim="keywords"
      background="#3296fa"
      placeholder="请输入搜索关键词"
      show-action
      @cancel="$router.push('/')"
      @search="onSearch"
      @focus="isShowSearchResult = false"
    />
   </form>
    <!-- 2. 搜索框下方抽成三个子组件，根据搜索框的状态，显示对应子组件 -->
    <!-- 2.1 搜索历史 -->
    <!-- <search-history></search-history> -->
    <!-- 2.2 搜索建议 -->
    <!-- <search-suggestion></search-suggestion> -->
    <!-- 2.3 搜索结果 -->
    <!-- <search-result></search-result> -->
    <!-- 利用动态组件 component is 实现 -->
    <!--
        01 动态组件的传值，一次传递，多次接收，通过动态组件传的属性和自定义事件，每个子组件都有机会能够接收到
     -->
    <component
     :is="componentName"
     :keywords="keywords"
     @change-keywords="onSearch"
    >
    </component>
 </div>
</template>

<script>
// * 对于组件而言，class 和 style 属性比较特殊
// -- 当你给子组件传 class 和 style 的时候，vue 会自动帮我们把 class 和 style 合并到子组件的根节点上【一般是子组件最外层的那个 div 上】
// -- 其余的属性，子组件才会用 props 接收
// * 除了 class 类名修改样式，还可以利用属性选择器
// -- 如果不写其他限制条件，比如 div[role='button']... 或者限制在某个作用域下，表明选中全局中所有拥有这个 [role='button'] 的元素
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
// * 利用 new Set() 给数组去重
// -- const nerArr =[...new Set(arr)]

// 1. 引入子组件
import SearchHistory from './components/SearchHistory.vue'
import SearchSuggestion from './components/SearchSuggestion.vue'
import SearchResult from './components/SearchResult.vue'

// 2. 引入 vuex
import { mapState, mapMutations } from 'vuex'

export default {
  // 0. 组件命名
  name: 'Search',

  // 1. 注册子组件
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },

  // 2. 自身数据
  data() {
    return {
      keywords: '',
      isShowSearchResult: false
    }
  },

  // 3. 计算属性
  computed: {
    // 3.0 解构 vuex 的指定数据
    ...mapState(['histories']),
    // 3.1 根据某些逻辑，判断 component 标签显示哪个子组件
    componentName() {
      // 01 搜索历史：搜索框的值为空
      if (this.keywords === '') {
        return 'SearchHistory'
      }
      // 02 搜索结果：触发搜索是，显示搜索结果【点击 '确认' 或 [回车]】
      if (this.isShowSearchResult) {
        return 'SearchResult'
      }
      // 03 搜索建议：搜索框中有值，并且不渲染搜索结果
      return 'SearchSuggestion'
    }
  },

  // 4. 自身方法
  methods: {
    // 4.0 解构 vuex 上的指定方法
    ...mapMutations(['SET_HISTORIES']),
    // 4.1 搜索框触发搜索事件【点击键盘上的搜索/回车按钮后触发】
    // 1. 用户手动敲回车触发；2. 用户点击搜索建议触发
    onSearch(keywords) {
      // 01 将 触发 onSearch 事件[这个vant 事件会自动传一个参数]的 keywords 存储起来，追加到 vuex 组件中的 histories 数组的前面
      // this.SET_HISTORIES([keywords, ...this.histories])
      // 02 利用 new Set() 给数组去重
      const distinctHistories = [...new Set([keywords, ...this.histories])]
      this.SET_HISTORIES(distinctHistories)
      // 03 【搜索建议】子组件触发父组件的 onSearch 事件，将被点击的建议渲染到父组件中的 input 框中
      this.keywords = keywords
      // 04 事件被触发，跳转到【搜索结果】页面
      this.isShowSearchResult = true
    }
  }

}
</script>

<style lang="less" scoped>
/* 搜索框 取消 的样式 */
// 除了 class 类名修改样式，还可以利用属性选择器
// 如果不写其他限制条件，比如 div[role='button']... 或者限制在某个作用域下，表明选中全局中所有拥有这个 [role='button'] 的元素
.search {
  [role='button'] {
    color: #fff;
  }
}

</style>
