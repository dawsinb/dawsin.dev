/**
 * Components used for the title section of the app
 * @module Components/Sections/Title
 * @mergeTarget
 */

import { useEffect, useRef } from 'react';
import { Group, Mesh } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { useThree, useFrame } from '@react-three/fiber';
import styled from 'styled-components';
import { useSpring, easings } from '@react-spring/core';
import { animated } from '@react-spring/web';
import { loadFont } from 'loaders/loadFont';
import { useTheme } from 'stores/theme';
import { lerp } from 'utils/math';
import { Html } from 'components/Html';
import { Section, SectionItem } from 'components/sections/Section';
import { Refractor } from './refractor/Refractor';
import { Arrow } from './Arrow';

/** Props for {@link ArrowContainer} */
interface ArrowContainerProps {
  style: CssProperties & {
    '--shift': AnimatedValue<string>;
  };
}
/** Container for left and right arrows for {@link PortfolioSection} */
const ArrowContainer = styled(animated.div)<ArrowContainerProps>`
  position: absolute;
  bottom: -45vh;
  left: 0;
  width: 5vh;
  height: 5vh;
  transform: translateY(var(--shift)) translate(-2.5vh, -2.5vh);
`;

/** Props for {@link Title} */
interface TitleProps {
  /** Index of the {@link Section section} */
  index: number;
  /** Parallax of the {@link Section section} */
  parallax?: number;
}
/**
 * Title screen of the app. Contains the title text alongside a {@link Refractor refractor} to apply a shifting effect
 * @param props
 * @returns
 */
function TitleSection({ index, parallax }: TitleProps) {
  // calculate base width and height
  const { size } = useThree();

  // get colors
  const primary = useTheme((state) => state.primaryColor);
  const secondary = useTheme((state) => state.secondaryColor);

  // calculate font size
  const fontSize = size.width / 10;

  // create refs for text geometries
  const textRef = useRef<Group>();
  const dawsinTextRef = useRef<Mesh>();
  const devTextRef = useRef<Mesh>();

  // load font and create text geometries
  useEffect(() => {
    loadFont('/assets/fonts/BorisBlackBloxxDirty.json')
      .then((font) => {
        if (textRef.current && dawsinTextRef.current && devTextRef.current) {
          // create text geometries
          const config = { font: font, size: fontSize, height: 25 };
          dawsinTextRef.current.geometry = new TextGeometry('dawsin', config);
          devTextRef.current.geometry = new TextGeometry('.dev', config);

          // center texts together
          dawsinTextRef.current.geometry.computeBoundingBox();
          if (dawsinTextRef.current.geometry.boundingBox) {
            textRef.current.position.x =
              dawsinTextRef.current.geometry.boundingBox.min.x - dawsinTextRef.current.geometry.boundingBox.max.x / 2;
          }
        }
      })
      .catch((error) => console.error(error));
  }, [fontSize]);

  // rotate text to look at mouse position
  const textGroupRef = useRef<Group>();
  const mouseX = useRef<number>(0);
  const mouseY = useRef<number>(0);
  useFrame(({ mouse }) => {
    if (textGroupRef.current) {
      // lerp position values to mouse position to smooth movement
      mouseX.current = lerp(mouseX.current, mouse.x, 0.07);
      mouseY.current = lerp(mouseY.current, mouse.y, 0.07);
      // set rotation
      textGroupRef.current.lookAt(mouseX.current * size.width, mouseY.current * size.height, 4000);
    }
  });

  // set up spring for arrow bounce animation
  const { arrowSpring } = useSpring({
    from: { arrowSpring: 0 },
    to: { arrowSpring: 1 },
    loop: { reverse: true },
    config: {
      duration: 1000,
      easing: easings.easeInOutSine
    }
  });
  // set up spring for color fade animation
  const { colorSpring } = useSpring({
    from: { colorSpring: 0 },
    to: { colorSpring: 1 },
    loop: { reverse: true },
    config: {
      duration: 2500,
      easing: easings.easeInOutSine
    }
  });

  return (
    <Section index={index} parallax={parallax}>
      <SectionItem parallax={2}>
        <group ref={textGroupRef}>
          <group ref={textRef}>
            <mesh ref={dawsinTextRef} layers={1}>
              <meshBasicMaterial color={primary} />
            </mesh>

            <mesh ref={devTextRef} layers={1} position={[0, -fontSize / 1.5, 0.1]}>
              <meshBasicMaterial color={secondary} />
            </mesh>
          </group>
        </group>
      </SectionItem>

      <SectionItem parallax={20}>
        <Refractor index={index} />
      </SectionItem>

      <SectionItem parallax={2}>
        <mesh rotation={[0, 0, Math.PI / 8]} position={[0, 0, -10]}>
          <planeBufferGeometry args={[size.width * 3, size.height * 2, 32, 32]} />
          <meshBasicMaterial color={'#000'} />
        </mesh>
      </SectionItem>

      <SectionItem parallax={4}>
        <Html>
          <ArrowContainer style={{ '--shift': arrowSpring.to({ output: [0, 1.5] }).to((value) => `${value}vh`) }}>
            <Arrow color={colorSpring.to({ output: [primary, secondary] })} />
          </ArrowContainer>
        </Html>
      </SectionItem>
    </Section>
  );
}

export { TitleSection };
export type { TitleProps };
