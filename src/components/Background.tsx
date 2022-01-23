/**
 * Component to provide the background of the app
 * @module Components/Background
 * @mergeTarget
 */

import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { lerp, seedRandomRange } from 'utils/math';
import { useTransientScroll } from 'Hooks/useTransientScroll';
import { Euler, Group, ShapeBufferGeometry, Vector3 } from 'three';
import { loadSvg } from 'loaders/loadSvg';

interface BackgroundProps {
  /** Number of sections to generate background content for */
  numSections: number;
}
/**
 * Generates a background of brush strokes
 * @param props
 * @returns
 */
function Background({ numSections }: BackgroundProps) {
  // get size of the canvas
  const { size } = useThree();

  // urls of svgs to use
  const svgUrls = [
    '/assets/svg/brush1.svg',
    '/assets/svg/brush2.svg',
    '/assets/svg/brush3.svg',
    '/assets/svg/brush4.svg',
    '/assets/svg/brush5.svg',
    '/assets/svg/brush6.svg'
  ];

  // load geometries from url
  const [svgGeometries, setSvgGeometries] = useState<ShapeBufferGeometry[]>([]);
  useEffect(() => {
    // load image geometries from svgs
    const buffer: ShapeBufferGeometry[] = [];
    Promise.all(
      svgUrls.map((url, index) => {
        return loadSvg(url).then((geometry) => {
          buffer[index] = geometry;
        });
      })
    )
      .then(() => {
        setSvgGeometries(buffer);
      })
      .catch((error) => console.error(error));
  }, []);

  // generate a brush section for each section
  const brushSections = [];
  for (let i = 0; i < numSections; i++) {
    // generate 1 to 3 brushes
    const brushes = [];
    const count = Math.floor(seedRandomRange(`35${i * 100}`, 2, 4));
    for (let j = 0; j < count; j++) {
      // generate brush
      const index = Math.floor(seedRandomRange(`0${i * 100 + j}`, 0, 6)) + 1;

      // generate position
      const x = seedRandomRange(`74${i * 100 + j}`, -size.width / 2, size.width / 2);
      const y = seedRandomRange(`9${i * 100 + j}`, -size.height / 2, size.height / 2);
      const position = new Vector3(x, y, 0);
      // generate rotation
      const rotation = new Euler(0, 0, Math.PI * seedRandomRange(`40${i * 100 + j}`, -0.3, 0.3));
      // generate scale
      const scale = [seedRandomRange(`0${i * 100 + j}`, 0.5, 1.1), seedRandomRange(`0${i * 100 + j}`, 0.5, 1.1), 0];

      // push brush to list of brushes for this section
      brushes.push({
        index: index,
        position: position,
        rotation: rotation,
        scale: scale
      });
    }

    // push list of brushes to this section of brushes
    brushSections[i] = brushes;
  }
  // set up a ref to the sub group so that we can scroll it relative to the position
  const groupRef = useRef<Group>();
  // set up transient subscription to the scroll position
  const scrollRef = useTransientScroll();
  // lerp y position to scroll position (adjusted for parallax) for a smooth scroll effect
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.position.y = lerp(groupRef.current.position.y, scrollRef.current * size.height, 0.07);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -size.width]}>
      {brushSections.map((brushSection, index) => (
        <group key={index} position={[0, -size.height * index, 0]}>
          {brushSection.map((brush, index) => (
            <mesh key={index} geometry={svgGeometries[brush.index]} position={brush.position} rotation={brush.rotation}>
              <meshBasicMaterial color={'#181818'} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

export { Background };
export type { BackgroundProps };
