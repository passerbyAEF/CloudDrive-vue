<script setup>
import HeaderItem from './components/Header/HeaderItem.vue'
import SidebarItem from './components/Siderbar/SidebarItem.vue'
import ListMenuItem from './components/ListMenu/ListMenuItem.vue'
import MainViewItem from './components/MainView/MainViewItem.vue'

</script>

<template>
  <HeaderItem style="z-index: 2;" />
  <div class="d-flex" style="height: calc(100% - 50px) ;">
    <SidebarItem style="z-index: 1;" />
    <ListMenuItem />
    <MainViewItem style="width: 100%"/>
  </div>
</template>

<style scoped>
</style>
