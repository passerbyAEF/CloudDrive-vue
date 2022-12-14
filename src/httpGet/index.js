import axios from "axios"

function geturl(url, config, successCallback, errorCallback) {
    if (errorCallback == undefined || errorCallback == null) {
        errorCallback = (error) => {
            console.log(error)
            ElMessage('网络异常！')
        }
    }
    axios.get(url, config)
        .then((e) => {
            e = e.data
            if (e.status == 303) {
                window.location.replace(e.data)
            } else if (e.status == 500) {
                ElMessage('发生错误，请刷新页面重试！')
            } else if (e.status == 200) {
                successCallback(e)
            } 
        })
        .catch(errorCallback)

}

export default geturl