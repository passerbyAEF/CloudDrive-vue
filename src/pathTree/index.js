class PathTreeNode {
    constructor(name, isFolder) {
        this.name = name
        this.children = []
        this.isFolder = isFolder
        this.fileObject = null
    }

    addChildren(pathStr, fileObject) {
        let i = pathStr.indexOf('/')
        if (i == -1) {
            i = pathStr.length
        }
        let path = pathStr.substr(0, i)

        //搜索同名
        for (const item of this.children) {
            if (item.name == path) {
                if (i < pathStr.length && item.isFolder) {
                    //存在同名文件夹，进入
                    item.addChildren(pathStr.substr(i + 1), fileObject)
                }
                return
            }
        }

        let newnode = new PathTreeNode(path, i != pathStr.length)
        this.children.push(newnode)
        //还存在下级，进入
        if (i < pathStr.length) {
            newnode.addChildren(pathStr.substr(i + 1), fileObject)
        } else {
            newnode.fileObject = fileObject;
        }
    }
}
export default PathTreeNode