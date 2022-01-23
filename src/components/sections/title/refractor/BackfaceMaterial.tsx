/**
 * Components used for the title section of the app
 * @module Components/Sections/Title
 * @mergeTarget
 */

import { ShaderMaterial, BackSide } from 'three';

/** Shader used by {@link Refractor} for rendering cube backfaces */
class BackfaceMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader: /* glsl */ `
        varying vec3 worldNormal;
        void main() {
          vec4 transformedNormal = vec4(normal, 0.);
          vec4 transformedPosition = vec4(position, 1.0);
          worldNormal = normalize(modelViewMatrix * transformedNormal).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * transformedPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 worldNormal;
        void main() {
          gl_FragColor = vec4(worldNormal, 1.0);
        }
      `,
      side: BackSide
    });
  }
}

export { BackfaceMaterial };
