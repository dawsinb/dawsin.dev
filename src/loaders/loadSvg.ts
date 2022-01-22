/**
 * Custom hooks to provide utility within react components
 * @module Loaders
 * @mergeTarget
 */

import { ShapeBufferGeometry } from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
// create loader and set path to WASM transcoder and JS wraper
const loader = new SVGLoader();

// track loaded SVGs so we dont fetch them multiple times
const loadedSvgs: Dictionary<ShapeBufferGeometry> = {};
// track pending SVGs so we dont start two loads at the same time
const pendingSvgs: string[] = [];
// create bus to await
const bus = new EventTarget();

function loadSvg(url: string): Promise<ShapeBufferGeometry> {
  return new Promise((resolve) => {
    // if url is already loaded just return from cache
    if (url in loadedSvgs) {
      resolve(loadedSvgs[url]);
    }
    // if url is already pending wait for SVG to be loaded
    else if (pendingSvgs.includes(url)) {
      bus.addEventListener(`${url}-loaded`, () => resolve(loadedSvgs[url]), { once: true });
    }
    // otherwise load the SVG
    else {
      // push url to pending list
      pendingSvgs.push(url);

      // fetch the SVG
      loader
        .loadAsync(url)
        .then(({ paths }) => {
          // create shapes from paths
          const shapes = paths.flatMap((path) => path.toShapes(true));
          // create geometry from shapes
          const geometry = new ShapeBufferGeometry(shapes, 12);
          geometry.center();
          // cache the SVG geometry
          loadedSvgs[url] = geometry;

          // dispatch event on bus to notify any pending listeners that the SVG is available
          bus.dispatchEvent(new Event(`${url}-loaded`));
          // dispatch global event to notify the load manager that the asset is loaded and cached
          dispatchEvent(new CustomEvent('assetLoad', { detail: url }));

          resolve(loadedSvgs[url]);
        })
        .catch((error) => console.error(error));
    }
  });
}

export { loadSvg };
