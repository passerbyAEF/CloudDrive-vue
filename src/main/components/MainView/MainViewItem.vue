<!-- 主显示页 -->
<script setup>
import constant from '../../../constant';
import UrlItem from './UrlItem.vue';
import FileListItem from './FileList/FileListItem.vue';
import httpGet from '../../../httpGet';
import httpPost from '../../../httpPost'
import PathTreeNode from '../../../pathTree'
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

const emit = defineEmits(["newUpload"])

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
    httpPost(constant.url.file.createFolder, { name: form.name, parentId: nowFolderId.value }, undefined,
        (e) => {
            console.log(e)
            fileListView.value.getList(nowFolderId.value)
        }, (error) => {
            //setTimeout(200,getList(folderId))
        }
    )
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
function downloadfolder(id) {

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

function copyfolder(id, tf) {
    httpPost(constant.url.file.copyFolder, { folderId: id, toFolderId: tf }, undefined,
        (e) => {
            console.log(e)
            fileListView.value.getList(nowFolderId.value)
        }
    )
}

function copyfile(id, tf) {
    httpPost(constant.url.file.copyFile, { fileId: id, toFolderId: tf }, undefined,
        (e) => {
            console.log(e)
            fileListView.value.getList(nowFolderId.value)
        }
    )
}

function copySelect(toFolderId) {
    fileListView.value.tableRef.getSelectionRows().forEach(element => {
        if (element.type == 1) {
            copyfile(element.id, toFolderId)
        } else {
            copyfolder(element.id, toFolderId)
        }
    });
}

function copySelectOk() {
    let tofolderId = treeRef.value.getCurrentNode().folderId
    copySelect(tofolderId)
    copyDialogVisible.value = false;
}

function deletefolder(id) {
    httpPost(constant.url.file.deleteFolder, { folderId: id }, undefined,
        (e) => {
            console.log(e)
            fileListView.value.getList(nowFolderId.value)
        }
    )
}
function deletefile(id) {
    httpPost(constant.url.file.deleteFile, { fileId: id }, undefined,
        (e) => {
            console.log(e)
            fileListView.value.getList(nowFolderId.value)
        }
    )
}
function deleteSelect() {
    fileListView.value.tableRef.getSelectionRows().forEach(element => {
        if (element.type == 1) {
            deletefile(element.id)
        } else {
            deletefolder(element.id)
        }
    });
}
function movefile(id, tf) {
    httpPost(constant.url.file.moveFile, { fileId: id, toFolderId: tf }, undefined,
        (e) => {
            console.log(e)
            fileListView.value.getList(nowFolderId.value)
        }
    )
}
function movefolder(id, tf) {
    httpPost(constant.url.file.moveFolder, { folderId: id, toFolderId: tf }, undefined,
        (e) => {
            // if (e.message == "Error") {
            //     ElMessage(e.data)
            // }
            console.log(e)
            fileListView.value.getList(nowFolderId.value)
        }
    )
}

function downloadSelect() {
    fileListView.value.tableRef.getSelectionRows().forEach(element => {
        if (element.type == 1) {
            downloadfile(element.id, element.name)
        } else {
            downloadfolder(element.id)
        }
    });
}
function moveSelect(tofolderId) {
    fileListView.value.tableRef.getSelectionRows().forEach(element => {
        if (element.type == 1) {
            movefile(element.id, tofolderId)
        } else {
            movefolder(element.id, tofolderId)
        }
    });
}

function renameFile(fileId, newName) {
    httpPost(constant.url.file.renameFile, { fileId: fileId, name: newName }, undefined,
        (e) => {
            fileListView.value.getList(nowFolderId.value)
        }
    )
}

function renameFolder(folderId, newName) {
    httpPost(constant.url.file.renameFolder, { folderId: folderId, name: newName }, undefined,
        (e) => {
            fileListView.value.getList(nowFolderId.value)
        }
    )
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

function uploadfile(rootid, file) {
    emit("newUpload", rootid, file)
}

function uploadfolder(rootid, folder) {
    httpGet(constant.url.file.list, { params: { folderId: rootid } },
        (body) => {
            for (const item of body.data) {
                //拥有重名文件夹
                if (item.type == 0 && folder.name == item.name) {
                    for (const item2 of folder.children) {
                        if (item2.fileObject == null) {
                            uploadfolder(item.id, item2)
                        } else {
                            uploadfile(item.id, item2.fileObject)
                        }
                    }
                    return;
                }
            }
            //没有重名文件夹，创建一个新的
            httpPost(constant.url.file.createFolder, { name: folder.name, parentId: rootid }, undefined,
                (body) => {
                    //创建新文件夹，后上传到文件夹中
                    for (const item of folder.children) {
                        if (item.fileObject == null) {
                            uploadfolder(body.data, item)
                        } else {
                            uploadfile(body.data, item.fileObject)
                        }
                    }
                })
        })
}

function uploadClick(command) {
    let inputObj = document.createElement('input')
    inputObj.setAttribute('style', 'display:none')
    inputObj.setAttribute('type', 'file')
    inputObj.setAttribute('multiple', 'true')
    inputObj.onchange = function (event) {
        let files = event.target.files;
        switch (command) {
            case "file":
                for (const file of files) {
                    uploadfile(nowFolderId.value, file)
                }
                break;
            case "folder":
                let head = new PathTreeNode("", true);
                for (const file of files) {
                    head.addChildren(file.webkitRelativePath, file)
                }
                console.log(head)
                uploadfolder(nowFolderId.value, head.children[0])
                break;
        }
        document.body.removeChild(inputObj)
    }
    if (command == "folder") {
        inputObj.setAttribute('webkitdirectory', 'true')
    }
    document.body.appendChild(inputObj);
    inputObj.click();
}

const refresh = function () {
    fileListView.value.getList(nowFolderId.value)
}

defineExpose({ refresh })
</script>
<template>
    <div class="p-3" style="width: 100%; height:calc(100% - 50px) ;">
        <el-row>
            <el-col :span="20">
                <div>
                    <el-dropdown trigger="click" @command="uploadClick">
                        <button type="button" v-if="selectnum == 0" class="btn btn-primary">上传</button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="file">上传文件</el-dropdown-item>
                                <el-dropdown-item command="folder">上传文件夹</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <div v-if="selectnum == 0" class="btn-group ps-3" role="group">
                        <button type="button" class="btn btn-outline-primary"
                            @click="createDialogVisible = true">新建文件夹</button>
                    </div>
                    <div v-if="selectnum != 0" class="btn-group ps-3" role="group">
                        <button type="button" class="btn btn-outline-primary" @click="downloadSelect()">下载</button>
                        <button type="button" class="btn btn-outline-primary" @click="deleteSelect()">删除</button>
                        <button v-if="selectnum == 1" type="button" class="btn btn-outline-primary"
                            @click="renameDialogVisible = true">重命名</button>
                        <button type="button" class="btn btn-outline-primary"
                            @click="copyDialogVisible = true">复制</button>
                        <button type="button" class="btn btn-outline-primary"
                            @click="moveDialogVisible = true">移动</button>
                    </div>
                </div>
            </el-col>
            <el-col :span="4">
            </el-col>
        </el-row>
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

.el-row {
    margin-bottom: 20px;
}

.el-row:last-child {
    margin-bottom: 0;
}

.el-col {
    border-radius: 4px;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
</style>