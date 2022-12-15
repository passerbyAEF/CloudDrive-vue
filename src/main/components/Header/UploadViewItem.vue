<!-- 上传显示列表 -->
<script setup>
import { ref } from 'vue';
import constant from '../../../constant'
import httpPost from '../../../httpPost'
import httpGet from '../../../httpGet'
import SparkMD5 from 'spark-md5'

const uploadList = ref([])
const partSize = 1024 * 1024 * 10;

const emit = defineEmits(['uploadOK'])

function taskOK(task) {
    ElMessage('上传完成')
    emit('uploadOK')
    task.isPause = true
    task.isStart = true
    task.percentage = 100
    startNext()
}

function uploadFilePart(task) {
    let form = new FormData()
    let index = task.partId * partSize;
    let filepart = task.fileObject.slice(index, index + partSize)
    form.append("file", filepart)
    form.append("partId", task.partId)
    form.append("uploadId", task.uploadId)
    httpPost(constant.url.file.uploadFilePart,
        form,
        {
            headers: {
                nodeId: task.nodeId
            }
        },
        (e) => {
            task.partId += 1
            if (task.partId * partSize < task.fileObject.size) {
                uploadFilePart(task)
            } else {
                taskOK(task)
            }
        }
    )
}

function startTask(task) {
    //如果是0长度不用传输到文件服务器，直接上传走人
    if (task.fileObject.size == 0) {
        httpPost(constant.url.file.uploadFile,
            {
                name: task.name,
                folderId: task.folderId,
                size: task.fileObject.size
            }, undefined,
            (e) => {
                taskOK(task)
            }
        )
        return
    }
    task.isStart = true
    let md5 = new SparkMD5()
    let flag = 0;
    let fileReader = new FileReader()
    function next() {
        let slice = task.fileObject.slice(flag, flag + partSize)
        fileReader.readAsBinaryString(slice)
    }
    fileReader.onload = function (e) {
        md5.appendBinary(e.target.result)
        if (flag < task.fileObject.size) {
            flag += partSize
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
                    task.nodeId = e.data.nodeId
                    task.uploadId = e.data.uploadId
                    uploadFilePart(task, e.data.nodeId, e.data.uploadId)
                }
            )
        }
    }
    next();
}

function startNext() {
    //搜索当前是否有应该启动的任务
    let task = getStart(uploadList.value)
    if (task == undefined) return
    startTask(task)
}

//获取应该启动的任务（就是当队列没有正在传输的任务时，第一个未执行的任务
function getStart(list) {
    //搜索当前是否有正在执行的任务s
    let k = true;
    for (const item of list) {
        if (item.isStart && !item.isPause && item.percentage < 100) {
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
        return a.toFixed(2) + 'B'
    }
    a /= 1024
    if (a / 1024 < 1) {
        return a.toFixed(2) + 'KB'
    }
    a /= 1024
    if (a / 1024 < 1) {
        return a.toFixed(2) + 'MB'
    }
    a /= 1024
    if (a / 1024 < 1) {
        return a.toFixed(2) + 'GB'
    }
}

const addTask = function (fId, uploadFile) {
    uploadList.value.push({
        img: constant.getImg({ name: uploadFile.name, type: 1 }),
        name: uploadFile.name,
        fileObject: uploadFile,
        folderId: fId,
        isStart: false,
        isPause: false,
        partId: 0,
        lastPartId: 0,
        speed: 0,
        percentage: 0,
        uploadId: 0,
        nodeId: 0
    })
    //启动上传
    startNext()
}

//刷新速度和进度条
setInterval(() => {
    for (const item of uploadList.value) {
        //启动并且没暂停
        if (item.isStart && !item.isPause) {
            let i = (item.partId - item.lastPartId) * partSize
            item.speed = countSpeed(i)
            item.percentage = Number.parseInt(((item.partId * partSize) / item.fileObject.size) * 100)
        }
    }
}, 1000);

function stopButton(task) {
    uploadList.value = uploadList.value.filter((e) => {
        return task != e;
    })
    startNext()
}

function pauseButton(task) {
    task.isPause = true
    startNext()
}

function continueButton(task) {
    task.isPause = false
    uploadFilePart(task)
}

function getOK() {
    let num = 0
    for (const item of uploadList.value) {
        if (item.percentage >= 100) {
            num++
        }
    }
    return num
}

defineExpose({ addTask })
</script>
<template>
    <div class="common-layout">
        <el-container>
            <el-header class="header border-bottom">
                <strong class="strong">上传完成（{{ getOK() }}/{{ uploadList.length }}）</strong>
            </el-header>
            <div class="main">
                <el-table :data="uploadList" :show-header="false" stripe style="width: 100%">
                    <el-table-column width="50px">
                        <template #default="scope">
                            <el-image class="fileimg" :src="scope.row.img" />
                        </template>
                    </el-table-column>
                    <el-table-column>
                        <template #default="scope">
                            <span>{{ scope.row.name }}</span>
                            <div v-if="scope.row.percentage < 100" style="display: flex; align-items: center"
                                class="cursor">
                                <el-progress style="width: 100%" :percentage="scope.row.percentage" />
                            </div>
                            <span v-if="!scope.row.isStart">等待中</span>
                            <span v-else-if="scope.row.percentage >= 100">已完成</span>
                            <span v-else>当前速度：{{ scope.row.speed }}/S</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="90px">
                        <template #default="scope">
                            <div v-if="scope.row.isStart && scope.row.percentage < 100">
                                <button v-if="scope.row.isPause" type="button" class="btn btn-outline-primary"
                                    @click="pauseButton(scope.row)">继续</button>
                                <button v-else type="button" class="btn btn-outline-primary"
                                    @click="continueButton(scope.row)">暂停</button>
                                <button type="button" class="btn btn-outline-primary"
                                    @click="stopButton(scope.row)">停止</button>
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