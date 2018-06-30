const getMapObj = () => {
  return {
    height: 20,
    infinite: false,
    layers: [
      {
        data: [
          0
        ],
        height: 1,
        name: 'Tile Layer 1',
        opacity: 1,
        type: 'tilelayer',
        visible: true,
        width: 1,
        x: 0,
        y: 0
      }
    ],
    nextobjectid: 1,
    orientation: 'orthogonal',
    renderorder: 'right-down',
    tiledversion: '1.1.3',
    tileheight: 64,
    tilesets: [
      {
        columns: 6,
        firstgid: 1,
        image: '..\/images\/tiles.png',
        imageheight: 384,
        imagewidth: 448,
        margin: 0,
        name: 'tiles',
        spacing: 6,
        tilecount: 30,
        tileheight: 64,
        tilewidth: 64
      }
    ],
    tilewidth: 64,
    type: 'map',
    version: 1,
    width: 1
  }
}
