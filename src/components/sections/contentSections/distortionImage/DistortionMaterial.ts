/**
 * Content sections with html text and an image
 * @module Components/Sections/ContentSections
 * @mergeTarget
 */

/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ShaderMaterial, Vector2, GLSL3, Texture } from 'three';

/** Creates distortion effect centered at mouse position */
class DistortionMaterial extends ShaderMaterial {
  constructor() {
    super({
      glslVersion: GLSL3,
      uniforms: {
        effectFactor: { value: 0 },
        scrollFactor: { value: 0 },
        mousePosition: { value: new Vector2(0, 0) },
        direction: { value: new Vector2(0, 0) },
        imageTexture: { value: undefined },
        displacementIntensity: { value: 10.0 },
        distortionIntensity: { value: 0.1 },
        scrollIntensity: { value: 1.0 },
        scrollDisplacementIntensity: { value: 0.0 }
      },
      vertexShader: /* glsl */ `
        uniform float effectFactor;
        uniform vec2 mousePosition;
        uniform float displacementIntensity;
        uniform float scrollFactor;
        uniform float scrollIntensity;
        uniform float scrollDisplacementIntensity;
        varying vec2 vUv;
        varying float distanceFactor;
        void main() {
          vUv = uv;

          // create circular distance factor
          distanceFactor = pow(cos(distance(mousePosition, uv) * 3.14159265) / 2.0 + 0.5, 10.0);
          distanceFactor = distanceFactor * effectFactor;

          // distort uv based on mouse position
          vec3 pos = position;
          if (uv.y > 0.5) {
            pos.y = pos.y + (distanceFactor * displacementIntensity);
          }
          else {
            pos.y = pos.y - (distanceFactor * displacementIntensity);
          }
          if (uv.x > 0.5) {
            pos.x = pos.x + (distanceFactor * displacementIntensity);
          }
          else {
            pos.x = pos.x - (distanceFactor * displacementIntensity);
          }
          // add scroll distortion
          pos.y = pos.y + (sin(uv.x * 3.1415926535897932384626433832795) * -scrollFactor * scrollIntensity * scrollDisplacementIntensity);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4( pos , 1.0 );
        
        }`,
      fragmentShader: /* glsl */ `
        uniform float effectFactor;
        uniform float scrollFactor;
        uniform vec2 mousePosition;
        uniform vec2 direction;
        uniform sampler2D imageTexture;
        uniform float distortionIntensity;
        uniform float scrollIntensity;
        varying vec2 vUv;
        varying float distanceFactor;
        out vec4 fragColor;
        void main() {
          // get uv from the vertex shaders
          vec2 uv = vUv;
          // calculate distortion
          float distortion = distanceFactor * distortionIntensity;
          
          // claculate uv's from displacement and direction
          vec2 uvR = uv + (distortion * direction);
          vec2 uvG = uv;
          vec2 uvB = uv - (distortion * direction);
          // add scroll offset to uvs
          uvR.y = uvR.y + (scrollFactor * scrollIntensity);
          uvB.y = uvB.y - (scrollFactor * scrollIntensity);
          // get prev and current image based on indicies
          float imageR = texture2D(imageTexture, uvR).r;
          float imageG = texture2D(imageTexture, uvG).g;
          float imageB = texture2D(imageTexture, uvB).b;
          // mix prev and current image based on effectFactor
          vec4 finalTexture = vec4(imageR, imageG, imageB, 1.0);
          // apply noise to final texture
          fragColor = finalTexture;
        }`
    });
  }

  get effectFactor(): number {
    return this.uniforms.effectFactor.value;
  }
  set effectFactor(v: number) {
    this.uniforms.effectFactor.value = v;
  }
  get scrollFactor(): number {
    return this.uniforms.scrollFactor.value;
  }
  set scrollFactor(v: number) {
    this.uniforms.scrollFactor.value = v;
  }
  get mousePosition(): Vector2 {
    return this.uniforms.mousePosition.value;
  }
  set mousePosition(v: Vector2) {
    this.uniforms.mousePosition.value = v;
  }
  get direction(): Vector2 {
    return this.uniforms.direction.value;
  }
  set direction(v: Vector2) {
    this.uniforms.direction.value = v;
  }
  get imageTexture(): Texture {
    return this.uniforms.imageTexture.value;
  }
  set imageTexture(v: Texture) {
    this.uniforms.imageTexture.value = v;
  }
  get displacementIntensity(): number {
    return this.uniforms.displacementIntensity.value;
  }
  set displacementIntensity(v: number) {
    this.uniforms.displacementIntensity.value = v;
  }
  get distortionIntensity(): number {
    return this.uniforms.distortionIntensity.value;
  }
  set distortionIntensity(v: number) {
    this.uniforms.distortionIntensity.value = v;
  }
  get scrollIntensity(): number {
    return this.uniforms.scrollIntensity.value;
  }
  set scrollIntensity(v: number) {
    this.uniforms.scrollIntensity.value = v;
  }
  get scrollDisplacementIntensity(): number {
    return this.uniforms.scrollDisplacementIntensity.value;
  }
  set scrollDisplacementIntensity(v: number) {
    this.uniforms.scrollDisplacementIntensity.value = v;
  }
}

export { DistortionMaterial };
