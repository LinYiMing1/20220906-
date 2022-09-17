<template>
  <div>
    <!-- 1. 时间选择器 -->
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="updateBirthday"
      @cancel="$parent.$parent.isShowBirthday = false"
    />
  </div>
</template>

<script>
// 1. 引入 API
import { updateUserAPI } from '@/api'
export default {
  name: 'UpdateBirthday',
  props: {
    birthday: {
      type: String,
      required: true
    }
  },
  created() {
    this.currentDate = new Date(...this.birthday.split('-').map(Number))
  },
  data() {
    return {
      minDate: new Date(1950, 0, 1),
      maxDate: new Date(2022, 12, 31),
      currentDate: new Date(2022, 12, 17)
    }
  },
  methods: {
    // .1 封装转换时间格式
    formatDate(time) {
      // 01 时间戳
      const date = new Date(time)
      const y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d

      return y + '-' + m + '-' + d
    },
    // .2 点击确认，发送请求，更新生日
    async updateBirthday (value) {
      // console.log(this.formatDate(value))
      const birthday = this.formatDate(value)
      try {
        // 01
        await updateUserAPI({ birthday })
        // 02
        this.$emit('update:birthday', birthday)
        // 03
        this.$parent.$parent.isShowBirthday = false
        // 04
        this.$toast.success('修改生日成功')
      } catch (error) {}
    }
  }
}
</script>

<style>

</style>
