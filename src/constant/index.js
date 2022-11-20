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
            copyFile: fileUrl + "/File/CopyFile",
            deleteFolder: fileUrl + "/File/DeleteFolder",
            deleteFile: fileUrl + "/File/DeleteFile",
            moveFile: fileUrl + "/File/MoveFile",
            moveFolder: fileUrl + "/File/MoveFolder",
            renameFile: fileUrl + "/File/RenameFile",
            renameFolder: fileUrl + "/File/RenameFolder",
            moveFolder: fileUrl + "/File/MoveFolder",
        }
    },
    img: {
        file: fileimg,
        ppt: pptimg,
        word: wordimg,
        excel: excelimg,
        pdf: pdfimg,
        txt: txtimg,
        img: imgimg,
        folder: folderimg,
    }
}