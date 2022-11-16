<script setup>
import { ref } from 'vue';
import loginPage from './components/login.vue'
import registerPage from './components/register.vue'
import Register from './components/register.vue';
import './assets/main.css'

let k = ref(true)

</script>

<template>
  <div class="form-signin text-center" >
    <loginPage @gotoRegister="k = false" v-if="k" />
    <registerPage @gotoLogin="k = true" v-else />
  </div>
</template>
<style scoped>
</style>
