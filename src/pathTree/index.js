class PathTreeNode {
    constructor(name) {
        this.name = name
        this.children = []
        this.fileObject = null
    }

    findName(name) {
        for (let index = 0; index < this.children.length; index++) {
            if (this.children[index].name == name) {
                return index
            }
        }
        return -1;
    }

    addChildren(path, fileObject) {
        if (path.constructor == String) {
            if (path.at(0) == '/') {
                path = path.substring(1, path.length)
            }
            path = path.split('/')
        }
        if (path.length == 1) {
            let node = new PathTreeNode(fileObject.name)
            node.fileObject = fileObject
            this.children.push(node)
            return
        }

        let index = this.findName(path[0])
        if (index == -1) {
            let node = new PathTreeNode(path[0])
            index = this.children.push(node) - 1
        }
        path.splice(0, 1)
        this.children[index].addChildren(path, fileObject)

        // //搜索同名
        // for (const item of this.children) {
        //     if (item.name == path) {
        //         if (i < pathStr.length && item.isFolder) {
        //             //存在同名文件夹，进入
        //             item.addChildren(pathStr.substr(i + 1), fileObject)
        //         }
        //         return
        //     }
        // }

        // let newnode = new PathTreeNode(path, i != pathStr.length)
        // this.children.push(newnode)
        // //还存在下级，进入
        // if (i < pathStr.length) {
        //     newnode.addChildren(pathStr.substr(i + 1), fileObject)
        // } else {
        //     newnode.fileObject = fileObject;
        // }
    }
}
export default PathTreeNode