<script setup>
import HeaderItem from './components/Header/HeaderItem.vue'
import SidebarItem from './components/Siderbar/SidebarItem.vue'
import ListMenuItem from './components/ListMenu/ListMenuItem.vue'
import MainViewItem from './components/MainView/MainViewItem.vue'
import { ref } from 'vue';

const mainView = ref()
const headerView = ref()

function uploadOK() {
  mainView.value.refresh()
}
function upload(rootid, file) {
  headerView.value.uploadfile(rootid, file)
}
</script>

<template>
  <HeaderItem ref="headerView" @uploadTaskOK="uploadOK()" style="z-index: 2;" />
  <div class="d-flex" style="height: calc(100% - 36px) ; width: 100%;">
    <SidebarItem style="z-index: 1;" />
    <ListMenuItem />
    <MainViewItem @newUpload="upload" ref="mainView" />
  </div>
</template>

<style scoped>

</style>
