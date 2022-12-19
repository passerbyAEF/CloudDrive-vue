<script setup>
import HeaderItem from './components/Header/HeaderItem.vue'
import SidebarItem from './components/Siderbar/SidebarItem.vue'
import ListMenuItem from './components/ListMenu/ListMenuItem.vue'
import MainViewItem from './components/MainView/MainViewItem.vue'
import ScreeViewItem from './components/Screen/ScreeViewItem.vue'
import RecycleViewItem from './components/Recycle/RecycleViewItem.vue'
import { nextTick, ref } from 'vue';

const mainView = ref()
const headerView = ref()
const screeView = ref()

const viewflag = ref(-1)

function uploadOK() {
  if (mainView.value != null)
    mainView.value.refresh()
  else if (screeView.value != null)
    screeView.value.refresh()
}
function upload(folderid, file) {
  headerView.value.uploadfile(folderid, file)
}

async function setScree(i) {
  viewflag.value = i
  await nextTick()
  if (i >= 0)
    screeView.value.setScree(i)
}
</script>

<template>
  <HeaderItem ref="headerView" @uploadTaskOK="uploadOK()" style="z-index: 3;" />
  <div class="d-flex" style="height: calc(100% - 36px) ; width: 100%;">
    <SidebarItem style="z-index: 2;" />
    <ListMenuItem style="z-index: 1;" @setScree="setScree" />
    <div style="width: calc(100% - 300px);">
      <MainViewItem v-if="viewflag == -1" @newUpload="upload" ref="mainView" />
      <RecycleViewItem v-else-if="viewflag == -2" />
      <ScreeViewItem v-else ref="screeView" @newUpload="upload" />
    </div>
  </div>
</template>

<style scoped>

</style>
