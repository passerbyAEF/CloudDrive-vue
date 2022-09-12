<script setup>
const emit = defineEmits(['gotoRegister'])

function gotoRegister() {
    emit('gotoRegister')
}
</script>

<template>
    <form action="">
        <img class="mb-4" src="https://avatars.githubusercontent.com/u/43606074?v=4" width="150" height="150">
        <h1 class="h3 mb-3 fw-normal">请登录</h1>
        <div class="form-floating">
            <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
            <label for="floatingInput">邮箱</label>
        </div>
        <div class="form-floating">
            <input type="password" class="form-control" id="floatingPassword" placeholder="Password">
            <label for="floatingPassword">密码</label>
        </div>
        <div class="checkbox mb-3">
            <label>
                <input type="checkbox" value="remember-me"> 记住我
            </label>
        </div>
        <button class="w-100 btn btn-lg btn-primary" type="submit">登录</button>
        <button class="w-100 mt-2 btn btn-lg btn-primary" @click="gotoRegister" type="button">注册</button>
        <p class="mt-5 mb-3 text-muted">Passerby-Alpha</p>
    </form>
</template>
<style scoped>

</style>
