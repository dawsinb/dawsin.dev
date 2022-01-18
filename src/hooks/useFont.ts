/**
 * Custom hooks to provide utility within react components
 * @module Hooks
 * @mergeTarget
 */

import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

// track loaded fonts so we dont fetch them multiple times
const loadedFonts: Dictionary<Font> = {};

/**
 * Loads a 3d font of the given url then executes the callback to process the font.
 *
 * Previously loaded fonts are automatically stored and fetched to avoid unnecessary network calls
 * @param url The url of the font to be loaded
 * @param callback The callback function to use the loaded font
 */
function useFont(url: string, callback: (font: Font) => void) {
  // if already loaded just execute callback
  if (url in loadedFonts) {
    callback(loadedFonts[url]);
  }
  // otherwise load font and execute callback
  else {
    fetch(url)
      .then((response) => response.json())
      .then((fontJson) => {
        loadedFonts[url] = new FontLoader().parse(fontJson);
        dispatchEvent(new CustomEvent('assetLoad', { detail: url }));

        callback(loadedFonts[url]);
      })
      .catch((error) => console.log(error));
  }
}

export { useFont };
