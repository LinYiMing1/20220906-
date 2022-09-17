<template>
  <div class="update-avatar">
    <img :src="photo" alt="" ref="image"/>

    <div class="toolbar">
      <span>取消</span>
      <span @click="confirm">完成</span>
    </div>
  </div>
</template>

<script>
// * 用户更新头像
// --01 利用 cropperjs 裁剪图片
// --02 将裁剪后的图片传给后端
// --03 在头像页面向后端发送请求，获取最新头像
// ---- 如果接口文档需要我们携带的参数类型是表单类型，那我们必须传表单类型的 content type
// ---- 原生的表单提交有一个问题，只支持 get/post 的 method 提交方式
// ------1）通过 new FormData() 原生 JS 方法模拟表单数据
// ------2) const fm = new FormData() ==> fm.append('photo', File 对象/参数)

// 1. 引入 cropperjs
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

// 3. 引入 API
import { uploadPhotoAPI } from '@/api'

export default {
  name: 'UpdateAvatar',
  props: {
    photo: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // .1 随 UpdateAvatar 组件的弹出，初始化遮罩选择框
    init() {
      this.myCropper = new Cropper(this.$refs.image, {
        viewMode: 1,
        dragMode: 'none',
        initialAspectRatio: 1,
        aspectRatio: 1,
        preview: '.before',
        background: false,
        autoCropArea: 0.6,
        zoomOnWheel: false
      })
    },
    // .2 confirm()
    confirm() {
      this.myCropper.getCroppedCanvas().toBlob(async (blob) => {
        try {
          // 01 发送请求，将用户选中的图片作为最新头像更新到后端数据库中，并获取到后端返回的新头像的 src 路径
          const { data } = await uploadPhotoAPI(blob)
          // console.log(data)
          // 02 通过自定义事件 'update:avatar'，将新头像的 src 路径传给父组件
          this.$emit('update:avatar', data.data.photo)
          // 03 关闭弹层 <van-popup/>
          this.$parent.$parent.isShowPhoto = false
          // 04
          this.$toast.success('修改头像成功')
        } catch (error) {}
      })
    }

  }
}
</script>

<style scoped lang="less">
.update-avatar {
  background: #000;
  width: 100%;
  height: 100%;
  img {
    width: 100%;
    height: 65%;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    z-index: 9999;
  }
  .toolbar {
    position: fixed;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 28px;
    color: #fff;
    padding: 0 15px;
    box-sizing: border-box;
  }
}
</style>
