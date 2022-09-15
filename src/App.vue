<template>
  <div>
    <!-- 1. 实现路由之间跳转的动画效果 -->
    <!-- <transition></transition> 是 vue 原生的标签，具体可以查看文档 -->
    <transition name="van-slide-left" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.box1 {
  width: 2rem;
  height: 2rem;
  background-color: gold;
}

</style>
