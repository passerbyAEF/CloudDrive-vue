<script setup>
import SidebarButtonItemVue from './SidebarButtonItem.vue';
import SidebarUserButtonItem from './SidebarUserButtonItem.vue';
</script>
<template>
    <div class="d-flex flex-column flex-shrink-0 bg-light shadow" style="width: 4.5rem;">
        <ul class="nav nav-pills nav-flush flex-column mb-auto text-center">
            <li class="nav-item">
                <SidebarButtonItemVue />
            </li>
            <li>
                <SidebarButtonItemVue />
            </li>
            <li>
                <SidebarButtonItemVue />
            </li>
            <li>
                <SidebarButtonItemVue />
            </li>
            <li>
                <SidebarButtonItemVue />
            </li>
        </ul>
        <SidebarUserButtonItem />
    </div>
</template>
<style>
</style>

