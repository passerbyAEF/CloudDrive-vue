<script setup>
import HeaderItem from './components/HeaderItem.vue'
import SidebarItem from './components/Siderbar/SidebarItem.vue' 
</script>

<template>
  <HeaderItem />
  <div class="d-flex" style="height: calc(100% - 50px) ;">
    <SidebarItem />
    <main class="">
      <p>123</p>
    </main>
  </div>
</template>

<style scoped>
</style>
