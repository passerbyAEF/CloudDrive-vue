<script setup>
import open from '../icon/open.vue'
import { Key, Delete, Setting } from '@element-plus/icons-vue'
import constant from '../../../../constant';
import httpPost from '../../../../httpPost'
import { ref } from 'vue';

const props = defineProps(['data'])
const emit = defineEmits(["refresh"])
const deleteOrOpenDialogData = ref({
    visible: false,
    callback: undefined
});
const cipherDialogData = ref({
    visible: false,
    callback: undefined,
    isUseCipher: false, pwd: "",
})

const overdueTimeDialogData = ref({
    visible: false,
    callback: undefined,
    isUseOverdue: false, overdueTime: "",
    shortcuts: [
        {
            text: '明天',
            value: () => {
                const date = new Date()
                date.setTime(date.getTime() + 3600 * 1000 * 24)
                return date
            },
        },
        {
            text: '下周',
            value: () => {
                const date = new Date()
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
                return date
            },
        },
        {
            text: '下个月',
            value: () => {
                const date = new Date()
                date.setMonth(date.getMonth() + 1)
                return date
            },
        },
        {
            text: '一年后',
            value: () => {
                const date = new Date()
                date.setFullYear(date.getFullYear() + 1)
                return date
            },
        },
    ],
    disabledDate: (time) => {
        return time.getTime() < Date.now()
    }
})

cipherDialogData.value.pwd = props.data.secretKey;

function deleteshare() {
    deleteOrOpenDialogData.value.callback = () => {
        httpPost(constant.url.share.delete, { id: props.data.id }, undefined,
            (e) => {
                emit("refresh")
                deleteOrOpenDialogData.value.visible = false;
            }
        )
    }
    deleteOrOpenDialogData.value.message = "是否要删除";
    deleteOrOpenDialogData.value.visible = true;
}

function updateoverdue() {
    let data = props.data
    overdueTimeDialogData.value.isUseOverdue = data.isUseOverdue
    overdueTimeDialogData.value.overdueTime = data.overdueTime
    overdueTimeDialogData.value.callback = () => {
        let data = props.data
        data.isUseOverdue = overdueTimeDialogData.value.isUseOverdue
        data.overdueTime = overdueTimeDialogData.value.overdueTime;
        console.log(data)
        httpPost(constant.url.share.update, data, undefined,
            (e) => {
                emit("refresh")
                overdueTimeDialogData.value.visible = false;
            }
        )
    }
    overdueTimeDialogData.value.visible = true;
}

function updatecipher() {
    let data = props.data
    cipherDialogData.value.isUseCipher = data.isUseCipher
    cipherDialogData.value.callback = () => {
        let data = props.data
        data.isUseCipher = cipherDialogData.value.isUseCipher
        data.secretKey = cipherDialogData.value.pwd;
        console.log(data)
        httpPost(constant.url.share.update, data, undefined,
            (e) => {
                emit("refresh")
                cipherDialogData.value.visible = false;
            }
        )
    }
    cipherDialogData.value.visible = true;
}

function randomPwd() {
    let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let num
    let pwd = ""
    for (let i = 0; i < 10; i++) {
        num = Number.parseInt(Math.random() * 100)
        pwd += chars[num % chars.length]
    }
    cipherDialogData.value.pwd = pwd
}

function stopPropagation(e) {
    e.stopPropagation();
}

function openShareTag() {
    let url = "/S/" + props.data.id;
    if (props.data.secretKey != null) {
        url += '?secretKey=' + props.data.secretKey
    }
    window.open(url);
}
</script>
<template>
    <div class="shadow card m-3">
        <div class="p-3 d-flex border-bottom">
            <img class="m-2" :src="constant.method.getImg({ type: props.data.entityType, name: props.data.name })" />
            <div class="fw-light">
                <div><span class="fs-5 nametext">{{ props.data.name }}</span></div>
                <div v-if="props.data.overdueTime == null"><span class="text-secondary">永不过期</span></div>
                <div v-else><span class="text-secondary">{{ props.data.overdueTime }}过期</span></div>
            </div>
        </div>
        <div class="d-flex flex-row-reverse">
            <el-tooltip placement="top" content="取消分享">
                <el-button @click="deleteshare()" class="m-1" size="large" :icon="Delete" circle text />
            </el-tooltip>
            <el-tooltip placement="top" content="过期时间设置">
                <el-button @click="updateoverdue()" class="m-1" size="large" :icon="Setting" circle text />
            </el-tooltip>
            <el-tooltip placement="top" content="密钥设置">
                <el-button @click="updatecipher()" class="m-1" size="large" :icon="Key" circle text />
            </el-tooltip>
            <el-tooltip placement="top" content="打开">
                <el-button @click="openShareTag()" class="m-1" size="large" :icon="open" circle text />
            </el-tooltip>
        </div>
    </div>

    <el-dialog v-model="cipherDialogData.visible" width="30%" title="密钥设置" class="dialog-width">
        <el-collapse accordion>
            <el-collapse-item name="1">
                <template #title>
                    <el-checkbox v-model="cipherDialogData.isUseCipher" @click="stopPropagation" label="使用密码保护（请将新密码填入）"
                        size="large" />
                </template>
                <div class="block">
                    <el-input class="share-pwd" v-model="cipherDialogData.pwd" maxlength="10" show-password
                        placeholder="请输入密码">
                        <template #append>
                            <el-button class="m-1" link @click="randomPwd()">随机密码</el-button>
                        </template>
                    </el-input>
                </div>
            </el-collapse-item>
        </el-collapse>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cipherDialogData.visible = false">关闭</el-button>
                <el-button type="primary" @click="cipherDialogData.callback">确认</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="overdueTimeDialogData.visible" width="30%" title="过期时间设置" class="dialog-width">
        <el-collapse accordion>
            <el-collapse-item name="1">
                <template #title>
                    <el-checkbox v-model="overdueTimeDialogData.isUseOverdue" @click="stopPropagation" label="自动过期"
                        size="large" />
                </template>
                <div class="block">
                    <el-date-picker style="width: 200px;" v-model="overdueTimeDialogData.overdueTime" type="date"
                        placeholder="请选择" :disabled-date="overdueTimeDialogData.disabledDate"
                        :shortcuts="overdueTimeDialogData.shortcuts" />
                    <span>后自动过期</span>
                </div>
            </el-collapse-item>
        </el-collapse>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="overdueTimeDialogData.visible = false">关闭</el-button>
                <el-button type="primary" @click="overdueTimeDialogData.callback">确认</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="deleteOrOpenDialogData.visible" width="30%" class="dialog-width">
        <span>{{ deleteOrOpenDialogData.message }}</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="deleteOrOpenDialogData.visible = false">关闭</el-button>
                <el-button type="primary" @click="deleteOrOpenDialogData.callback">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<style scoped>
img {
    width: 40px;
    height: 40px;
}

.share-pwd {
    width: 300px;
}

.block {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}

.card {
    width: 300px;
    height: 140px;
}

.nametext {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
    width: 200px;
}
</style>