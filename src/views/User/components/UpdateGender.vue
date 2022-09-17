<template>
  <div>
   <!--  1. 头部
    <van-nav-bar
      title="更新性别"
      left-text="取消"
      right-text="确认"
      @click-left="$parent.$parent.isShowSex = false"
      @click-right="updateGender"
    /> -->

    <!-- 2. 主体 -->
    <van-picker
      title="更新性别"
      show-toolbar
      :columns="columns"
      :default-index="1"
      @confirm="updateGender"
      @cancel="$parent.$parent.isShowSex = false"
    />
  </div>
</template>

<script>
// 1. 引入 API
import { updateUserAPI } from '@/api'
export default {
  name: 'UpdateGender',
  props: {
    sex: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      columns: ['男', '女']
    }
  },
  methods: {
    // .1 点击确认，更新性别
    async updateGender(value, index) {
      // console.log(value)
      try {
        // 01 发送请求，更新性别数据
        const { data } = await updateUserAPI({ gender: index })
        console.log(data)
        // 02 得到返回值，给父组件传值
        this.$emit('update:sex', index)
        // 03 关闭弹窗
        this.$parent.$parent.isShowGender = false
        // 04
        this.$toast.success('修改性别成功')
      } catch (error) {

      }
    }
  }
}
</script>

<style>

</style>
