// generates an asset map (assetMap.json in /src) to handle load progress
// should be run before build

// imports
const fs = require('fs');
const path = require("path");

// get args (names of directories)
const args = process.argv.slice(2);
// get base path
const basePath = path.join(__dirname, "public");

// generate asset map of all files in each given directory
let assetMap = {};
args.forEach(directory => {
  assetMap = getAllFiles(path.join(basePath, directory), assetMap);
})

// write asset map
fs.writeFileSync(path.join(basePath, "assetMap.json"), JSON.stringify(assetMap));

// recursively gets all files of the given directory and updates the asset map with the size of each file
function getAllFiles(dirPath, assetMap) {
  // loop through all files of current directory
  fs.readdirSync(dirPath).forEach(function(file) {
    // get path of file
    const filePath = path.join(dirPath, file);

    // if file is a directory recurse
    if (fs.statSync(filePath).isDirectory()) {
      assetMap = getAllFiles(filePath, assetMap)
    } 
    // else add file to asset map
    else {
      // get size of the file
      const size = fs.statSync(filePath).size;

      // get relative path of file by removing the base url and standardize to use forward slash
      let relativePath = path.join(dirPath, file).replace(basePath, "");
      relativePath = relativePath.replace(/\\/g, "/");

      // add file to the asset map
      assetMap[relativePath] = size;
    }
  })

  return assetMap
}