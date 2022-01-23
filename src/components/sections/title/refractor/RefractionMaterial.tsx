/**
 * Components used for the title section of the app
 * @module Components/Sections/Title
 * @mergeTarget
 */

import { ShaderMaterial, Texture } from 'three';

/** Parameters for {@link RefractionMaterial} */
interface RefractionMaterialParams {
  envMap: Texture;
  backfaceMap: Texture;
  resolution: number[];
}
/** Shader for {@link Refractor} to calculate light refraction through an object */
class RefractionMaterial extends ShaderMaterial {
  constructor({ envMap, backfaceMap, resolution }: RefractionMaterialParams) {
    super({
      vertexShader: /* glsl */ `
        varying vec3 worldNormal;
        varying vec3 viewDirection;
        void main() {
          vec4 transformedNormal = vec4(normal, 0.0);
          vec4 transformedPosition = vec4(position, 1.0);
          worldNormal = normalize( modelViewMatrix * transformedNormal).xyz;
          viewDirection = normalize((modelMatrix * transformedPosition).xyz - cameraPosition);;
          gl_Position = projectionMatrix * modelViewMatrix * transformedPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D envMap;
        uniform sampler2D backfaceMap;
        uniform vec2 resolution;
        varying vec3 worldNormal;
        varying vec3 viewDirection;
        void main() {
          // get uv
          vec2 uv = gl_FragCoord.xy / resolution;
          // get normal adjusted for backface mapping
          vec3 normal = worldNormal * (1.0 - 0.7) - texture2D(backfaceMap, uv).rgb * 0.7;
          // calculate color of texel
          vec4 color = texture2D(envMap, uv += refract(viewDirection, normal, 1.0/1.5).xy);
          gl_FragColor = vec4(color.rgb, 1.0);
        }
      `,
      uniforms: {
        envMap: { value: envMap },
        backfaceMap: { value: backfaceMap },
        resolution: { value: resolution }
      }
    });
  }
}

export { RefractionMaterial };
export type { RefractionMaterialParams };
