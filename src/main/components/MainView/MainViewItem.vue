<!-- 主显示页 -->
<script setup>
import constant from '../../../constant';
import UrlItem from './UrlItem.vue';
import FileListItem from './FileList/FileListItem.vue';
import httpGet from '../../../httpGet'
import { reactive, ref } from 'vue'

const fileListView = ref();
const urlNav = ref();

const selectnum = ref(0);
const treeRef = ref();
const createDialogVisible = ref(false)
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

const treeProps = {
    children: 'children',
    label: 'label',
}

const nowFolderId = ref(0)

httpGet(constant.url.file.getRoot, null,
    (e) => {
        nowFolderId.value = e.data;
        fileListView.value.getList(e.data)
        urlNav.value.setRootFolderId(e.data)
    })


function setnum(val) {
    selectnum.value = val
}

function createFolder() {
    axios.post(constant.url.file.createFolder, { name: form.name, parentId: nowFolderId.value })
        .then((e) => {
            console.log(e)
            fileListView.value.getList(nowFolderId.value)
        })
        .catch((error) => {
            //setTimeout(200,getList(folderId))
        })
    createDialogVisible.value = false
    form.name = ""
}

const loadNode = function (node, resolve) {
    if (node.level === 0) {
        httpGet(constant.url.file.getRoot, null,
            (e) => {
                resolve([{ name: '主文件夹', folderId: e.data }])
            }
        )
    } else {
        httpGet(constant.url.file.list, { params: { folderId: node.data.folderId } },
            (body) => {
                let li = [];
                body.data.forEach((e) => {
                    if (e.type == 0) {
                        li.push({ name: e.name, folderId: e.id })
                    }
                })
                resolve(li)
            })
    }
}

//暂时不打算做
function downloadfolad(id) {

}
//暂时不打算做
function downloadfile(id) {

}

function copyfolad(id, tf) {
    axios.post(constant.url.file.copyFolder, { folderId: id, toFolderId: tf })
        .then((e) => {
            console.log(e)
            fileListView.value.getList(nowFolderId.value)
        })
}

function copyfile(id, tf) {
    axios.post(constant.url.file.copyFile, { folderId: id, toFolderId: tf })
        .then((e) => {
            console.log(e)
            fileListView.value.getList(nowFolderId.value)
        })
}

function copySelect(toFolderId) {
    fileListView.value.tableRef.getSelectionRows().forEach(element => {
        if (element.type == 1) {
            copyfile(element.id, toFolderId)
        } else {
            copyfolad(element.id, toFolderId)
        }
    });
}

function copySelectOk() {
    let tofolderId = treeRef.value.getCurrentNode().folderId
    copySelect(tofolderId)
    copyDialogVisible.value = false;
}

function deletefolad(id) {
    axios.post(constant.url.file.deleteFolder, { folderId: id })
        .then((e) => {
            console.log(e)
            fileListView.value.getList(nowFolderId.value)
        })
}
function deletefile(id) {
    axios.post(constant.url.file.deleteFile, { fileId: id })
        .then((e) => {
            console.log(e)
            fileListView.value.getList(nowFolderId.value)
        })
}
function deleteSelect() {
    fileListView.value.tableRef.getSelectionRows().forEach(element => {
        if (element.type == 1) {
            deletefile(element.id)
        } else {
            deletefolad(element.id)
        }
    });
}
function movefile(id, tf) {
    axios.post(constant.url.file.moveFile, { fileId: id, toFolderId: tf })
        .then((e) => {
            console.log(e)
            fileListView.value.getList(nowFolderId.value)
        })
}
function movefolad(id, tf) {
    axios.post(constant.url.file.moveFolder, { folderId: id, toFolderId: tf })
        .then((e) => {
            if (e.data.message == "Error") {
                ElMessage(e.data.data)
            }
            console.log(e)
            fileListView.value.getList(nowFolderId.value)
        })
}

function downloadSelect() {
    fileListView.value.tableRef.getSelectionRows().forEach(element => {
        if (element.type == 1) {
            downloadfile(element.id)
        } else {
            downloadfolad(element.id)
        }
    });
}
function moveSelect(tofolderId) {
    fileListView.value.tableRef.getSelectionRows().forEach(element => {
        if (element.type == 1) {
            movefile(element.id, tofolderId)
        } else {
            movefolad(element.id, tofolderId)
        }
    });
}

function renameFile(fileId, newName) {
    axios.post(constant.url.file.renameFile, { fileId: fileId, name: newName })
        .then((e) => {
            fileListView.value.getList(nowFolderId.value)
        })
}

function renameFolder(folderId, newName) {
    axios.post(constant.url.file.renameFolder, { folderId: folderId, name: newName })
        .then((e) => {
            fileListView.value.getList(nowFolderId.value)
        })
}

function renameSelect(name) {
    fileListView.value.tableRef.getSelectionRows().forEach(element => {
        if (element.type == 1) {
            renameFile(element.id, name)
        } else {
            renameFolder(element.id, name)
        }
    });
    form.name = ""
}

function renameSelectOk() {
    renameSelect(form.name)
    renameDialogVisible.value = false;
}

function folderSelectOK() {
    let tofolderId = treeRef.value.getCurrentNode().folderId
    moveSelect(tofolderId)
    moveDialogVisible.value = false;
}

function fileListGotoFolder(data) {
    fileListView.value.getList(data.folderId)
    urlNav.value.addFolder({ name: data.name, folderId: data.folderId })
    nowFolderId.value = data.folderId
}
function navGotoFolder(folderId) {
    fileListView.value.getList(folderId)
    nowFolderId.value = folderId
}
</script>
<template>
    <div class="p-3" style="width: calc(100% - 300px);">
        <div>
            <button type="button" v-if="selectnum == 0" class="btn btn-primary">上传</button>
            <div v-if="selectnum == 0" class="btn-group ps-3" role="group" aria-label="Basic outlined example">
                <button type="button" class="btn btn-outline-primary" @click="createDialogVisible = true">新建文件夹</button>
                <!-- <button type="button" class="btn btn-outline-primary">下载</button> -->
            </div>
            <div v-if="selectnum != 0" class="btn-group ps-3" role="group" aria-label="Basic outlined example">
                <button type="button" class="btn btn-outline-primary" @click="downloadSelect()">下载</button>
                <button type="button" class="btn btn-outline-primary" @click="deleteSelect()">删除</button>
                <button v-if="selectnum == 1" type="button" class="btn btn-outline-primary"
                    @click="renameDialogVisible = true">重命名</button>
                <button type="button" class="btn btn-outline-primary" @click="copyDialogVisible = true">复制</button>
                <button type="button" class="btn btn-outline-primary" @click="moveDialogVisible = true">移动</button>
            </div>
        </div>
        <UrlItem ref="urlNav" class="pt-3 pb-3" @gotoFolder="navGotoFolder" />
        <FileListItem ref="fileListView" @selectnum="setnum" @gotoFolder="fileListGotoFolder" />
    </div>

    <el-dialog v-model="createDialogVisible" width="30%" title="新建文件夹" class="dialog-width">
        <el-form :model="form">
            <el-form-item label="文件夹名称:" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="createDialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="createFolder">确认</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-if="moveDialogVisible" v-model="moveDialogVisible" width="30%" title="移动至" class="dialog-width">
        <el-tree ref="treeRef" :props="treeProps" :load="loadNode" lazy>
            <template #default="{ node, data }">
                <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px">{{ data.name }}</span>
                </div>
            </template>
        </el-tree>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="moveDialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="folderSelectOK">确认</el-button>
            </span>
        </template>
    </el-dialog>

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

    <el-dialog v-if="copyDialogVisible" v-model="copyDialogVisible" width="30%" title="复制到" class="dialog-width">
        <el-tree ref="treeRef" :props="treeProps" :load="loadNode" lazy>
            <template #default="{ node, data }">
                <div style="display: flex; align-items: center">
                    <span style="margin-left: 10px">{{ data.name }}</span>
                </div>
            </template>
        </el-tree>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="copyDialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="copySelectOk">确认</el-button>
            </span>
        </template>
    </el-dialog>


</template>
<style scoped>
.dialog-width {
    width: 100;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}

.el-input {
    width: 300px;
}
</style>