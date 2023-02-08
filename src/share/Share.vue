<script setup>
import HeaderItem from './components/header/index.vue'
import SidebarItem from './components/sidebar/index.vue'
import UrlItem from 'Main@/components/MainView/UrlItem.vue'
import FileListItem from 'Main@/components/MainView/FileList/FileListItem.vue'
import httpGet from '../httpGet'
import httpPost from '../httpPost'
import constant from '../constant'
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const shareId = route.params.pathMatch[0];
const nowpath = ref("/" + route.params.pathMatch.slice(1).join("/"))
const key = constant.method.GetQueryString("secretKey");

const headerView = ref()
const fileListView = ref();
const urlNav = ref();
const treeRef = ref();

const copyDialogVisible = ref(false)
const treeProps = {
    children: 'children',
    label: 'label',
}

const selectnum = ref(0);

function setnum(val) {
    selectnum.value = val
}

function fileListGotoFolder(data) {
    nowpath.value = nowpath.value + data.name + "/"
    fileListView.value.getShareList(shareId, nowpath.value, key)
    urlNav.value.addFolder({ name: data.name, folderId: data.folderId })
    history.pushState({ path: nowpath.value }, document.title, `/s/${shareId}${nowpath.value}?secretKey=${key}`)
}

function navGotoPath(path) {
    nowpath.value = path
    fileListView.value.getShareList(shareId, nowpath.value, key)
    history.pushState({ path: nowpath.value }, document.title, `/s/${shareId}${nowpath.value}?secretKey=${key}`)
}

function downloadfile(name) {
    ElMessage("确认中，正在等待下载")
    httpGet(constant.url.share.external.downloadShareFile, { params: { id: shareId, path: nowpath.value, fileName: name, secretKey: key } },
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
    fileListView.value.tableRef.getSelectionRows().forEach(element => {
        if (element.type == 1) {
            downloadfile(element.name)
        }
    });
}

function copyfolder(id, tf) {
    httpPost(constant.url.file.copyFolder, { folderId: id, toFolderId: tf }, undefined,
        (e) => {
            console.log(e)
            ElMessage("复制成功")
        }
    )
}

function copyfile(id, tf) {
    httpPost(constant.url.file.copyFile, { fileId: id, toFolderId: tf }, undefined,
        (e) => {
            console.log(e)
            ElMessage("复制成功")
        }
    )
}

function copySelectOk() {
    let tofolderId = treeRef.value.getCurrentNode().folderId
    fileListView.value.tableRef.getSelectionRows().forEach(element => {
        if (element.type == 1) {
            copyfile(element.id, tofolderId)
        } else {
            copyfolder(element.id, tofolderId)
        }
    });
    copyDialogVisible.value = false;
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

function checkCookie() {
    var user = getCookie("Token");
    if (user != "") {
        return true;
    }
    else {
        return false;
    }
}//检测cookie是否存在
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); }
    }
    return "";
}

onMounted(() => {
    httpGet(constant.url.share.external.getEntityId, { params: { id: shareId } },
        (e) => {
            urlNav.value.setRootFolderId(e.data)
        })
    fileListView.value.getShareList(shareId, nowpath.value, key)
})

</script>

<template>
    <HeaderItem ref="headerView" style="z-index: 3;" />
    <div class="d-flex w-100" style="width:calc(100%);height:calc(100% - 36px) ;">
        <SidebarItem />
        <div class="p-3" style="width:100%; height:calc(100% - 50px) ;">
            <div class="btn-group btng" role="group">
                <button v-if="selectnum != 0" type="button" class="btn btn-outline-primary"
                    @click="downloadSelect()">下载</button>
                <button v-if="selectnum != 0 && checkCookie()" type="button" class="btn btn-outline-primary"
                    @click="copyDialogVisible = true">复制到</button>
            </div>
            <UrlItem ref="urlNav" class="pt-3 pb-3" @gotoSharePath="navGotoPath" />
            <FileListItem ref="fileListView" @selectnum="setnum" @gotoFolder="fileListGotoFolder" />
        </div>
    </div>
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
.btng {
    height: 38px;
}
</style>
