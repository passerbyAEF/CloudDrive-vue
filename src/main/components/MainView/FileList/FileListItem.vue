<!-- 文件列表 -->
<script setup>
import constant from '../../../../constant'
import httpGet from '../../../../httpGet'
import { ref } from 'vue';

const tableRef = ref()
const messagetext = ref()
const emit = defineEmits(['selectnum', 'gotoFolder'])
const listData = ref([])

function selectButtonClick(selection, row) {
    setMessageText();
}

function setMessageText() {
    let num = tableRef.value.getSelectionRows().length;
    emit('selectnum', num)
    if (num == 0) {
        messagetext.value = "文件名"
    } else {
        messagetext.value = "当前已选中" + num + "个文件/文件夹"
    }
}

const getList = function (f) {
    httpGet(constant.url.file.list, { params: { folderId: f } },
        (body) => {
            setStorage(body.data)
            setImgs(body.data)
            listData.value = body.data
            tableRef.value.clearSelection()
            setMessageText()
        })
}

function setStorage(data) {
    data.forEach((item) => {
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
}

function setImgs(data) {
    data.forEach((item) => {
        item.imgsrc = constant.method.getImg(item);
    });
}

function itemClick(row, column, event) {
    if (row.type == 0)
        emit("gotoFolder", { name: row.name, folderId: row.id })
}

defineExpose({ getList, tableRef })

</script>
<template>
    <el-table ref="tableRef" :stripe="true" :data="listData" height="calc(100% - 50px)" style="width: 100%;" @row-click="itemClick"
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
</template>
<style>
.cursor {
    cursor: pointer
}

.onehpersent {
    width: 100%;
}

.pTheadText {
    font-size: 13px;
    font-weight: 600;
    color: rgb(63, 63, 63);
    margin-bottom: 0;
}

.pTableText {
    font-size: 15px;
    align-items: center;
    font-weight: 400;
    margin-bottom: 0;
}

.fileimg {
    width: 25px;
    height: 25px;
}

.checkboxCenter {
    justify-content: center;
    align-items: center;
}

.thline {
    border-top: 1px solid #f7f8fa;
}

.trline {
    height: 50dp;
}
</style>