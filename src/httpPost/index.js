import axios from "axios"

function posturl(url, data, config, successCallback, errorCallback,otherCallback) {
    if (errorCallback == undefined || errorCallback == null) {
        errorCallback = (error) => {
            console.log(error)
            ElMessage('网络异常！')
        }
    }
    if(otherCallback == undefined || otherCallback == null){
        otherCallback=(e)=>{
            console.log(e)
            ElMessage('未知返回！')
        }
    }
    axios.post(url, data, config)
        .then((e) => {
            e = e.data
            if (e.status == 303) {
                window.location.replace(e.data)
            } else if (e.status == 500) {
                ElMessage('发生错误，请刷新页面重试！')
            } else if (e.status == 200) {
                successCallback(e)
            } else {
                otherCallback(e)
            }
        })
        .catch(errorCallback)

}

export default posturl