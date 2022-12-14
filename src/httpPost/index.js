import axios from "axios"

function posturl(url, data, config, successCallback, errorCallback) {
    if (errorCallback == undefined || errorCallback == null) {
        errorCallback = (error) => {
            console.log(error)
            ElMessage('网络异常！')
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
                ElMessage('未知返回！')
            }
        })
        .catch(errorCallback)

}

export default posturl