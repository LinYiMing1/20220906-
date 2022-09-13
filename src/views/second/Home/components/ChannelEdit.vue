<template>
  <div class="channel_edit">
    <!-- 1. 我的频道 -->
      <!-- 1.1 标题 -->
      <van-cell title="我的频道">
        <van-button
        class="btn"
        round
        size="mini"
        style="color: red; border-color: red"
        @click="isEdit = !isEdit"
        >
         {{isEdit ? '完成' : '编辑'}}
        </van-button>
      </van-cell>
      <!-- 1.2 我的频道 -->
      <div class="my-pannel">
        <van-grid gutter="10" :border="false">
          <van-grid-item
          :class="{active : item.name === '推荐'}"
          v-for="(item , index) in myChannels"
          :key="item.id"
          :text="item.name"
          :icon="isEdit && item.name !== '推荐' ? 'cross' : ''"
          @click="dealMyChannels(item, index)"
          >
          <!-- 具名插槽传 x 图标 -->
           <!-- <template #icon>
            <van-icon name="cross"></van-icon>
           </template> -->
          </van-grid-item>
        </van-grid>
      </div>

    <!-- 2. 推荐频道 -->
      <!-- 2.1 标题 -->
      <van-cell title="推荐频道"></van-cell>
      <!-- 2.2 推荐频道 -->
      <div class="recommend-pannel">
        <van-grid gutter="10" :border="false">
          <van-grid-item
          v-for="item in recommendChannels"
          :key="item.id"
          :text="item.name"
          icon="plus"
          >
          </van-grid-item>
        </van-grid>
      </div>
  </div>
</template>

<script>
// * 注意：postcss 插件无法把行内样式的 px-->rem

// 1. 引入 API
import { getAllChannelAPI } from '@/api'

// 2. 推荐频道 = 所有频道 - 我的频道

export default {
  // 0. 命名组件
  name: 'ChannelEdit',
  // 1. 接收父组件的传值
  props: {
    myChannels: Array
  },
  // 2. 初始化后钩子函数
  created() {
    this.getAllChannels()
  },
  // 3. 自身数据
  data() {
    return {
      isEdit: false, // 人为设置变量，记录编辑按钮是否处于【编辑】状态
      allChannels: []
    }
  },
  // 4. 自身方法
  methods: {
    // 4.1 发送 axios 请求，获取【所有频道】
    async getAllChannels() {
      const { data } = await getAllChannelAPI()
      console.log(data)
      this.allChannels = data.data.channels
    },

    // 4.2 点击【我的频道】事件
    dealMyChannels({ name }, index) {
      // 01 如果是编辑状态并且 item.name !== '推荐'，将该 item 从 myChannels 数组中删除
      if (this.isEdit && name !== '推荐') {
        console.log('删除频道', name)
      } else {
        // 1. 关闭弹窗
        // 2. 切换频道
        // -- 利用 index 和父组件中的 active 的对应关系，使被点击的 item 在父组件中高亮
        this.$emit('change-active', index)
      }
    }
  },
  // 5. 计算属性
  computed: {
    // 5.1 推荐频道 = 所有频道 - 我的频道
    recommendChannels() {
      // Array.filter() 方法的返回值：数组
      // [1,2,3].find(item =>item === 2) 返回值是 2，如果没有符合条件的，返回值是 undefined
      return this.allChannels.filter((allChannelsItem) => {
        // 在【我的频道】数组中查看有没有此时遍历到的 [allChannelsItem] 项，如果有，此次遍历返回 false，如果没有，返回 true
        // - find() 方法的返回值是符合的数组元素 myChannelsItem 或者 undefined
        // - 用 ! 将返回值 target 变为 boolean 值；! 刚好还可以按照我们想要输出的结果取反
        const target = this.myChannels.find((myChannelsItem) => {
          return myChannelsItem.id === allChannelsItem.id
        })

        return !target
      })
    }
  }
}
</script>

<style lang="less" scoped>
.channel_edit {
  padding: 92px 0 0;

 /* 编辑按钮样式 */
 // 注意：postcss 插件无法把行内样式的 px-->rem
  :deep(.btn) {
    width: 100px;
    font-size: 25px;
  }

  :deep(.van-grid-item__content) {
  background-color: #f4f5f6;
  }

  /* 我的频道 */
  .my-pannel {
    // 编辑按钮居中
    .van-cell__value {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

  /*  关闭按钮样式 */
  :deep(.van-grid-item__content) {
      position: relative;

      .van-grid-item__content {
        position: absolute;
        top: 0;
        right: 0;
      }
    }

  /* 我的频道高亮 */
  :deep(.active) {
    .van-grid-item__text {
      color: red;
    }
  }
  }

  :deep(.van-icon-cross) {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 25px;
    transform: translate(20%, -35%);
    border: 0.02667rem solid #000;
    border-radius: 50%;
    text-align: center;
    line-height: 0.32rem;
  }

  /*  推荐频道 */
  .recommend-pannel {
    // 推荐频道加号样式
    :deep(.van-grid-item__content) {
      flex-direction: row;

      .van-grid-item__icon {
        font-size: 0.5rem;
      }

      .van-grid-item__text {
        margin-top: 0;
      }
    }
  }
}

</style>
