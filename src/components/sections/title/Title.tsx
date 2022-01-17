/**
 * @module Components/Sections/Title
 * @mergeTarget
 */

import { useEffect, useRef } from 'react';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { useThree, useFrame } from '@react-three/fiber';
import { useTheme } from 'Stores/theme';
import { Section, SectionItem } from 'Components/sections/Section';
import { Refractor } from 'Components/sections/title/refractor/Refractor';
import { useFont } from 'Hooks/useFont';
import { Group, Mesh, Vector3 } from 'three';

/** Props for {@link Title} */
interface TitleProps {
  index: number;
  parallax?: number;
}
/**
 * Title screen of the app. Contains the title text alongside a {@link Refractor refractor} to apply a shifting effect
 * @param props
 * @returns
 */
function Title({ index, parallax }: TitleProps) {
  // calculate base width and height
  const { size } = useThree();

  // get colors
  const primary = useTheme((state) => state.primaryColor);
  const secondary = useTheme((state) => state.secondaryColor);

  // calculate Positions and sizes
  const titleX = 0;
  const titleY = 0;
  const titlePosition = new Vector3(titleX, titleY, 1);
  const fontSize = size.width / 10;

  // create refs for text geometries
  const textGroupRef = useRef<Group>();
  const dawsinTextRef = useRef<Mesh>();
  const devTextRef = useRef<Mesh>();

  // load font and create text geometries
  useEffect(() => {
    useFont('/assets/fonts/BorisBlackBloxxDirty.json', (font) => {
      if (textGroupRef.current && dawsinTextRef.current && devTextRef.current) {
        // create text geometries
        const config = { font: font, size: fontSize, height: 25 };
        dawsinTextRef.current.geometry = new TextGeometry('dawsin', config);
        devTextRef.current.geometry = new TextGeometry('.dev', config);

        // center texts together
        dawsinTextRef.current.geometry.computeBoundingBox();
        if (dawsinTextRef.current.geometry.boundingBox) {
          textGroupRef.current.position.x =
            dawsinTextRef.current.geometry.boundingBox.min.x - dawsinTextRef.current.geometry.boundingBox.max.x / 2;
        }
      }
    });
  }, []);

  // rotate text to look at mouse position
  useFrame(({ mouse }) => {
    if (textGroupRef.current) {
      textGroupRef.current.lookAt(mouse.x * size.width, mouse.y * size.height, 4000);
    }
  });

  return (
    <Section index={index} parallax={parallax}>
      <SectionItem parallax={2}>
        <group position={titlePosition}>
          <group ref={textGroupRef}>
            <mesh ref={dawsinTextRef} layers={1}>
              <meshBasicMaterial color={primary} />
            </mesh>

            <mesh ref={devTextRef} layers={1} position={[0, -fontSize / 1.5, 0.1]}>
              <meshBasicMaterial color={secondary} />
            </mesh>
          </group>
        </group>
      </SectionItem>

      <SectionItem parallax={4}>
        <mesh rotation={[0, 0, Math.PI / 8]} position={[0, 0, -1000]}>
          <planeGeometry args={[size.width * 3, size.height * 2, 32, 32]} />
          <meshBasicMaterial color={'#000'} />
        </mesh>
      </SectionItem>

      <SectionItem parallax={20}>
        <Refractor index={index} />
      </SectionItem>
    </Section>
  );
}

export { Title };
export type { TitleProps };
