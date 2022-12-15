<!-- 页面头 -->
<script setup>
import UPloadViewItem from './UploadViewItem.vue'
import { ref } from 'vue';

const uploadView = ref();
const emit = defineEmits(["uploadTaskOK"])

function uploadOK() {
    emit('uploadTaskOK')
}


const uploadfile = function (rootid, file) {
    uploadView.value.addTask(rootid, file)
}

defineExpose({uploadfile})
</script>

<template>
    <el-row class="bg-primary">
        <el-col :span="4">
        </el-col>
        <el-col :span="16">
            <div>
                <a class="navbar-brand a">
                    <strong>麒の网盘</strong>
                </a>
            </div>
        </el-col>
        <el-col :span="4">
            <div>
                <el-dropdown trigger="click">
                    <el-button link>
                        <a class="navbar-brand a">
                            <strong>传输列表</strong>
                        </a></el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <UPloadViewItem @uploadOK="uploadOK()" ref="uploadView" />
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </el-col>
    </el-row>
</template>

<style scoped>
a {
    color: white
}
</style>
