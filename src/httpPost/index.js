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
            }
            
            successCallback(e)
        })
        .catch(errorCallback)

}

export default posturl