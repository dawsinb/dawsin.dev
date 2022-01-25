/**
 * Components used for end section with morphing text
 * @module Components/Sections/End
 * @mergeTarget
 */

import { useRef, useEffect, useState } from 'react';
import { BufferAttribute, Mesh } from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { Section, SectionItem } from 'Components/sections/Section';
import { lerp } from 'Utils/math';
import { useTheme } from 'Stores/theme';
import { loadFont } from 'Loaders/loadFont';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

/** Props for {@link EndSection} */
interface EndSectionProps {
  /** Index of the {@link Section section} */
  index: number;
  /** Parallax of the {@link Section section} */
  parallax?: number;
}
/**
 * End section which contains text that morphs when moused over
 * @param props
 * @returns
 */
function EndSection({ index, parallax }: EndSectionProps) {
  // get size of canvas
  const { size } = useThree();

  // get colors
  const primary = useTheme((state) => state.primaryColor);
  const secondary = useTheme((state) => state.secondaryColor);

  // calculate font sizes
  const fontSize = size.width / 10;
  const fontSizeJp = size.width / 8;

  // load fonts and create text geometries and refresh on resize
  const nineTextRef = useRef<Mesh>();
  const fourTextRef = useRef<Mesh>();

  useEffect(() => {
    // define geometries for english text; these are used as the base
    let nineGeometry: TextGeometry;
    let fourGeometry: TextGeometry;
    // define geometries for japanese text; these are used as the morph targets
    let nineGeometryJp: TextGeometry;
    let fourGeometryJp: TextGeometry;

    Promise.all([
      // load english geometries
      loadFont('/assets/fonts/BorisBlackBloxx.json').then((font) => {
        // create text geometries
        const config = { font: font, size: fontSize, height: 1 };
        nineGeometry = new TextGeometry('nine', config);
        fourGeometry = new TextGeometry('four', config);

        // center geometries
        nineGeometry.center();
        fourGeometry.center();
      }),
      // load japanese geometries
      loadFont('/assets/fonts/YujiSyuku.json').then((font) => {
        // create text geometry
        const config = { font: font, size: fontSizeJp, height: 1 };
        nineGeometryJp = new TextGeometry('九', config);
        fourGeometryJp = new TextGeometry('四', config);

        // center geometries
        nineGeometryJp.center();
        fourGeometryJp.center();
      })
    ])
      // once all geometries are loaded calculate buffers and set morph targets to morph between english to japanese
      .then(() => {
        if (nineTextRef.current && fourTextRef.current) {
          // get max buffer sizes for each geometry
          const nineBufferSize =
            Math.max(nineGeometry.attributes.position.count, nineGeometryJp.attributes.position.count) * 3;
          const fourBufferSize =
            Math.max(fourGeometry.attributes.position.count, fourGeometryJp.attributes.position.count) * 3;

          // create new buffers from max size
          const nineBuffer = new Float32Array(nineBufferSize);
          nineBuffer.set(nineGeometry.attributes.position.array);
          const nineBufferJp = new Float32Array(nineBufferSize);
          nineBufferJp.set(nineGeometryJp.attributes.position.array);

          const fourBuffer = new Float32Array(fourBufferSize);
          fourBuffer.set(fourGeometry.attributes.position.array);
          const fourBufferJp = new Float32Array(fourBufferSize);
          fourBufferJp.set(fourGeometryJp.attributes.position.array);

          // update geometry buffers and set moprh attribute to change between geometries
          nineGeometry.setAttribute('position', new BufferAttribute(nineBuffer, 3));
          nineGeometry.morphAttributes.position = [new BufferAttribute(nineBufferJp, 3)];

          fourGeometry.setAttribute('position', new BufferAttribute(fourBuffer, 3));
          fourGeometry.morphAttributes.position = [new BufferAttribute(fourBufferJp, 3)];

          // set geometries on mesh and update morph targets
          nineTextRef.current.geometry = nineGeometry;
          fourTextRef.current.geometry = fourGeometry;

          nineTextRef.current.updateMorphTargets();
          fourTextRef.current.updateMorphTargets();
        }
      })
      .catch((error) => console.log(error));
  }, [size]);

  // state to check when geometry is hovered to put morph target influence to half and switch state
  const [nineHovered, setNineHovered] = useState(false);
  const [fourHovered, setFourHovered] = useState(false);
  // switch state on mouse enter so text is changed once mouse leaves
  const [nineState, setNineState] = useState(false);
  const [fourState, setFourState] = useState(false);

  useFrame(({ clock }) => {
    if (nineTextRef.current?.morphTargetInfluences && fourTextRef.current?.morphTargetInfluences) {
      // apply sin function to the influence strength
      const time = clock.getElapsedTime() / 4;
      const hoverInfluenceNine = Math.sin(time * 2.1 + 0.2) * 0.1 + 0.5;
      const hoverInfluenceFour = Math.cos(time * 1.9 - 0.1) * 0.1 + 0.5;

      // when hovered influence is 0.5 (plus some noise); when not hovered settle to state
      nineTextRef.current.morphTargetInfluences[0] = lerp(
        nineTextRef.current.morphTargetInfluences[0],
        nineHovered ? hoverInfluenceNine : Number(nineState),
        0.03
      );
      fourTextRef.current.morphTargetInfluences[0] = lerp(
        fourTextRef.current.morphTargetInfluences[0],
        fourHovered ? hoverInfluenceFour : Number(fourState),
        0.03
      );
    }
  });

  return (
    <Section index={index} parallax={parallax}>
      <SectionItem parallax={2}>
        <group>
          {/* nine text */}
          <group position={[0, fontSize / 1.5, 0.1]}>
            <mesh ref={nineTextRef}>
              <meshBasicMaterial color={secondary} />
            </mesh>
            {/* invisible overlay to handle mouse events */}
            <mesh
              onPointerEnter={() => {
                setNineHovered(true);
                setNineState(!nineState);
              }}
              onPointerOut={() => {
                setNineHovered(false);
              }}
            >
              <planeBufferGeometry args={[fontSize * 4, fontSize * 2]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
          </group>

          {/* four text */}
          <group position={[0, -fontSize / 1.5, 0]}>
            <mesh ref={fourTextRef}>
              <meshBasicMaterial color={primary} />
            </mesh>
            {/* invisible overlay to handle mouse events */}
            <mesh
              onPointerEnter={() => {
                setFourHovered(true);
                setFourState(!fourState);
              }}
              onPointerOut={() => {
                setFourHovered(false);
              }}
            >
              <planeBufferGeometry args={[fontSize * 4, fontSize * 2]} />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>
          </group>
        </group>
      </SectionItem>

      {/* background */}
      <SectionItem parallax={4}>
        <mesh rotation={[0, 0, Math.PI / 8]} position={[0, 0, -10]}>
          <planeBufferGeometry args={[size.width * 3, size.height * 2, 32, 32]} />
          <meshBasicMaterial color={'#000'} />
        </mesh>
      </SectionItem>
    </Section>
  );
}

export { EndSection };
export type { EndSectionProps };
