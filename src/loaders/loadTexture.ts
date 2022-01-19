/**
 * Custom hooks to provide utility within react components
 * @module Loaders
 * @mergeTarget
 */

import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { Texture, WebGLRenderer } from 'three';

// create loader and set path to WASM transcoder and JS wraper
const loader = new KTX2Loader();
loader.setTranscoderPath('/lib/ktx2/');
// flag whether support needs to be checked
let supportDetected = false;

// track loaded fonts so we dont fetch them multiple times
const loadedTextures: Dictionary<Texture> = {};
// track pending textures so we dont start two loads at the same time
const pendingTextures: string[] = [];
// create bus to await
const bus = new EventTarget();

function loadTexture(url: string, renderer: WebGLRenderer): Promise<Texture> {
  // detect hardware support if we haven't already
  if (!supportDetected) {
    loader.detectSupport(renderer);
    supportDetected = true;
  }

  return new Promise((resolve) => {
    // if url is already loaded just return from cache
    if (url in loadedTextures) {
      resolve(loadedTextures[url]);
    }
    // if url is already pending wait for texture to be loaded
    else if (pendingTextures.includes(url)) {
      bus.addEventListener(`${url}-loaded`, () => resolve(loadedTextures[url]), { once: true });
    }
    // otherwise load the texture
    else {
      // push url to pending list
      pendingTextures.push(url);

      // fetch the texture
      loader
        .loadAsync(url)
        .then((texture) => {
          // cache the texture
          loadedTextures[url] = texture;

          // dispatch event on bus to notify any pending listeners that the texture is available
          bus.dispatchEvent(new Event(`${url}-loaded`));
          // dispatch global event to notify the load manager that the asset is loaded and cached
          dispatchEvent(new CustomEvent('assetLoad', { detail: url }));

          resolve(loadedTextures[url]);
        })
        .catch((error) => console.error(error));
    }
  });
}

export { loadTexture };
