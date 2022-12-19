<script setup>
import constant from '../../../constant'
import httpGet from '../../../httpGet'
import httpPost from '../../../httpPost'
import { ref, reactive } from 'vue';

const emit = defineEmits(["newUpload"])

const selectnum = ref(0);
const screeFlag = ref(0);
const treeRef = ref();
const moveDialogVisible = ref(false)
const renameDialogVisible = ref(false)
const copyDialogVisible = ref(false)
const form = reactive({
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: '',
})

const rootFolderId = ref(-1)
const messagetext = ref()
const listData = ref([])
const tableRef = ref()

httpGet(constant.url.file.getRoot, null,
    (e) => {
        rootFolderId.value = e.data;
    })

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

function getList(screeFlag) {
    if (screeFlag == -1) return
    httpGet(constant.url.file.screeList, { params: { flag: screeFlag } },
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
                item.imgsrc = constant.getImg(item);
            });
            listData.value = body.data
            tableRef.value.clearSelection()
            setMessageText()
        })
}

function uploadfile(rootid, file) {
    emit("newUpload", rootid, file)
}

function uploadClick(command) {
    let inputObj = document.createElement('input')
    inputObj.setAttribute('style', 'display:none')
    inputObj.setAttribute('type', 'file')
    inputObj.setAttribute('multiple', 'true')
    inputObj.onchange = function (event) {
        let files = event.target.files;
        for (const file of files) {
            uploadfile(rootFolderId.value, file)
        }
        document.body.removeChild(inputObj)
    }
    document.body.appendChild(inputObj);
    inputObj.click();
}

function downloadfile(id, name) {
    ElMessage("确认中，正在等待下载")
    httpGet(constant.url.file.getDownloadId, { params: { fileId: id } },
        (e) => {
            // console.log(e)
            let num = 0;
            function t() {
                httpGet(constant.url.file.getDownloadflag, { params: { flag: e.data } },
                    (e) => {
                        console.log(e)
                        if (e.data.ready) {
                            ElMessage("验证成功！正在开始下载")
                            let tempLink = document.createElement('a')
                            tempLink.style.display = 'none'
                            tempLink.href = constant.url.file.downloadFile + "?downloadId=" + e.data.downloadID + "&nodeId=" + e.data.nodeId + "&fileName=" + name
                            document.body.appendChild(tempLink)
                            tempLink.click()
                            document.body.removeChild(tempLink)
                            return
                        } else if (num < 20) {
                            setTimeout(t, 100);
                            num++
                            return
                        } else
                            ElMessage("网络错误！")
                    })
            }
            setTimeout(t, 500);
        })
}

function downloadSelect() {
    tableRef.value.getSelectionRows().forEach(element => {
        downloadfile(element.id, element.name)
    });
}

function renameSelectOk() {
    tableRef.value.getSelectionRows().forEach(element => {
        if (element.type == 1) {
            httpPost(constant.url.file.renameFile, { fileId: element.id, name: form.name }, undefined,
                (e) => {
                    refresh()
                }
            )
        }
    });
    form.name = ""
    renameDialogVisible.value = false;
}

function deletefile(id) {
    httpPost(constant.url.file.deleteFile, { fileId: id }, undefined,
        (e) => {
            refresh()
        }
    )
}

function deleteSelect() {
    tableRef.value.getSelectionRows().forEach(element => {
        if (element.type == 1) {
            httpPost(constant.url.file.deleteFile, { fileId: element.id }, undefined,
                (e) => {
                    refresh()
                }
            )
        }
    });
}

const setScree = function (i) {
    screeFlag.value = i
    getList(i)
}

const refresh = function () {
    getList(screeFlag.value)
}

defineExpose({ setScree, refresh })
</script>
<template>
    <div class="p-3" style="height:calc(100% - 50px) ;">
        <div class="mb-3">
            <el-dropdown trigger="click" @command="uploadClick">
                <button type="button" v-if="selectnum == 0" class="btn btn-primary">上传</button>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="file">上传文件</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <div v-if="selectnum != 0" class="btn-group ps-3" role="group">
                <button type="button" class="btn btn-outline-primary" @click="downloadSelect()">下载</button>
                <button type="button" class="btn btn-outline-primary" @click="deleteSelect()">删除</button>
                <button v-if="selectnum == 1" type="button" class="btn btn-outline-primary"
                    @click="renameDialogVisible = true">重命名</button>
            </div>
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

        <el-dialog v-model="renameDialogVisible" width="30%" title="重命名" class="dialog-width">
            <el-form :model="form">
                <el-form-item label="新名称:" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="renameDialogVisible = false">关闭</el-button>
                    <el-button type="primary" @click="renameSelectOk">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<style>

</style>