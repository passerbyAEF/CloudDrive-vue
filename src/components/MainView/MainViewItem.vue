<!-- 主显示页 -->
<script setup>
import UrlItem from './UrlItem.vue';
import FileListItem from '../FileList/FileListItem.vue';

</script>
<template>
    <div class="p-3">
        <div>
            <button type="button" class="btn btn-primary">上传</button>
            <div class="btn-group ps-3" role="group" aria-label="Basic outlined example">
                <button type="button" class="btn btn-outline-primary">新建文件夹</button>
                <button type="button" class="btn btn-outline-primary">下载</button>
            </div>
        </div>
        <UrlItem class="pt-3 pb-3"  FolderUrl="./123"/>
        <FileListItem class="p-3" />
    </div>
</template>
<style>
</style>