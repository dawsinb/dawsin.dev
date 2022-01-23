/**
 * Loaders to handle the loading of assets; these loaders cache assets to prevent wasteful re-computations
 * @module Loaders
 * @mergeTarget
 */

import { BufferGeometry } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

// create loader and set path to WASM transcoder and JS wraper
const loader = new DRACOLoader();
loader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/');
loader.preload();

// track loaded geometries so we dont fetch them multiple times
const loadedGeometries: Dictionary<BufferGeometry> = {};
// track pending geometries so we dont start two loads at the same time
const pendingGeometries: string[] = [];
// create bus to await
const bus = new EventTarget();

/**
 * Loads a geometry from a compressed Draco mesh
 * @param url the url of the draco file
 * @returns a promise which resolves to a geometry decoded from the draco file
 */
function loadGeometry(url: string): Promise<BufferGeometry> {
  return new Promise((resolve) => {
    // if url is already loaded just return from cache
    if (url in loadedGeometries) {
      resolve(loadedGeometries[url]);
    }
    // if url is already pending wait for geometry to be loaded
    else if (pendingGeometries.includes(url)) {
      bus.addEventListener(`${url}-loaded`, () => resolve(loadedGeometries[url]), { once: true });
    }
    // otherwise load the geometry
    else {
      // push url to pending list
      pendingGeometries.push(url);

      // fetch the geometry
      loader
        .loadAsync(url)
        .then((geometry) => {
          // cache the geometry
          loadedGeometries[url] = geometry;

          // dispatch event on bus to notify any pending listeners that the geometry is available
          bus.dispatchEvent(new Event(`${url}-loaded`));
          // dispatch global event to notify the load manager that the asset is loaded and cached
          dispatchEvent(new CustomEvent('assetLoad', { detail: url }));

          resolve(loadedGeometries[url]);
        })
        .catch((error) => console.error(error));
    }
  });
}

export { loadGeometry };
