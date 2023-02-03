<script setup>
import constant from './../../../constant'
import httpGet from './../../../httpGet'
import Card from './Card/CardView.vue'
import { ref } from 'vue';

const dataList = ref([])
let widthSum = 0
let heigthSum = 0

function getList() {
    httpGet(constant.url.share.list, undefined,
        (body) => {
            dataList.value = []
            for (let i = 0; i < body.data.length; i++) {
                if (i % widthSum == 0) {
                    dataList.value.push([])
                }
                let y = parseInt(i / widthSum)
                dataList.value[y].push(body.data[i])
            }
            console.log(dataList.value)
        })

}

function refresh() {
    let windowWidth = document.body.clientWidth - 100
    let windowHeigth = document.body.clientHeight
    widthSum = parseInt((windowWidth-50) / 332)
    heigthSum = parseInt(windowHeigth / 150)
    getList()
}

window.onresize = () => {
    refresh()
}

refresh()
</script>
<template>
    <div class="p-3 w-100 bg-light">
        <span class="fs-1 m-3 text-secondary">我的分享</span>
        <div class="d-flex w-100" ref="grid">
            <table>
                <tr v-for="h in dataList">
                    <td v-for="x in h">
                        <Card :data="x" @refresh="refresh()" />
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>
<style scoped>

</style>