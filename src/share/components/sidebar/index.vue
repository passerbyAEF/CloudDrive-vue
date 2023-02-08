<!-- 侧边栏 -->
<script setup>
import constant from '../../../constant';
import SidebarUserButtonItem from 'Main@/components/Siderbar/SidebarUserButtonItem.vue';

const emit = defineEmits(["setView"])

</script>
<template>
    <div class="d-flex flex-column flex-shrink-0 bg-light shadow" style="width: 100px;">
        <ul class="nav flex-column mb-auto text-center">
        </ul>
        <SidebarUserButtonItem />
    </div>
</template>
<style>

</style>

