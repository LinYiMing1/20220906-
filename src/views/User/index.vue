<template>
 <div>
    <!-- 1. 个人信息导航条 -->
    <van-nav-bar
      class="navbar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    >
    </van-nav-bar>
    <!-- 2. 个人信息修改 -->
    <!--
        01 弹出用户文件框，先隐藏，点击 van-cell:头像 后触发表单的点击事件
        -- hidden：隐藏表单，等同 display:none
        -- accept：规定 file 能够选择的文件类型
     -->
    <input
      ref="file"
      type="file"
      hidden
      accept=".png,.pdf,.jpg"
      @change="selectPhoto">

    <!-- 2.1 更新头像 -->
    <!-- 2.1.1 修改头像弹出层 -->
    <van-popup
      v-model="isShowPhoto"
      closeable
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!--
        01 将弹出层里面的内容抽成一个组件
        02 将用户选择的图片的 base64 码传给 UpdateAvatar 子组件
        03 v-if="isShowPhoto" 让 update-avatar 随弹出层的创建弹出，随弹出层的隐藏而销毁
        04 avatar.sync，给子组件传属性的时候加上 .sync 修饰符，会自动传过去一个 'update:avatar' 自定义事件
      -->
       <update-avatar v-if="isShowPhoto" :photo="photo" :avatar.sync="avatar"></update-avatar>
    </van-popup>

    <van-cell
      title="头像"
      is-link
      @click="$refs.file.click()"
    >
      <!-- 默认插槽右侧插入头像 -->
      <van-image
        round
        width="0.8rem"
        height="0.8rem"
        :src="avatar"
      />
    </van-cell>

    <!-- 2.2 更新昵称 -->
    <!-- 2.2.1 修改昵称弹出层 -->
    <van-popup
      v-model="isShowNickName"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <update-nick-name v-if="isShowNickName" :nickname.sync="nickname"></update-nick-name>

    </van-popup>
    <van-cell
      title="昵称"
      is-link
      :value="nickname"
      @click="isShowNickName = true"
    >
    </van-cell>

    <!-- 2.3 更新性别 -->
    <!-- 2.3.1 修改性别弹出层 -->
     <van-popup
      v-model="isShowGender"
      position="bottom"
    >
      <update-gender v-if="isShowGender" :sex.sync="sex"></update-gender>

    </van-popup>
    <van-cell
      title="性别"
      is-link
      :value="gender"
      @click="isShowGender = true"
    >
    </van-cell>

    <!-- 2.4 更新生日 -->
    <!-- 2.3.1 修改生日弹出层 -->
     <van-popup
      v-model="isShowBirthday"
      position="bottom"
    >
      <update-birthday v-if="isShowBirthday" :birthday.sync="birthday"></update-birthday>

    </van-popup>
    <van-cell
      title="生日"
      is-link
      :value="birthday"
      @click="isShowBirthday = true"
    >
    </van-cell>
 </div>
</template>

<script>
// * 弹出文件框的逻辑
// --01 手动设置 input:file 表单
// --02 隐藏表单
// --03 点击相应的 van-cell，手动触发 file 表单的点击事件
// * 更新用户头像的逻辑
// --01 手动点击 van-cell，触发 file 表单的点击事件
// --02 获取用户选择的图片
// ---- 什么时间获取：利用 file 表单的 change 事件，change 事件发生，说明 file 表单的状态发生变化
// ---- 如何获取：1）用户选择的图片被原生 file 表单保存在 input:file.value 属性上，保存的是文件的绝对路径；2）input:file.files 数组里面保存了 File 对象当做数组元素，每个 File 对象都对应这一个用户选择的文件，保存的格式是二进制
// * 如何将二进制的 File 对象转成 base64 码【原生 API】
// --01 FileReader：文件阅读器
// ---- const fr =new FileReader()
// ---- fr.readAsDataURL(File) -- 读取的过程是异步的，所以不能直接接收 readAsDataURL() 的返回值
// ---- 接收读取的结果：fr.onload=(e)=>{ e.target.result/ * base64 */} --- 当 onload() 监听到 readAsDataURL() 读取完 fr，匿名箭头函数会被调用
// * 使用第三方 cropperjs 实现图片遮罩选择的效果
// --01 下载：npm i cropperjs
// --02 引入：
// --03 使用：

// 1. 引入子组件 UpdateAvatar
import UpdateAvatar from './components/UpdateAvatar.vue'
import UpdateNickName from './components/UpdateNickName.vue'
import UpdateGender from './components/UpdateGender.vue'
import UpdateBirthday from './components/UpdateBirthday.vue'

// 2. 引入封装后的文件阅读转码函数
import { resolveToBase64 } from '@/utils'

// 3. 引入 API
import { getUserAPI } from '@/api'

export default {
  components: {
    UpdateAvatar,
    UpdateNickName,
    UpdateGender,
    UpdateBirthday
  },
  created() {
    this.getUser()
  },
  data() {
    return {
      // 头像
      isShowPhoto: false,
      avatar: '',
      photo: '',
      // 昵称
      isShowNickName: false,
      nickname: '',
      // 性别
      isShowGender: false,
      sex: '1',
      // 生日
      isShowBirthday: false,
      birthday: ''
    }
  },
  computed: {
    gender() {
      return this.sex === 1 ? '女' : '男'
    }
  },
  methods: {
    // .1 获取用户个人信息
    async getUser() {
      try {
        const { data } = await getUserAPI()
        // console.log(data)
        this.avatar = data.data.photo
        this.nickname = data.data.name ? data.data.name : data.data.mobile
        this.sex = data.data.gender
        this.birthday = data.data.birthday
      } catch (error) {}
    },

    // .2 获取用户选择的文件
    async selectPhoto() {
      // 01 获取到用户选择的图片的 File 对象
      // -- this.$refs.file.files[0] 原生JS
      const file = this.$refs.file.files[0]
      //   console.log(file)

      // 02 将二进制的 File 对象转成 img.src 可识别的属性
      // -- 第一种思路：将二进制转成 base64
      /* const fr = new FileReader()
      fr.readAsDateURL(File) // 读取成 base64 码，还能读取到别的格式 readAsText()...
      fr.onload = (e) => {
        console.log(e.target.result)
      } */
      const base64 = await resolveToBase64(file)
      // console.log(base64)

      // 03 保存到自身数据，传给 UpdateAvatar 子组件
      this.photo = base64

      // 04 打开弹窗
      this.isShowPhoto = true

      // 05 清空 file 表单的 value，让表单能检测到 change，解决用户不能连续选择同一张图片的 bug
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
    background-color: #3296fa;

    /* 导航条样式 */
    :deep(.van-nav-bar__title) {
        color: #fff !important;
    }
    :deep(.van-icon) {
        color: #fff !important;
    }
}

</style>
