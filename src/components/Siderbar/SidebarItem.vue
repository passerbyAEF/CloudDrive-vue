<script setup>
import SidebarButtonItemVue from './SidebarButtonItem.vue';
import SidebarUserButtonItem from './SidebarUserButtonItem.vue';
</script>
<template>
    <div class="d-flex flex-column flex-shrink-0 bg-light shadow" style="width: 100px;">
        <ul class="nav flex-column mb-auto text-center">
            <li v-for="n in 5" class="nav-item">
                <SidebarButtonItemVue title="shouye"/>
            </li>
        </ul>
        <SidebarUserButtonItem />
    </div>
</template>
<style>
</style>

