import fileimg from 'Main@/assets/icons/fileicon.png'
import pptimg from 'Main@/assets/icons/ppticon.png'
import wordimg from 'Main@/assets/icons/wordicon.png'
import excelimg from 'Main@/assets/icons/excelicon.png'
import pdfimg from 'Main@/assets/icons/pdficon.png'
import txtimg from 'Main@/assets/icons/txticon.png'
import imgimg from 'Main@/assets/icons/imgicon.png'
import folderimg from 'Main@/assets/icons/foldericon.png'

let authUrl = "/api/auth"
let mainUrl = "/api/appMain"
let fileUrl = "/api/file"

export default {
    url: {
        auth: {
            login: authUrl + "/login",
            register: authUrl + "/register",
            loginOut: authUrl + "/loginOut",
            isAdmin: authUrl + "/isAdmin"
        },
        file: {
            getRoot: mainUrl + "/File/GetRoot",
            list: mainUrl + "/File/List",
            screeList: mainUrl + "/File/ScreeList",
            getStorage: mainUrl + "/File/GetStorage",
            getMaxStorage: mainUrl + "/File/GetMaxStorage",

            createFolder: mainUrl + "/File/CreateFolder",
            copyFolder: mainUrl + "/File/CopyFolder",
            deleteFolder: mainUrl + "/File/DeleteFolder",
            moveFolder: mainUrl + "/File/MoveFolder",
            renameFolder: mainUrl + "/File/RenameFolder",

            uploadFile: mainUrl + "/File/Upload",
            copyFile: mainUrl + "/File/CopyFile",
            deleteFile: mainUrl + "/File/DeleteFile",
            moveFile: mainUrl + "/File/MoveFile",
            renameFile: mainUrl + "/File/RenameFile",
            getDownloadId: mainUrl + "/File/Download",
            getDownloadflag: mainUrl + "/File/GetDownloadFlag",

            uploadFilePart: fileUrl + "/File/Upload",
            downloadFile: fileUrl + "/File/Download",
        },
        recycle: {
            list: mainUrl + "/Recycle/RecycleList",
            recovery: mainUrl + "/Recycle/Recovery",
            delete: mainUrl + "/Recycle/Delete",
        },
        share: {
            external: {
                list: mainUrl + "/Share" + "/List",
                checkSecretKey: mainUrl + "/Share" + "/Check",
                getEntityId: mainUrl + "/Share" + "/getEntityId",
                downloadShareFile: mainUrl + "/Share" + "/Download",
            },
            list: mainUrl + "/Share/Control" + "/List",
            create: mainUrl + "/Share/Control" + "/Create",
            update: mainUrl + "/Share/Control" + "/Update",
            delete: mainUrl + "/Share/Control" + "/Delete",
        }
    },
    enum: {
        viewFlag: {
            Main: 1,
            Recycle: 2,
            Scree: {
                img: 30,
                text: 31,
                video: 32,
                audio: 33,
                outer: 34,
            },
            Share: 4,
        }
    },
    method: {
        getImg: function (n) {
            if (n.type == 0) return folderimg
            let filename = n.name.toLowerCase()

            let pptreg = /\.(ppt|pptx)$/
            let wordreg = /\.(doc|docx)$/
            let excelreg = /\.(xls|xlsx)$/
            let pdfreg = /\.(pdf)$/
            let txtreg = /\.(txt)$/
            let imgreg = /\.(bmp|jpg|jpeg|png|gif)$/

            if (pptreg.test(filename)) {
                return pptimg
            } else if (wordreg.test(filename)) {
                return wordimg
            } else if (excelreg.test(filename)) {
                return excelimg
            } else if (pdfreg.test(filename)) {
                return pdfimg
            } else if (txtreg.test(filename)) {
                return txtimg
            } else if (imgreg.test(filename)) {
                return imgimg
            }
            return fileimg
        },
        getStorage: function (data) {
            if (data > 1024 * 1024 * 1024) {
                return (data / (1024 * 1024 * 1024)).toFixed(2) + "GB";
            }
            if (data > 1024 * 1024) {
                return (data / (1024 * 1024)).toFixed(2) + "MB";
            }
            if (data > 1024) {
                return (data / 1024).toFixed(2) + "KB";
            }
            return "0KB"
        },
        GetQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
            var context = "";
            if (r != null)
                context = decodeURIComponent(r[2]);
            reg = null;
            r = null;
            return context == null || context == "" || context == "undefined" ? "" : context;
        }
    }
}