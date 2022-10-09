<script setup>
import { ref } from 'vue';
import loginPage from './components/login.vue'
import registerPage from './components/register.vue'
import Register from './components/register.vue';

let k = ref(true)

</script>
<template>
  <loginPage @gotoRegister="k=false" v-if="k" />
  <registerPage @gotoLogin="k=true" v-else/>
</template>
<style scoped>

</style>
