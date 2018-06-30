class ConstructionWorker {
  constructor(node, rubric, grid) {
    this.node = node
    this.rubric = rubric
    this.ceiling = node.ceiling

    if (node.prev === undefined) {
      this.x = 1
      this.y = node.target
    } else {
      this.setStartY()
      this.x = this.node.prev.endX
    }
    this.height = node.height
    this.bomb = 25
    this.cave = 10
    this.caveTile = 10
    this.deathTile = 4
    this.variance = 6  // will be used as limiter for height variations
    this.platform = 2
    this.setStartY()

    this['1'] = (grid) => {
      if (!this.node || this.node.target === undefined) {
        console.error(this.node)
        throw new Error('1 has undefined target', this.node)
      }
      if (this.y >= this.node.target) {

        grid[this.y + 2][this.x] = 0
        grid[this.y + 1][this.x] = 0
        grid[this.y][this.x] = 0
        if (this.y - 1 > 0) grid[this.y - 1][this.x] = 0
        if (this.y - 2 > 0) grid[this.y - 2][this.x] = 0
        // if (this.y - 3 > 0) grid[this.y - 3][this.x] = 0

        this.x++
        this.y -= 1
      } else {
        this.a(grid)
      }
    }

    this['2'] = (grid) => {

      if (!this.node || this.node.target === undefined) throw new Error('2 has undefined target', this.node)
      if (this.y >= this.node.target) {
        let file = this.node.files.pop()

        if (file === undefined) { file = 0 }
        file = file.length >= 24 ? this.bomb : 0
        grid[this.y + 2][this.x] = 0
        grid[this.y + 1][this.x] = 0
        grid[this.y][this.x] = 0
        if (this.y - 1 > 0) grid[this.y - 1][this.x] = 0
        if (this.y - 2 > 0) grid[this.y - 2][this.x] = file
        // if (this.y - 3 > 0) grid[this.y - 3][this.x] = 0
        this.x++
        this.y -= 2
      } else {
        this.b(grid)
      }
    }


    this.a = (grid) => {
      if (!this.node || this.node.target === undefined) {
        console.error(this)
        throw new Error('a has undefined target', this.node)
      }
      if (this.y <= this.node.target) {
        let file = this.node.files.pop()

        if (file === undefined) { file = '' }
        file = file.length > 16 ? this.bomb : 0

        grid[this.y + 2][this.x] = 0
        grid[this.y + 1][this.x] = 0
        grid[this.y][this.x] = 0
        if (this.y - 1 > 0) grid[this.y - 1][this.x] = file
        if (this.y - 2 > 0) grid[this.y - 2][this.x] = 0
        this.x++
        this.y += 1
      } else { this['1'](grid) }

    }
    this.b = (grid) => {
      // console.log(this)
      if (!this.node || this.node.target === undefined) {
        console.error(this.node)
        throw new Error('b has undefined target', this.node)
      }
      if (this.y <= this.node.target) {
        let file = this.node.files.pop()

        if (file === undefined) { file = '' }
        file = file.length > 16 ? this.bomb : 0

        grid[this.y + 2][this.x] = 0
        grid[this.y + 1][this.x] = 0
        grid[this.y][this.x] = 0
        if (this.y - 1 > 0) grid[this.y - 1][this.x] = file
        if (this.y - 2 > 0) grid[this.y - 2][this.x] = 0
        this.x++
        this.y += 2
      } else { this['2'](grid) }

    }


    this.p = (grid) => {
      let topTile = 11

      let file = this.node.files.pop()

      if (file === undefined) { file = '' }
      file = file.length > 16 ? this.bomb : 0

      // grid[this.y + 3][this.x] = 0
      grid[this.y + 2][this.x] = 0
      grid[this.y + 1][this.x] = 0
      grid[this.y][this.x] = 0
      if (this.y - 1 > 0) grid[this.y - 1][this.x] = 0
      if (this.y - 2 > 0) grid[this.y - 2][this.x] = 0

      this.x++

    }
    this['-'] = (grid) => {
      let file = this.node.files.pop()

      if (file === undefined) { file = '' }
      file = file.length > 16 ? this.bomb : 0

      grid[this.y + 2][this.x] = 0
      grid[this.y + 1][this.x] = 0
      grid[this.y][this.x] = file
      if (this.y - 1 > 0) grid[this.y - 1][this.x] = 0
      if (this.y - 2 > 0) grid[this.y - 2][this.x] = 0

      this.x++
    }
    this['='] = (grid) => {

      // grid[this.y + 4][this.x] = 0
      // grid[this.y + 3][this.x] = 0
      grid[this.y + 2][this.x] = 0
      grid[this.y + 1][this.x] = 0
      grid[this.y][this.x] = 0
      if (!isEmpty(this.y - 1)) grid[this.y - 1][this.x] = 0
      if (this.y - 2) grid[this.y - 2][this.x] = 0
      if (this.y - 3) grid[this.y - 3][this.x] = 0
      // if (this.y - 4) grid[this.y - 4][this.x] = 0

      this.x++

    }
    this['0'] = (grid) => {

      // grid[this.y + 4][this.x] = this.deathTile
      // grid[this.y + 3][this.x] = 0
      grid[this.y + 2][this.x] = 0
      grid[this.y + 1][this.x] = 0
      grid[this.y][this.x] = 0
      if (this.y - 1 > 0) grid[this.y - 1][this.x] = 0
      if (this.y - 2 > 0) grid[this.y - 2][this.x] = 0
      // if (this.y - 3 > 0) grid[this.y - 3][this.x] = 0
      // if (this.y - 4 > 0) grid[this.y - 4][this.x] = 0


      this.x++

      this.connect(grid)
    }
    this.connect = grid => {

      if (this.y > this.target) {
        this.up(grid)
      } else if (this.y < this.target) {
        this.down(grid)
      } else {
        this.horizontal(grid)
      }

    }

    this.up = (grid) => {


    }
    this.down = (grid) => {


    }
    this.horizontal = (grid) => {


    }

    this['/'] = (grid) => {
      const roomHeight = !this.node.root ? this.node.roomHeight : this.node.root.roomHeight
      const numberOfChildren = this.node.children.length

      setStartPoints(this.node, this.node.children, this.y, roomHeight)
      const topOfRoom = Math.floor(roomHeight * numberOfChildren / -2)
      // console.log('/ construction worker', this.node)

      //clear the blocks in the folder /
      for (let x = 0; x < 8; x++) {// x movement
        for (let y = topOfRoom; y < topOfRoom * -1; y++) {
          grid[this.y + y][this.x + x] = 0
        }
      }

      // build ledges in folder
      const leftInterval = 2
      const rightInterval = 5
      const yMod = 6
      for (let x = 0; x < 8; x++) {// x movement
        for (let y = topOfRoom; y < -topOfRoom; y++) {
          if (this.y + y > 0) {
            if ((Math.abs(y) % yMod === leftInterval &&
              (Math.abs(x) % 8 === 1 || Math.abs(x) % 8 === 2
              ))) {
              grid[this.y + y][this.x] = this.caveTile
            }
            else if (((Math.abs(y) % yMod === rightInterval || y === 0) &&
              (Math.abs(x) % 8 === 5 || Math.abs(x) % 8 === 6))) {
              grid[this.y + y][this.x] = this.caveTile
            }
          }
        }
        this.x++
      }

      this.node.endX = this.x
      this.node.endY = this.y

    }
  }


  get mid() {
    return Math.floor(this.height / 2) + this.node.ceiling
  }

  getTarget() {
    // if (this.y === undefined) this.setStartY()
    if (this.node.target !== undefined) {
      return this.target
    } else if (this.node.children.length === 0) {
      this.target = this.y
    } else { throw new Error('No target on node', this.node) }
  }

  setStartY() {

    let initialPosition = this.node.startY !== undefined ? this.node.startY : this.node.mid

    this.y = Math.floor(initialPosition)
  }
}


function isEmpty(tile) {
  return tile === 0 || undefined
}

function sortChildren(parent) {
  const { children } = parent

  if (children.length > 1) children.sort(compare)
  return children

  function compare(a, b) {
    return a.target - b.target
  }
}

function setStartPoints(parent, children, endY, roomHeight) {
  if (children.length > 0) {
    const sortedChildren = sortChildren(parent)
    roomHeight = roomHeight || 10
    const totalLess = countOfTargetsLessThanEndY(endY, sortedChildren)
    // start is the top most point to begin making starting points.
    // totalLess - 1 means if there are more that are less, the one
    // even with endY will be lessthan
    let start = totalLess > Math.floor(sortedChildren.length / 2) ?
      -(totalLess - 1) * roomHeight : -(totalLess) * roomHeight
    let length = totalLess
    sortedChildren.forEach((child, i) => {
      child.startY = endY + start
      start += roomHeight
      child.hallLength = Math.abs(length - i) + 1
    });
  }
}

function countOfTargetsLessThanEndY(endY, children) {
  let arr = children.filter(child => {
    return endY >= child.target
  })
  return arr.length
}

