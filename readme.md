git API

https://api.github.com/repos/${owner}/${repoName}/commits
Returns an array of objects that are commits. 
[0].sha = string version of sha
sha is the ID for a specific git

https://api.github.com/repos/${owner}/${repoName}/git/trees/${sha}?recursive=1
Returns an object with an array tree.
Tree is an array of objects. 
The objects look like this:  
{
            "path": ".babelrc",
            "mode": "100644",
            "type": "blob",
            "sha": "0fe3e358294e0f5f61cfc9a81e1e1b62fa4707a6",
            "size": 1415,
            "url": "https://api.github.com/repos/Team-PiRoutes/pet-costumes/git/blobs/0fe3e358294e0f5f61cfc9a81e1e1b62fa4707a6"
        }

response.tree[0].path  will be the file path of the first file in the root folder
IDENTIFYING FOLDERS - folders have type of tree, while other files have type blob


JSON FORMATTED TILE MAPS    
{ "height":20,
 "layers":[
        {
         "data":[],
         "height":20,
         "name":"Tile Layer 1", // name to put in    this.layer = this.map.createLayer('Tile Layer 2')
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":50,
         "x":0,
         "y":0
        }, 
        {
         "data":[],  // comma seperated integers representing which tile in tile set should be here. length is from map size row tiles *                        height of tiles. 
         "height":20,
         "name":"Tile Layer 2",  // name to put in    this.layer = this.map.createLayer('Tile Layer 2')
         "opacity":1,
         "type":"tilelayer",
         "visible":false,
         "width":50,
         "x":0,
         "y":0
        }],
 "nextobjectid":1,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tileheight":64,
 "tilesets":[
        {
         "columns":6,
         "firstgid":1,
         "image":"..\/images\/tiles.png",
         "imageheight":384,
         "imagewidth":448,
         "margin":0,
         "name":"tiles",
         "spacing":6,
         "tilecount":30,
         "tileheight":64,
         "tilewidth":64
        }],
 "tilewidth":64,
 "version":1,
 "width":50
}


things to set on json
json.height = number of tiles high
json.layers[0].height = number of tiles high
json.layers[0].width = number of tiles wide
json.layers[0].data = array that will be level
            number of indexes = json.layers[0].height * json.layers[0].width

Map height  Height - depth
map width   root.longestPath * longest array on rubric
connector height. 
# gitRunner
