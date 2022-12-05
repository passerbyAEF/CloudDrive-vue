<!-- 上传显示列表 -->
<script setup>
import { ref } from 'vue';
import constant from './../../../constant'
import httpPost from './../../../httpPost'

const uploadList = ref([])

function startTask(task) {
    httpPost()
}

//获取应该启动的任务（就是当队列没有正在传输的任务时，第一个未执行的任务
function getStart(list) {
    //搜索当前是否有正在执行的任务s
    let k = true;
    for (const item of list) {
        if (item.isStart && item.percentage == 100) {
            k = false;
            break;
        }
    }
    //没有正在执行的，获取第一个未执行
    if (k)
        for (const item of list) {
            if (!item.isStart && item.percentage == 0) {
                return item;
            }
        }
    //都执行完了，或者被暂停了
    return undefined;
}

const addTask = function (fId, uploadFile) {
    uploadList.value.push({
        img: constant.getImg({ name: uploadFile.name, type: 0 }),
        name: uploadFile.name,
        percentage: 70,
        fileObject: uploadFile,
        folderId: fId,
        isStart: false,
    })
    //启动上传
    //搜索当前是否有应该启动的任务
    let task = getStart(uploadList.value)
    if (task == undefined) return
    startTask(task)
}
defineExpose({ addTask })
</script>
<template>
    <div class="common-layout">
        <el-container>
            <el-header class="header border-bottom">
                <strong class="strong">上传完成（0/{{ uploadList.values.length }}）</strong>
            </el-header>
            <div class="main">
                <el-table :data="uploadList" :show-header="false" stripe style="width: 100%">
                    <el-table-column width="50px">
                        <template #default="scope">
                            <el-image class="fileimg" :fit="contain" :src="scope.row.img" />
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template #default="scope">
                            <span>{{ scope.row.name }}</span>
                            <div style="display: flex; align-items: center" class="cursor">
                                <el-progress style="width: 100%" :percentage="scope.row.percentage" />
                            </div>
                            <span>{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="90px">
                        <template #default="scope">
                            <button type="button" class="btn btn-outline-primary"
                                @click="copyDialogVisible = true">暂停</button>
                            <button type="button" class="btn btn-outline-primary"
                                @click="moveDialogVisible = true">停止</button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-container>
    </div>
</template>
<style>
.header {
    width: 600px;
    height: 20px;
}

.main {
    height: 400px;
}

.fileimg {
    width: 25px;
    height: 25px;
}
</style>