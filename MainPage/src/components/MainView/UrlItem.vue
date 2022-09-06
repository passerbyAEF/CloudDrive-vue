<!-- 路径显示&跳转 -->
<script setup>
import { ref } from 'vue';

const url = defineProps(['FolderUrl'])
let enableFlag = ref(true)
let urlobj = ref([])
if (url != undefined) {
    enableFlag = false
    let str = url.FolderUrl.split('/')
    str.forEach(e => {
        let o = { name: e, url: e };
        if (e === '.')
            o.name = "全部文件"
        urlobj.value.push(o)
    });
}
let lastobj = ref(urlobj.value[urlobj.value.length-1].name)
</script>
<template>
    <div v-if="enableFlag">
        <p>123</p>
    </div>
    <div class="p-3 " v-if="!enableFlag">
        <span class="text-primary none-decoration clicktext">
            返回上一级
        </span>
        <span class="text-black-50">|</span>
        <span v-for="item in urlobj" >
            <span class="text-primary none-decoration clicktext">
                {{  item.name  }}
            </span>
            <span class="text-black-50" v-if="item.name != lastobj">></span>
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