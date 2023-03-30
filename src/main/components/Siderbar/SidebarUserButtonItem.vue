<!-- 侧边栏用户按钮 -->
<script setup>
import { ref } from 'vue';
import constant from '../../../constant';
import httpGet from '../../../httpGet';

const flag=ref(false);

httpGet(constant.url.auth.isAdmin, undefined,
    (body) => {
        flag.value=body.data;
    }, undefined,)

</script>
<template>
    <div class="dropdown border-top">
        <a href="#"
            class="d-flex align-items-center justify-content-center p-3 link-dark text-decoration-none dropdown-toggle"
            id="dropdownUser3" data-bs-toggle="dropdown" aria-expanded="false">
            <!-- <img src="https://github.com/mdo.png" alt="mdo" width="24" height="24" class="rounded-circle"> -->
        </a>
        <ul class="dropdown-menu text-small shadow">
            <li v-if="flag"><a class="dropdown-item" href="http://localhost:80/dev-api/exLogin?username=admin&password=admin123">管理后台</a></li>
            <!-- <li><a class="dropdown-item" href="#">用户设置</a></li> -->
            <li>
                <hr class="dropdown-divider">
            </li>
            <li><a class="dropdown-item" :href="constant.url.auth.loginOut">登出</a></li>
        </ul>
    </div>
</template>
<style></style>

