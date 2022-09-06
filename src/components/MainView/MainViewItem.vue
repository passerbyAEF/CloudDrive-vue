<!-- 主显示页 -->
<script setup>
import UrlItem from './UrlItem.vue';
import FileListItem from './FileList/FileListItem.vue';
import { ref } from 'vue';

const selectnum = ref(0);

function setnum(val){
    selectnum.value=val
}

</script>
<template>
    <div class="p-3">
        <div>
            <button type="button" v-if="selectnum==0" class="btn btn-primary">上传</button>
            <div v-if="selectnum==0" class="btn-group ps-3" role="group" aria-label="Basic outlined example">
                <button type="button" class="btn btn-outline-primary">新建文件夹</button>
                <button type="button" class="btn btn-outline-primary">下载</button>
            </div>
            <div v-if="selectnum!=0" class="btn-group ps-3" role="group" aria-label="Basic outlined example">
                <button type="button" class="btn btn-outline-primary">下载</button>
                <button type="button" class="btn btn-outline-primary">删除</button>
                <button v-if="selectnum==1" type="button" class="btn btn-outline-primary">重命名</button>
                <button type="button" class="btn btn-outline-primary">复制</button>
                <button type="button" class="btn btn-outline-primary">移动</button>
            </div>
        </div>
        <UrlItem class="pt-3 pb-3"  FolderUrl="./123"/>
        <FileListItem @selectnum="setnum" class="p-3" />
    </div>
</template>
<style>
</style>