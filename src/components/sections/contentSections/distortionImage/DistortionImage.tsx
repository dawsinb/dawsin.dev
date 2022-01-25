/**
 * Content sections with html text and an image
 * @module Components/Sections/ContentSections
 * @mergeTarget
 */

import { useRef, useState } from 'react';
import { Texture, Vector2 } from 'three';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { lerp } from 'Utils/math';
import { DistortionMaterial } from './DistortionMaterial';
import { useTransientScroll } from 'Hooks/useTransientScroll';

/** Props for {@link DistortionImage} */
interface DistortionImageProps {
  /** Width of the image */
  width: number;
  /** Height of the image */
  height: number;
  /** Texture to use for the image */
  texture: Texture;
}
/**
 * Displays a texture on a plane with a custom shader to distort around the users mouse position
 * @param props
 * @returns
 */
function DistortionImage({ width, height, texture, ...props }: DistortionImageProps) {
  // register shader in r3f
  extend({ DistortionMaterial });
  // create ref to shader material
  const materialRef = useRef<DistortionMaterial>();

  // set up transient subscription to the scroll position
  const scrollRef = useTransientScroll();
  // var to hold previous scroll position to calculate delta
  let prevScrollPosition = scrollRef.current;

  // set up animation loop for distoration effect
  const { size } = useThree();
  const [effectFactor, setEffectFactor] = useState(0);
  const [mousePosition, setMousePosition] = useState(new Vector2(0.5, 0.5));

  useFrame(({ mouse }) => {
    if (materialRef.current) {
      // calculate scroll delta
      const scrollDelta = scrollRef.current - prevScrollPosition;

      // lerp direction to the direction of the mouse
      materialRef.current.direction.lerp(mouse.normalize(), 0.01).normalize();
      materialRef.current.mousePosition.lerp(mousePosition, 0.03);
      // lerp towards current effect factor
      materialRef.current.effectFactor = lerp(materialRef.current.effectFactor, effectFactor, 0.01);
      // lerp shift value to the delta of the scroll position
      materialRef.current.scrollFactor = lerp(materialRef.current.scrollFactor, scrollDelta, 0.025);

      // update previous scroll position
      prevScrollPosition = scrollRef.current;
    }
  });

  return (
    <mesh
      {...props}
      onPointerMove={(e) => {
        if (e.intersections[0].uv) setMousePosition(e.intersections[0].uv);
      }}
      onPointerEnter={() => setEffectFactor(1)}
      onPointerOut={() => setEffectFactor(0)}
    >
      <planeBufferGeometry args={[width, height, 32, 32]} />
      <distortionMaterial
        attach="material"
        ref={materialRef}
        imageTexture={texture}
        displacementIntensity={20.0}
        scrollIntensity={5.0}
        scrollDisplacementIntensity={size.height / 2}
      />
    </mesh>
  );
}

export { DistortionImage };
export type { DistortionImageProps };
