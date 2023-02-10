<!-- 二号侧边栏 -->
<script setup>
import constant from '../../../constant'
import httpGet from '../../../httpGet'
import httpPost from '../../../httpPost'
import { ref } from 'vue'

const nowStorage = ref(0)
const maxStorage = ref(0)
const percentageVal = ref(0)

const emit = defineEmits(["setView"])

var list = ref(['图片', '文档', '视频', '音频', '其他'])

function myFileClick(event) {
    var i = 0
    if (event.delegateTarget.children[0].innerText === "v 我的文件") {
        event.delegateTarget.children[0].innerText = "> 我的文件"
    } else {
        event.delegateTarget.children[0].innerText = "v 我的文件"
    }
    emit("setView", constant.enum.viewFlag.Main)
}

function getStorage() {
    httpGet(constant.url.file.getStorage, undefined,
        (body) => {
            nowStorage.value = body.data
            if (maxStorage.value != 0) {
                let nowS = parseFloat(nowStorage.value)
                let maxS = parseFloat(maxStorage.value)
                percentageVal.value = nowS / maxS
                percentageVal.value *= 100
            }
        })
    httpGet(constant.url.file.getMaxStorage, undefined,
        (body) => {
            maxStorage.value = body.data
            if (nowStorage.value != 0) {
                let nowS = parseFloat(nowStorage.value)
                let maxS = parseFloat(maxStorage.value)
                percentageVal.value = nowS / maxS
                percentageVal.value *= 100
            }
        })
}

function screeClick(i) {
    emit("setView", constant.enum.viewFlag.Scree.img + list.value.indexOf(i))
}

function recycleClick() {
    emit("setView", constant.enum.viewFlag.Recycle)
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
                    <span>{{ constant.method.getStorage(nowStorage) }}/{{ constant.method.getStorage(maxStorage) }}</span>
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