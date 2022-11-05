<!-- 文件列表 -->
<script setup>
import fileimg from 'Main@/assets/icons/fileicon.png'
import pptimg from 'Main@/assets/icons/ppticon.png'
import wordimg from 'Main@/assets/icons/wordicon.png'
import excelimg from 'Main@/assets/icons/excelicon.png'
import pdfimg from 'Main@/assets/icons/pdficon.png'
import txtimg from 'Main@/assets/icons/txticon.png'
import imgimg from 'Main@/assets/icons/imgicon.png'
import folderimg from 'Main@/assets/icons/foldericon.png'

import axios from "axios"
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
    axios.get("/api/File/List", { params: { folderId: f } })
        .then((e) => {
            let body = e.data;
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
        item.imgsrc = getImg(item);
    });
}

function getImg(n) {
    if (n.type == 0) return folderimg
    let filename = n.name.toLowerCase()

    let pptreg = /\.(ppt|pptx)$/
    let wordreg = /\.(doc|docx)$/
    let excelreg = /\.(xls|xlsx)$/
    let pdfreg = /\.(pdf)$/
    let txtreg = /\.(txt)$/
    let imgreg = /\.(bmp|jpg|jpeg|png|gif)$/

    if (pptreg.test(filename)) {
        return pptimg
    } else if (wordreg.test(filename)) {
        return wordimg
    } else if (excelreg.test(filename)) {
        return excelimg
    } else if (pdfreg.test(filename)) {
        return pdfimg
    } else if (txtreg.test(filename)) {
        return txtimg
    } else if (imgreg.test(filename)) {
        return imgimg
    }
    return fileimg
}

function itemClick(row, column, event) {
    if (row.type == 0)
        emit("gotoFolder", { name: row.name, folderId: row.id })
}

defineExpose({ getList, tableRef })

</script>
<template>
    <el-table ref="tableRef" stripe="true" :data="listData" style="width: 100%;" @row-click="itemClick"
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