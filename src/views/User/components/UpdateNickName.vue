<template>
  <div>
    <!-- 1. 头部 -->
    <van-nav-bar
      title="更新昵称"
      left-text="取消"
      right-text="保存"
      left-arrow
      @click-left="$parent.$parent.isShowNickName = false"
      @click-right="updateNickname"
    />

    <!-- 2. 主体 -->
    <van-cell  >
       <template #title >
         <van-field
         class="textarea"
         type="textarea"
         rows="2"
         autosize
         maxlength="11"
         show-word-limit
         @change="getValue"
         :value="nickname"
         />
       </template>
    </van-cell>
    <!-- 3. 底部 -->
    <!-- <van-cell title=" " value="11/11" /> -->
  </div>
</template>

<script>
// 1. 引入 API
import { updateUserAPI } from '@/api'
export default {
  name: 'UpdateNickName',
  props: {
    nickname: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      value: ''
    }
  },

  methods: {
    // .1 通过 textarea 的 change 事件，实时获取表单中的最新值
    getValue(e) {
      this.value = e.target.value
    },
    // .2 点击保存，发送请求，更新昵称
    async updateNickname() {
      try {
        // 01 发送请求
        if (this.value) {
          await updateUserAPI({ name: this.value })
          // console.log(data)
        }
        // 02 将最新的昵称传给父组件
        this.$emit('update:nickname', this.value)
        // 03 关闭弹出层
        this.$parent.$parent.isShowNickName = false
        // 04
        this.$toast.success('修改昵称成功')
      } catch (error) {
        console.log(error)
      }
    }
  }

}
</script>

<style lang="less" scoped>
.textarea {
  width: 100%;
  line-height: 24px;
  text-align: left;
  border: 0;
  background-color: transparent;
}

</style>
