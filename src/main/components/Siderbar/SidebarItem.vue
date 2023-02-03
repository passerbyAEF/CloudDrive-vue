<!-- 侧边栏 -->
<script setup>
import constant from '../../../constant';
import SidebarButtonItemVue from './SidebarButtonItem.vue';
import SidebarUserButtonItem from './SidebarUserButtonItem.vue';

const emit = defineEmits(["setView"])

</script>
<template>
    <div class="d-flex flex-column flex-shrink-0 bg-light shadow" style="width: 100px;">
        <ul class="nav flex-column mb-auto text-center">
            <li class="nav-item">
                <SidebarButtonItemVue @click="emit('setView', constant.enum.viewFlag.Main)" title="首页" />
            </li>
            <li class="nav-item">
                <SidebarButtonItemVue @click="emit('setView', constant.enum.viewFlag.Share)" title="我的分享" />
            </li>
        </ul>
        <SidebarUserButtonItem />
    </div>
</template>
<style>

</style>

