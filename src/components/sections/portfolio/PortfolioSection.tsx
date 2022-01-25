/**
 * Components used for the portfolio section of the app
 * @module Components/Sections/Portfolio
 * @mergeTarget
 */

import { useEffect, useRef, useState } from 'react';
import { Group, Vector2 } from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useTheme } from 'Stores/theme';
import { useLayout } from 'Stores/layout';
import { Section, SectionItem } from 'Components/sections/Section';
import { Laptop } from './Laptop';
import { Phone } from './Phone';
import { Html } from 'Components/Html';
import { Arrow } from './Arrow';
import styled from 'styled-components';
import { useSpring } from '@react-spring/core';
import { Slider } from './Slider';
import { animated } from '@react-spring/three';

// fix for typescript bug with react-spring/styled-components see https://github.com/pmndrs/react-spring/issues/1515
const AnimatedAmbientLight = styled(animated.ambientLight)<{ color: AnimatedValue<string> }>``;

/** Props for {@link ArrowContainer} */
interface ArrowContainerProps {
  $isLeft?: boolean;
  $isVertical?: boolean;
}
/** Container for left and right arrows for {@link PortfolioSection} */
const ArrowContainer = styled('div')<ArrowContainerProps>`
  position: absolute;
  left: ${({ $isLeft }) => ($isLeft ? '-35vw' : '35vw')};
  bottom: ${({ $isVertical }) => ($isVertical ? `-38vh` : `0vh`)};
  width: 6vw;
  transform: translate(-50%, 50%);
`;

/** Container for device slider for {@link PortfolioSection} */
const SliderContainer = styled('div')`
  position: absolute;
  bottom: -42vh;
  transform: translate(-50%, -50%);
`;

/** Props for {@link PortfolioSection} */
interface PortfolioProps {
  /** Index of the {@link Section section} */
  index: number;
  /** Parallax of the {@link Section section} */
  parallax?: number;
}
/**
 * Portfolio section of the app. Contains 3d models of a laptop and phone with an image gallery in them
 * @param props
 * @returns
 */
function PortfolioSection({ index, parallax }: PortfolioProps) {
  // calculate base width and height
  const { size } = useThree();

  const isVertical = useLayout((state) => state.isVertical);

  // get colors
  const primary = useTheme((state) => state.primaryColor);
  const secondary = useTheme((state) => state.secondaryColor);

  // calculate Positions and sizes
  const laptopScale = size.width * (isVertical ? 0.05 : 0.03);
  const phoneScale = size.width * (isVertical ? 4 : 2);

  // create refs to device groups
  const deviceGroupRef = useRef<Group>();
  const laptopRef = useRef<Group>();
  const phoneRef = useRef<Group>();

  const laptopImageTextureUrls = [
    '/assets/textures/sites/desktop/home_light.ktx2',
    '/assets/textures/sites/desktop/module_light.ktx2',
    '/assets/textures/sites/desktop/home_dark.ktx2',
    '/assets/textures/sites/desktop/module_dark.ktx2'
  ];
  const phoneImageTextureUrls = [
    '/assets/textures/sites/mobile/home_light.ktx2',
    '/assets/textures/sites/mobile/module_light.ktx2',
    '/assets/textures/sites/mobile/home_dark.ktx2',
    '/assets/textures/sites/mobile/module_dark.ktx2'
  ];

  // state to handle mouse style when hovering objects
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  // device color (actually controls ambient light color which is then reflected diffusely)
  const [colorToggle, setColorToggle] = useState(false);
  const { colorSpring } = useSpring({
    colorSpring: Number(colorToggle),
    config: {
      mass: 1,
      tension: 280,
      friction: 120
    }
  });

  // current device
  const [deviceToggle, setDeviceToggle] = useState(false);
  const { deviceSpring } = useSpring({
    deviceSpring: Number(deviceToggle),
    config: {
      mass: 2,
      tension: 120,
      friction: 22
    }
  });

  // image indices and direction to pass to textureFader shader
  const [imageIndex, setImageIndex] = useState({ previous: 0, current: 0 });
  const [direction, setDirection] = useState(new Vector2(0, 0));

  // handlers for left / right arrow
  const handleClickLeft = () => {
    // go to previous image
    setImageIndex((prevValue) => {
      return {
        previous: prevValue.current,
        current: prevValue.current === 0 ? laptopImageTextureUrls.length - 1 : prevValue.current - 1
      };
    });
    // set direction to left and slightly down
    setDirection(new Vector2(-1, 0.1));

    // switch color
    setColorToggle(!colorToggle);
  };
  const handleClickRight = () => {
    // go to next image
    setImageIndex((prevValue) => {
      return {
        previous: prevValue.current,
        current: (prevValue.current + 1) % laptopImageTextureUrls.length
      };
    });
    // set direction to right and slightly down
    setDirection(new Vector2(1, 0.1));

    // switch color
    setColorToggle(!colorToggle);
  };

  // set up laptop / phone motion
  useFrame(({ clock }) => {
    if (laptopRef.current && phoneRef.current) {
      const t = clock.getElapsedTime();

      // set laptop rotation / position
      laptopRef.current.rotation.x = Math.cos(t / 2) / 16;
      laptopRef.current.rotation.y = Math.sin(t / 3) / 8;
      laptopRef.current.rotation.z = Math.sin(t / 5) / 8;
      laptopRef.current.position.y = (Math.sin(t / 1.2) * size.height) / 64;
      laptopRef.current.position.x = (Math.cos(t / 1.5) * size.width) / 128;

      // set phone rotation / position
      phoneRef.current.rotation.x = Math.sin(t / 2) / 16;
      phoneRef.current.rotation.y = Math.cos(t / 3) / 3;
      phoneRef.current.rotation.z = Math.cos(t / 5) / 8;
      phoneRef.current.position.y = (Math.cos(t / 1.2) * size.height) / 64;
      phoneRef.current.position.x = (Math.sin(t / 1.5) * size.width) / 128;
    }
  });

  return (
    <Section index={index} parallax={parallax}>
      {/* ambient light to tint the objects */}
      <AnimatedAmbientLight intensity={0.4} color={colorSpring.to({ output: [primary, secondary] })} />
      {/* directional light for base lighting */}
      <directionalLight intensity={0.2} position={[300, -500, 300]} />
      {/* spot light for highlights */}
      <spotLight intensity={0.5} position={[size.width / 2, size.height / 2, size.height / 2]} />

      <SectionItem parallax={2}>
        <group ref={deviceGroupRef}>
          <animated.group position-x={deviceSpring.to({ output: [0, size.width] })}>
            <group
              ref={laptopRef}
              onClick={() => setDeviceToggle(!deviceToggle)}
              onPointerEnter={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
            >
              <Laptop
                imageIndex={imageIndex.current}
                prevImageIndex={imageIndex.previous}
                direction={direction}
                imageTextureUrls={laptopImageTextureUrls}
                displacementTextureUrl={'/assets/textures/sites/displacement.ktx2'}
                noiseTextureUrl={'/assets/textures/sites/noise.ktx2'}
                scale={laptopScale}
              />
            </group>
          </animated.group>
          <animated.group position-x={deviceSpring.to({ output: [-size.width, 0] })}>
            <group
              ref={phoneRef}
              onClick={() => setDeviceToggle(!deviceToggle)}
              onPointerEnter={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
            >
              <Phone
                imageIndex={imageIndex.current}
                prevImageIndex={imageIndex.previous}
                direction={direction}
                imageTextureUrls={phoneImageTextureUrls}
                displacementTextureUrl={'/assets/textures/sites/displacement.ktx2'}
                noiseTextureUrl={'/assets/textures/sites/noise.ktx2'}
                scale={phoneScale}
              />
            </group>
          </animated.group>
        </group>
      </SectionItem>

      <SectionItem parallax={2}>
        <Html>
          <ArrowContainer $isLeft $isVertical={isVertical} onClick={handleClickLeft}>
            <Arrow isLeft color={secondary} />
          </ArrowContainer>
          <ArrowContainer $isVertical={isVertical} onClick={handleClickRight}>
            <Arrow color={primary} />
          </ArrowContainer>
        </Html>
      </SectionItem>

      <SectionItem parallax={1}>
        <Html>
          <SliderContainer>
            <Slider
              toggle={deviceToggle}
              size={4}
              leftColor={primary}
              rightColor={secondary}
              onClick={() => setDeviceToggle((prevValue) => !prevValue)}
            />
          </SliderContainer>
        </Html>
      </SectionItem>
    </Section>
  );
}

export { PortfolioSection };
export type { PortfolioProps };
