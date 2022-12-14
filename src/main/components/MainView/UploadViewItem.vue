<!-- 上传显示列表 -->
<script setup>
import { ref } from 'vue';
import constant from './../../../constant'
import httpPost from './../../../httpPost'
import httpGet from './../../../httpGet'
import SparkMD5 from 'spark-md5'

const uploadList = ref([])
const partSize = 1024 * 1024 * 10;

function uploadFilePart(task, nodeId, uploadId) {
    let form = new FormData()
    let index = task.partId * partSize;
    let filepart = task.fileObject.slice(index, index + partSize)
    form.append("file", filepart)
    form.append("partId", task.partId)
    form.append("uploadId", uploadId)
    httpPost(constant.url.file.uploadFilePart,
        form,
        {
            headers: {
                nodeId: nodeId
            }
        },
        (e) => {
            // console.log(e)
            task.partId += 1
            if (task.partId * partSize < task.fileObject.size) {
                uploadFilePart(task, nodeId, uploadId)
            } else {
                ElMessage('上传完成')
            }
        }
    )
}

function startTask(task) {
    console.log(task)
    let md5 = new SparkMD5()
    let flag = 0;
    let fileReader = new FileReader()
    function next() {
        let slice = task.fileObject.slice(flag, flag + 1024)
        fileReader.readAsBinaryString(slice)
    }
    fileReader.onload = function (e) {
        md5.appendBinary(e.target.result)
        if (flag < task.fileObject.size) {
            flag += 1024
            next();
        } else {
            httpPost(constant.url.file.uploadFile,
                {
                    name: task.name,
                    folderId: task.folderId,
                    hash: md5.end(),
                    size: task.fileObject.size
                }, undefined,
                (e) => {
                    uploadFilePart(task, e.data.nodeId, e.data.uploadId)
                }
            )
        }
    }
    next();
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

function countSpeed(a) {
    if (a / 1024 < 1) {
        return a + 'B'
    }
    a /= 1024
    if (a / 1024 < 1) {
        return a + 'KB'
    }
    a /= 1024
    if (a / 1024 < 1) {
        return a + 'MB'
    }
    a /= 1024
    if (a / 1024 < 1) {
        return a + 'GB'
    }
}

const addTask = function (fId, uploadFile) {
    uploadList.value.push({
        img: constant.getImg({ name: uploadFile.name, type: 1 }),
        name: uploadFile.name,
        percentage: 0,
        fileObject: uploadFile,
        folderId: fId,
        isStart: false,
        partId: 0,
        speed: 0,
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
                            <span v-if="!scope.row.isStart">等待中</span>
                            <span v-else>当前速度：{{ scope.row.speed }}/S</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="90px">
                        <template #default="scope">
                            <div v-if="scope.row.isStart">
                                <button type="button" class="btn btn-outline-primary" @click="">暂停</button>
                                <button type="button" class="btn btn-outline-primary" @click="">停止</button>
                            </div>
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