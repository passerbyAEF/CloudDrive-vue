<script setup>
import { ref } from 'vue';

var isActive = ref(false);
</script>
<template>
    <a href="#" class="nav-link py-3 border-bottom" :class="{ active:isActive }" @mouseover="isActive=true" @mouseleave="isActive=false" aria-current="page" title="Home"
        data-bs-toggle="tooltip" data-bs-placement="right">
        <svg class="bi" width="24" height="24" role="img" aria-label="Home">
            <use xlink:href="#home" />
        </svg>
    </a>
</template>
<style>
</style>
