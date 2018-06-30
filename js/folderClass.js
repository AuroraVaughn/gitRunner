class Folder {
  constructor(rootDir, currentNode, currentPath, folderName) {
    this.root = rootDir
    this.prev = currentNode
    this.folderName = folderName || '-'
    this.children = []
    this.files = []
    this.path = currentPath
    this.heightOfChildren = 0
    this.ceiling = undefined
    this.floor = undefined
    this.target = undefined
    this.endX = 0
    this.endY = 0

  }
  get height() {
    return this.floor - this.ceiling
  }

  get mid() {
    // half height + ceiling
    return ((this.floor - this.ceiling) / 2) + this.ceiling
  }


}
