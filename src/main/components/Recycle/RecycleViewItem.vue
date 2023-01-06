<script setup>
import constant from '../../../constant'
import httpGet from '../../../httpGet'
import httpPost from '../../../httpPost'
import { ref, reactive } from 'vue';

const selectnum = ref(0);
const messagetext = ref()
const listData = ref([])
const tableRef = ref()



function selectButtonClick(selection, row) {
    setMessageText();
}

function setMessageText() {
    let num = tableRef.value.getSelectionRows().length;
    selectnum.value = num
    if (num == 0) {
        messagetext.value = "文件名"
    } else {
        messagetext.value = "当前已选中" + num + "个文件/文件夹"
    }
}

function getList() {
    httpGet(constant.url.recycle.list, {},
        (body) => {
            body.data.forEach((item) => {
                if (item.storage > 1024 * 1024 * 1024) {
                    item.size = (item.storage / (1024 * 1024 * 1024)).toFixed(2) + "GB";
                }
                if (item.storage > 1024 * 1024) {
                    item.size = (item.storage / (1024 * 1024)).toFixed(2) + "MB";
                }
                if (item.storage > 1024) {
                    item.size = (item.storage / 1024).toFixed(2) + "KB";
                }
            });
            body.data.forEach((item) => {
                item.imgsrc = constant.method.getImg(item);
            });
            listData.value = body.data
            tableRef.value.clearSelection()
            setMessageText()
        })
}

function recoveryClick() {
    let files = tableRef.value.getSelectionRows();
    let list = [];
    files.forEach((item) => {
        list.push({ id: item.id, isFile: item.type })
    })
    httpPost(constant.url.recycle.recovery, list, undefined, (e) => {
        ElMessage("文件已恢复")
        getList()
    })
}

function deleteClick() {
    let files = tableRef.value.getSelectionRows();
    let list = [];
    files.forEach((item) => {
        list.push({ id: item.id, isFile: item.type })
    })
    httpPost(constant.url.recycle.delete, list, undefined, (e) => {
        ElMessage("文件已删除")
        getList()
    })
}

getList()
</script>
<template>
    <div class="p-3" style="height:calc(100% - 50px) ;">
        <div class="mb-3">
            <el-button type="primary" size="large" :disabled="selectnum == 0" @click="recoveryClick()">恢复</el-button>
            <el-button type="primary" size="large" :disabled="selectnum == 0" @click="deleteClick()">删除</el-button>
        </div>

        <el-table ref="tableRef" :stripe="true" :data="listData" height="100%" style="width: 100%;"
            @select-all="selectButtonClick" @select="selectButtonClick">
            <el-table-column type="selection" width="50dp" />
            <el-table-column property="name" :label="messagetext">
                <template #default="scope">
                    <div style="display: flex; align-items: center" class="cursor">
                        <el-icon>
                            <img class="fileimg" :src="scope.row.imgsrc" />
                        </el-icon>
                        <span style="margin-left: 10px">{{ scope.row.name }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column property="time" label="修改日期" width="200dp" />
            <el-table-column property="size" label="大小" width="100dp" />
        </el-table>
    </div>
</template>
<style>

</style>