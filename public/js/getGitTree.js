const repo = 'https://github.com/facebook/react'
// const repo = 'https://github.com/Team-PiRoutes/pet-costumes'




// let gameSeed = readyGameSeed(repo)
async function getGitTree(repo) {

  let finished = await getSeed(repo)

  return finished

  async function getSeed(repo) {
    try {
      /* git hub calls.  */
      const useLocals = true
      let tree;
      if (!useLocals) {
        try {
          console.log('retrieving repo from github')
          const sha = await getShaOfMaster(repo)
          console.log('sha - ', sha)
          tree = await getTreeOfRepo(repo, sha)

          // downloadObjectAsJson(tree, 'repoResults')
        } catch (err) { console.error(err) }
      } else {
        /* local cache used because of github rate limit */
        console.log('using local cache')
        tree = getRepoDataLocal()
      }
      let output = await createFileTree(tree)
      setAllDimensions(output)
      setTargets(output)
      output.root = output
      return output
    } catch (err) {
      console.error(err)
    }
  }
}

function createFileTree(tree) {
  const fileTree = {
    target: 0,
    haveBuilt: { '/': true },
    path: '/',
    folderName: '/',
    root: this,
    node: this,
    roomHeight: 16,
    totalFolders: 1,
    longestFolderName: 4,
    longestFileName: 0,
    depth: 0,
    deepest: 0,
    heightOfChildren: 0,
    previousNodeHeight: 0,
    current_path: '/',
    children: [],
    files: [],
    ceiling: 0,
    hallLength: 0,
    get mid() {
      // half height + ceiling
      if (typeof this.floor === 'number' && typeof this.ceiling === 'number') {
        return ((Math.ceil(this.floor - this.ceiling) / 2) + this.ceiling)
      } else {
        console.error(`in folder ${this.pathStr} attempted to access mid but this.ceiling or
       this.floor was not defined, floor: ${this.floor}, ceiling: ${this.ceiling} `)
      }
    },
    get floor() {
      let padding = 1.4
      return Math.ceil(this.roomHeight * this.heightOfChildren * padding)
    },
    get width() {
      return this.deepest * this.longestFolderName
    },
    get height() {
      return this.floor - this.ceiling
    }
  }

  tree.forEach(file => {
    if (file.path[0] !== '.') {
      buildTreeWithMetaData(fileTree, file, file.path)
    }
  })

  return fileTree
}
async function getShaOfMaster(repo) {
  try {
    let [owner, repoName] = repo

    return axios.get(`https://api.github.com/repos/${owner}/${repoName}/commits`)
      .then(res => res.data[0].sha)
  } catch (err) { console.error(err) }
}
async function getTreeOfRepo(repo, sha) {
  try {
    let [owner, repoName] = repo
    return axios.get(`https://api.github.com/repos/${owner}/${repoName}/git/trees/${sha}?recursive=1`)
      .then(res => res.data.tree).catch(console.error)
  } catch (err) { console.error(err) }
}

function buildTreeWithMetaData(rootDir, file, pathStr) {
  // I moved this all into one function because I believed I had an error with the order
  //of folderNames being retrieved from the object. I did not, but putting it back would likely
  //have taken longer that maintaining it for the duration of this project.
  if (rootDir == undefined || file == undefined || pathStr == undefined) throw new Error('buildtree got falsy')
  const folders = pathStr.split('/')
  let fileName,
    depth = 0,
    isFolder = file.type === 'tree'

  if (!isFolder) fileName = folders.pop()



  let currentNode = rootDir

  while (folders.length > 0) {
    folderName = folders.shift()
    depth++

    rootDir.longestFolderName = folderName.length > rootDir.longestFolderName ?
      folderName.length : rootDir.longestFolderName


    //is folder and next folder does not exist
    if (isFolder && retrieveChild(folderName, currentNode.children) === undefined) {
      if (depth > rootDir.deepest) rootDir.deepest = depth
      let currentPath = currentNode.path === "/" ? currentNode.path + folderName :
        currentNode.path + "/" + folderName
      currentNode.children.push(new Folder(rootDir, currentNode, currentPath, folderName))

    }

    else if (isFolder) {
      if (depth > rootDir.deepest) rootDir.deepest = depth
      currentNode.heightOfChildren++
      currentNode = retrieveChild(folderName, currentNode.children)
    }

    else if (retrieveChild(folderName, currentNode.children) === undefined) {

      if (currentNode.children.length > 1) currentNode.heightOfChildren++

      currentNode.children.push(new Folder(rootDir, currentNode, currentNode.current_path))

    } else {

      currentNode = retrieveChild(folderName, currentNode.children)
    }
    if (fileName !== undefined) {
      currentNode.files.push(fileName)
    }

  }

}


function setAllDimensions(node, iter = true) {
  try {
    let currentNode = node
    let lastCeilingValue = currentNode.ceiling

    for (let i = 0; i < currentNode.children.length; i++) {
      let child = currentNode.children[i]
      let height = child.heightOfChildren > 0 ? child.heightOfChildren * child.root.roomHeight :
        child.root.roomHeight * 1
      child.ceiling = lastCeilingValue

      child.floor = height + child.ceiling
      lastCeilingValue = child.floor

      setAllDimensions(currentNode.children[i], false)
    }
  } catch (err) {
    console.error(err)
    throw err
  }

}

function setTargets(node, i = true) {
  try {

    let children = node.children
    if (children.length > 0) {
      node.target = Math.floor(children.reduce((target, child) => {
        return target + child.mid
      }, node.mid) / children.length)

      for (let i = 0; i < children.length; i++) {
        setTargets(children[i], false)
      }
    } else {

      node.target = node.prev.target
    }

  } catch (err) {
    console.error(err)
    throw err
  }
}
function retrieveChild(childName, childrenArray) {
  return childrenArray.find(child => {
    return child.folderName === childName
  })
}