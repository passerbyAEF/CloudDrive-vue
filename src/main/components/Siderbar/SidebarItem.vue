<!-- 侧边栏 -->
<script setup>
import SidebarButtonItemVue from './SidebarButtonItem.vue';
import SidebarUserButtonItem from './SidebarUserButtonItem.vue';
</script>
<template>
    <div class="d-flex flex-column flex-shrink-0 bg-light shadow" style="width: 100px;">
        <ul class="nav flex-column mb-auto text-center">
            <li class="nav-item">
                <SidebarButtonItemVue title="首页"/>
            </li>
            <li class="nav-item">
                <SidebarButtonItemVue title="分享的文件"/>
            </li>
        </ul>
        <SidebarUserButtonItem />
    </div>
</template>
<style>
</style>

