/**
 * Custom hooks to provide utility within react components
 * @module Loaders
 * @mergeTarget
 */

import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
 

// create loader and set path to WASM transcoder and JS wraper
const loader = new FontLoader();

// track loaded fonts so we dont fetch them multiple times
const loadedFonts: Dictionary<Font> = {};
// track pending fonts so we dont start two loads at the same time
const pendingFonts: string[] = [];
// create bus to await 
const bus = new EventTarget();

function loadFont(url: string): Promise<Font> {
  return new Promise(resolve => {
    // if url is already loaded just return from cache
    if (url in loadedFonts) {
      resolve(loadedFonts[url]);
    }
    // if url is already pending wait for fonts to be loaded
    else if (pendingFonts.includes(url)) {
      bus.addEventListener(`${url}-loaded`, () => resolve(loadedFonts[url]), { once: true });
    }
    // otherwise load the font
    else {
      // push url to pending list
      pendingFonts.push(url)

      // fetch the font
      loader.loadAsync(url).then(geometry => {
        // cache the font
        loadedFonts[url] = geometry;

        // dispatch event on bus to notify any pending listeners that the font is available
        bus.dispatchEvent(new Event(`${url}-loaded`));
        // dispatch global event to notify the load manager that the asset is loaded and cached
        dispatchEvent(new CustomEvent('assetLoad', { detail: url }));

        resolve(loadedFonts[url]);
      })
      .catch(error => console.error(error))
    }
  })
}

export { loadFont };