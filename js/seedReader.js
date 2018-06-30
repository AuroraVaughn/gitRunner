/*
things to set on json
json.height = number of tiles high
json.layers[0].height = number of tiles high
json.layers[0].width = number of tiles wide
json.layers[0].data = array that will be level
            number of indexes = json.layers[0].height * json.layers[0].width
            */


/*
const testarr = new Array(20)
testarr.fill([0])
testarr[testarr.length / 2][0] = 1

*/

async function constructionCompany(rubric, map, currentNode) {

  let grid = []
  map.height = currentNode.height
  map.layers[0].height = currentNode.height
  currentNode.haveBuilt = { '/': true }

  // create filled grid
  for (let i = 0; i < map.height; i++) {
    let arr = new Array(421).fill(21, 1)
    grid.push(arr)
  }
  // console.log(grid)
  const buildQueue = [currentNode]
  while (buildQueue.length > 0) {
    let nodeToBuild = buildQueue.pop()
    console.log('currentNode', nodeToBuild.children)
    builder(nodeToBuild, rubric)
    if (nodeToBuild.children.length)
      buildQueue.push(...nodeToBuild.children)

    // console.log('nodeToBuild', nodeToBuild)
  }


  // console.log('this is the grid I used to track positions: ', grid)
  //starting platform
  // console.log('currentNode.y', currentNode.endY)
  grid[currentNode.endY + 1][0] = 1
  const longestRow = grid.reduce((longest, row) => {
    longest = longest > row.length ? longest : row.length
    return longest
  }, 0)

  // grid.map(row => {
  //   while (row.length < longestRow) {
  //     row.push(21)
  //   }
  // })


  const mapArray = [].concat.apply([], grid)
  map.layers[0].height = grid.length
  map.width = grid[0].length
  map.layers[0].width = grid[0].length
  map.layers[0].data = mapArray
  // downloadObjectAsJson(map.layers[0], 'MAP_DATA')
  // console.log('GRID ##  ', grid)
  // console.log('this is the array I ended up with', mapArray)

  map.layers[0].data.map((tile, i) => {
    if (tile === null) { console.log('we got one at', i) }
  })
  const z = map.layers[0].data.filter((i) => i === 0)
  // console.log('zeros in end array', z.length)

  function downloadObjectAsJson(exportObj, exportName) {
    var dataStr = 'data:text/json;cWorkerset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', exportName + '.json');
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  function builder(currentNode, rubric) {
    let containsNull = grid.includes(null)
    if (containsNull) { throw new Error() }
    /*
    json.height = number of tiles high
    json.layers[0].height = number of tiles high
    */

    let cWorker = new ConstructionWorker(currentNode, rubric, grid)


    // don't try to refactor with array method... lost so much time to that.
    let hall = new Array(cWorker.node.hallLength)
    hall.fill('-')
    if (cWorker.node.folderName === undefined)
      console.log('', cWorker.node)

    let strArr = [...hall, ...cWorker.node.folderName.split('')]
    if (cWorker.node.heightOfChildren > 1 && currentNode.folderName !== '/') strArr.push('/')
    strArr.map(letter => {
      if (seedRubric[letter]) {

        seedRubric[letter].map(rubricOutput => {
          if (cWorker[rubricOutput]) {
            cWorker[rubricOutput](grid)

          }
        })

      }
    })

    cWorker.node.endX = cWorker.x
    cWorker.node.endY = cWorker.y
    // console.log(cWorker.node.endX)
  }
  // console.log('map.layers[0].data')
  // console.dir(map.layers[0].data)
}
