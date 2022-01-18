/**
 * Custom hooks to provide utility within react components
 * @module Hooks
 * @mergeTarget
 */

import { Texture, TextureLoader } from 'three';

// track loaded fonts so we dont fetch them multiple times
const loadedTextures: Dictionary<Texture> = {};

/**
 * Loads an image as a texture then executes the callback to process the texture.
 *
 * Previously loaded textures are automatically stored and fetched to avoid unnecessary network calls
 * @param url The url of the texture to be loaded
 * @param callback The callback function to use the loaded texture
 */
function useTexture(url: string, callback: (texture: Texture) => void) {
  // if already loaded just execute callback
  if (url in loadedTextures) {
    callback(loadedTextures[url]);
  }
  // otherwise load the texture and execute callback
  else {
    new TextureLoader().load(url, callback);
  }
}

export { useTexture };
