<script setup>
import HeaderItem from './components/header/index.vue'
import constant from '../constant';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const headerView = ref()
const form = reactive({
    pwd: '',
})

function onSubmit() {
    let shareId = constant.method.GetQueryString("id")
    let path = constant.method.GetQueryString("path")
    router.push(`/s/${shareId}/${path}?secretKey=${form.pwd}`)
}

</script>

<template>
    <HeaderItem ref="headerView" style="z-index: 3;" />
    <div class="d-flex center" style="width: calc(100%); height:calc(100% - 36px) ;">
        <div class="shadow p-3">
            <div class="p-3 d-flex border-bottom">
                <div class="fw-light">
                    <div><span class="text-secondary">请键入密码</span></div>
                </div>
            </div>
            <el-form :model="form" label-width="120px">
                <el-form-item class="m-3" label="取件码">
                    <el-input v-model="form.pwd" />
                </el-form-item>
                <el-form-item class="mb-0">
                    <el-button type="primary" @click="onSubmit">确认</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style scoped>
.btng {
    height: 38px;
}

.center {
    justify-content: center;
    align-items: center;
}
</style>
