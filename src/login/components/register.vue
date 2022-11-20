<script setup>
import constant from '../../constant';
import { ref } from 'vue';

const emit = defineEmits(['gotoLogin'])

const pwd1 = ref("");
const pwd2 = ref("");

function gotoLogin() {
  emit('gotoLogin')
}
</script>
<template>
  <form :action="constant.url.auth.registers" method="post">
    <img class="mb-4" src="https://avatars.githubusercontent.com/u/43606074?v=4" width="150" height="150">
    <h1 class="h3 mb-3 fw-normal">注册</h1>
    <div class="form-floating">
      <input type="email" name="email" class="form-control" placeholder="name@example.com">
      <label for="floatingInput">邮箱</label>
    </div>
    <div class="form-floating">
      <input type="text" name="name" class="form-control" placeholder="name@example.com">
      <label for="floatingInput">用户名</label>
    </div>
    <div class="form-floating">
      <input type="password" v-model="pwd1" class="form-control" placeholder="Password">
      <label for="floatingPassword">密码</label>
    </div>
    <div class="form-floating">
      <input type="password" v-model="pwd2" name="pwd" class="form-control" placeholder="Password">
      <label for="floatingPassword">请重复输入密码</label>
    </div>
    <button class="w-100 mt-2 btn btn-lg btn-primary" :class="{ disabled: pwd1 != pwd2 }" type="submit">注册</button>
    <button class="w-100 mt-2 btn btn-lg btn-primary" @click="gotoLogin" type="button">返回</button>
    <p class="mt-5 mb-3 text-muted">Passerby-Alpha</p>
  </form>
</template>
<style scoped>

</style>
