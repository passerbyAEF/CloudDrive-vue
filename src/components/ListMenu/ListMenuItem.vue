<script setup>
import { ref } from 'vue';

var list = ref(['图片','文档','视频','音频','其他'])

function myFileClick(event){
    var i=0
    if(event.delegateTarget.children[0].innerText==="v 我的文件"){
        event.delegateTarget.children[0].innerText="> 我的文件"
    }else{
        event.delegateTarget.children[0].innerText="v 我的文件"
    }
}
</script>
<template>
    <div class="d-flex flex-column flex-shrink-0 bg-light shadow" style="width: 200px;">
        <ul class="nav flex-column mb-auto text-center">
            <li class="nav-item">
                <div class="nav-link border-bottom">
                    <button class="btn btn-primary" @click="myFileClick" style="width: 100%;" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                        <span>> 我的文件</span>
                    </button>
                    <div class="collapse" id="collapseExample">
                        <ul class="nav flex-column mb-auto text-center">
                            <li v-for="item in list" class="nav-item">
                                <div class="nav-link border-bottom">
                                    <button class="btn btn-primary" style="width: 100%;" type="button">
                                        <span>{{item}}</span>
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </li>
            <li class="nav-item">
                <div class="nav-link border-bottom">
                    <button class="btn btn-primary" style="width: 100%;" type="button">
                        <span>回收站</span>
                    </button>
                </div>
            </li>
        </ul>
    </div>
</template>
<style>
</style>