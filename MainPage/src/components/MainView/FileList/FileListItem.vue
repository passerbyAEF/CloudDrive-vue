<!-- 文件列表 -->
<script setup>
import fileimg from '@/assets/icons/fileicon.png'
import { ref } from 'vue';

const selectallbutton = ref()
const messagetext = ref()
const selectbuttons = ref([])
const emit = defineEmits(['selectnum'])


function setSelectButtonRef(el) {
    selectbuttons.value.push(el)
}

function selectAllButtonClick(el) {
    let k = el.currentTarget.checked;
    selectbuttons.value.forEach(element => {
        element.checked = k;
    });
    setMessageText();
}

function selectButtonClick(el) {
    setMessageText();
}

function setMessageText() {
    let num = 0;
    selectbuttons.value.forEach(element => {
        if (element.checked) {
            num++;
        }
    });
    emit('selectnum', num)
    if (num == 0) {
        messagetext.value.innerText = "文件名"
    } else {
        messagetext.value.innerText = "当前已选中" + num + "个文件/文件夹"
    }
}

</script>
<template>
    <div>
        <table class="onehpersent">
            <colgroup>
                <col width="8%">
                <col width="45%">
                <col width="23%">
                <col width="22%">
            </colgroup>
            <thead>
                <tr>
                    <th>
                        <div class="input-group checkboxCenter">
                            <input ref="selectallbutton" class="form-check-input mt-0" @click="selectAllButtonClick"
                                type="checkbox" value="">
                        </div>
                    </th>
                    <th>
                        <span ref="messagetext" class="pTheadText">文件名</span>
                    </th>
                    <th>
                        <span class="pTheadText">修改日期</span>
                    </th>
                    <th>
                        <span class="pTheadText">大小</span>
                    </th>
                </tr>
            </thead>
        </table>
    </div>
    <div>
        <table class="onehpersent">
            <colgroup>
                <col width="8%">
                <col width="45%">
                <col width="23%">
                <col width="22%">
            </colgroup>
            <tbody>
                <tr v-for="n in 5">
                    <th class="pt-3 pb-3">
                        <div class="input-group checkboxCenter">
                            <input :ref="setSelectButtonRef" @click="selectButtonClick" class="form-check-input mt-0"
                                type="checkbox" value="">
                        </div>
                    </th>
                    <th class="thline">
                        <img class="fileimg" :src="fileimg" />
                        <span class="pTableText ps-3">文件名</span>
                    </th>
                    <th class="thline">
                        <span class="pTableText">XXXX-XX-XX</span>
                    </th>
                    <th class="thline">
                        <span class="pTableText">XXXXGB</span>
                    </th>
                </tr>
            </tbody>

        </table>
    </div>
</template>
<style>
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
</style>