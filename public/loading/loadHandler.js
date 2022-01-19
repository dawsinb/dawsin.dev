// change text from initializing to loading after bundle is downloaded
window.addEventListener('load', () => {
  document.getElementById('progressText').innerHTML = 'loading';
});

// push assets to an array when loaded
const loadedAssets = [];
window.addEventListener('assetLoad', (event) => {
  loadedAssets.push(event.detail)
  console.log(event.detail)
});

// load asset map
fetch('/loading/assetMap.json')
  .then(response => response.json())
  .then(assetMap => {
    // calculate total bytes to load
    let totalBytes = 0;
    for (const asset in assetMap) {
      totalBytes += assetMap[asset];
    }
    console.log(assetMap)
    const processAssets = () => {
      // calculate how many bytes have been loaded
      let loadedBytes = 0;
      for (let i = 0; i < loadedAssets.length; i++) {
        loadedBytes += assetMap[loadedAssets[i]];
      }

      // update progress (special case for no assets to avoid division by zero)
      document.getElementById('progressFill').style['height'] = totalBytes !== 0 ? `${Math.min((loadedBytes / totalBytes) * 100, 100)}%` : '100%';

      // if all assets are loaded hide the load screen
      if (loadedBytes === totalBytes) {
        // hide loadscreen after short delay (delay allows progress to finish filling)
        setTimeout(function() {
          document.getElementById('loadScreen').style['pointer-events'] = 'none';
          document.getElementById('loadScreen').style['opacity'] = 0;
        }, 300);
      }
    }

    // add processAssets to push function of loadedAssets
    loadedAssets.push = function() { Array.prototype.push.apply(this, arguments); processAssets(); return loadedAssets.length; } 

    // call processAssets in case any assets were loaded before the assetmap was processed
    processAssets();
  });