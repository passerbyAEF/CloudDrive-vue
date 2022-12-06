import fileimg from 'Main@/assets/icons/fileicon.png'
import pptimg from 'Main@/assets/icons/ppticon.png'
import wordimg from 'Main@/assets/icons/wordicon.png'
import excelimg from 'Main@/assets/icons/excelicon.png'
import pdfimg from 'Main@/assets/icons/pdficon.png'
import txtimg from 'Main@/assets/icons/txticon.png'
import imgimg from 'Main@/assets/icons/imgicon.png'
import folderimg from 'Main@/assets/icons/foldericon.png'

let authUrl = "/api/auth"
let fileUrl = "/api/appMain"






export default {
    url: {
        auth: {
            login: authUrl + "/login",
            register: authUrl + "/register",
        },
        file: {
            getRoot: fileUrl + "/File/GetRoot",
            list: fileUrl + "/File/List",

            createFolder: fileUrl + "/File/CreateFolder",
            copyFolder: fileUrl + "/File/CopyFolder",
            deleteFolder: fileUrl + "/File/DeleteFolder",
            moveFolder: fileUrl + "/File/MoveFolder",
            renameFolder: fileUrl + "/File/RenameFolder",

            uploadFile: fileUrl + "/File/Upload",
            copyFile: fileUrl + "/File/CopyFile",
            deleteFile: fileUrl + "/File/DeleteFile",
            moveFile: fileUrl + "/File/MoveFile",
            renameFile: fileUrl + "/File/RenameFile",
        }
    },
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
            return fileimg
        } else if (imgreg.test(filename)) {
            return imgimg
        }
        return fileimg
    }
}