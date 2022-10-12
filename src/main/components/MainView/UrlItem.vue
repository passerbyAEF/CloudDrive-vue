<!-- 路径显示&跳转 -->
<script setup>
import { ref } from 'vue';

const emit = defineEmits(["gotoFolder"])
let urlobj = ref([])
let lastobj = ref()
const setRootFolderId = function (rootId) {
    urlobj.value.push({ name: "全部文件", folderId: rootId })
    lastobj.value = urlobj.value[urlobj.value.length - 1].folderId
}

const addFolder = function (e) {
    urlobj.value.push(e)
    lastobj.value = urlobj.value[urlobj.value.length - 1].folderId
}

function itemClick(e) {
    let folderId = e.target.getAttribute("folderId")
    let i = urlobj.value.findIndex((value, index) => {
        return value.folderId == folderId
    })
    urlobj.value = urlobj.value.slice(0, i + 1)
    lastobj.value = urlobj.value[urlobj.value.length - 1].folderId
    emit("gotoFolder", folderId)
}

function goUp() {
    lastobj.value = urlobj.value[urlobj.value.length - 2].folderId
    let folderId = urlobj.value[urlobj.value.length - 2].folderId
    urlobj.value = urlobj.value.slice(0, urlobj.value.length - 1)
    emit("gotoFolder", folderId)
}
defineExpose({ setRootFolderId, addFolder })
</script>
<template>
    <div class="p-3 ">
        <span class="text-primary none-decoration clicktext" v-if="urlobj.length>1" @mouseup="goUp">
            返回上一级
        </span>
        <span class="text-black-50" v-if="urlobj.length>1">|</span>
        <span v-for="item in urlobj">
            <span class="none-decoration"
                :class="{clicktext:urlobj.length>1,'text-primary' : urlobj.length>1}" @mouseup="itemClick"
                :folderId="item.folderId">
                {{ item.name }}
            </span>
            <span class="text-black-50" v-if="item.folderId != lastobj">></span>
        </span>
    </div>
</template>
<style>
.none-decoration {
    text-decoration: none
}

.clicktext {
    cursor: pointer
}
</style>