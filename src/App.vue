<template>
  <div id="app">
    <el-menu :default-active="activePath" mode="horizontal" @select="handleSelect">
      <el-menu-item index="/">Home</el-menu-item>
      <el-menu-item index="/about">About</el-menu-item>
    </el-menu>
    
    <!-- 路由视图 -->
    <router-view />
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const router = useRouter();
    const activePath = ref(router.currentRoute.value.path);

    const handleSelect = (index) => {
      router.push(index);
      activePath.value = index;
    };

    return {
      handleSelect,
      activePath
    };
  }
};
</script>

<style>
/* 添加一些简单的样式 */
</style>
