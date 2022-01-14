import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

// track loaded fonts so we dont fetch them multiple times
const loadedFonts = {};

function useFont(url, callback) {
  // if already loaded just execute callback
  if (url in loadedFonts) {
    callback(loadedFonts[url]);
  }
  // otherwise load font and execute callback
  else {
    fetch(url)
      .then((response) => response.json())
      .then((fontGeometry) => {
        loadedFonts[url] = new FontLoader().parse(fontGeometry);
        dispatchEvent(new CustomEvent('assetLoad', { detail: url }));

        callback(loadedFonts[url]);
      });
  }
}

export default useFont;
