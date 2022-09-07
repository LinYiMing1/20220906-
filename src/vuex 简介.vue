<template>
  <div>
  <!-- <router-view></router-view> -->
  <h1>{{count}}</h1>
  <h1>count 的10倍：{{bigNum}}</h1>
  <button @click="SET_COUNT(10)">点击count + 1</button>
  </div>
</template>

<script>
// mapState --> 将 vuex 里面的 state 映射到组件中的 computed 中
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  methods: {
    // increment () {
    // // 触发 vuex 中 mutations 的某个方法
    //   this.$store.commit('SET_COUNT', 10)
    // }
    ...mapMutations(['SET_COUNT'])
  },
  computed: {
    ...mapState(['count']),
    ...mapGetters(['bigNum'])
  }
}
</script>

<style scoped>
.box1 {
  width: 2rem;
  height: 2rem;
  background-color: gold;
}

</style>
