<!-- 二号侧边栏 -->
<script setup>
import constant from '../../../constant'
import httpGet from '../../../httpGet'
import httpPost from '../../../httpPost'
import { ref } from 'vue'

const nowStorage = ref("0KB")
const maxStorage = ref("0KB")
const percentageVal = ref(0)

const emit = defineEmits(["setScree"])

var list = ref(['图片', '文档', '视频', '音频', '其他'])

function myFileClick(event) {
    var i = 0
    if (event.delegateTarget.children[0].innerText === "v 我的文件") {
        event.delegateTarget.children[0].innerText = "> 我的文件"
    } else {
        event.delegateTarget.children[0].innerText = "v 我的文件"
    }
    emit("setScree", -1)
}

function getStorage() {
    httpGet(constant.url.file.getStorage, undefined,
        (body) => {
            nowStorage.value = constant.getStorage(body.data)
            if (maxStorage.value != "0KB") {
                let nowS=nowStorage.value.substring(0,nowStorage.value.length-2)
                let maxS=maxStorage.value.substring(0,maxStorage.value.length-2)
                nowS=parseFloat(nowS)
                maxS=parseFloat(maxS)
                percentageVal.value = nowS / maxS
            }
        })
    httpGet(constant.url.file.getMaxStorage, undefined,
        (body) => {
            maxStorage.value = constant.getStorage(body.data)
            if (nowStorage.value != "0KB") {
                let nowS=nowStorage.value.substring(0,nowStorage.value.length-2)
                let maxS=maxStorage.value.substring(0,maxStorage.value.length-2)
                nowS=parseFloat(nowS)
                maxS=parseFloat(maxS)
                percentageVal.value = nowS / maxS
            }
        })
}

function screeClick(i) {
    emit("setScree", list.value.indexOf(i))
}

function recycleClick() {
    emit("setScree", -2)
}

getStorage()
</script>
<template>
    <div class="d-flex flex-column flex-shrink-0 bg-light shadow" style="width: 200px;">
        <el-container>
            <el-main>
                <ul class="nav flex-column mb-auto text-center">
                    <li class="nav-item">
                        <div class="nav-link border-bottom">
                            <button class="btn btn-primary" @click="myFileClick" style="width: 100%;" type="button"
                                data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false"
                                aria-controls="collapseExample">
                                <span>> 我的文件</span>
                            </button>
                            <div class="collapse" id="collapseExample">
                                <ul class="nav flex-column mb-auto text-center">
                                    <li v-for="item in list" class="nav-item">
                                        <div class="nav-link border-bottom">
                                            <button class="btn btn-primary" style="width: 100%;"
                                                @click="screeClick(item)" type="button">
                                                <span>{{ item }}</span>
                                            </button>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li class="nav-item">
                        <div class="nav-link border-bottom">
                            <button class="btn btn-primary" style="width: 100%;" @click="recycleClick()" type="button">
                                <span>回收站</span>
                            </button>
                        </div>
                    </li>
                </ul>
            </el-main>
            <el-footer>
                <div>
                    <span>当前容量：</span>
                    <el-progress :percentage="percentageVal" :show-text="false" />
                    <span>{{ nowStorage }}/{{ maxStorage }}</span>
                </div>
            </el-footer>
        </el-container>

    </div>
</template>
<style scoped>
main {
    padding: 0px;
}
</style>