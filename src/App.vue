<script setup>
import HeaderItem from './components/Header/HeaderItem.vue'
import SidebarItem from './components/Siderbar/SidebarItem.vue' 
import ListMenuItem from './components/ListMenu/ListMenuItem.vue'
</script>

<template>
  <HeaderItem style="z-index: 2;"/>
  <div class="d-flex" style="height: calc(100% - 50px) ;">
    <SidebarItem style="z-index: 1;"/>
    <div class="d-flex">
      <ListMenuItem/>
    </div>
  </div>
</template>

<style scoped>
</style>
