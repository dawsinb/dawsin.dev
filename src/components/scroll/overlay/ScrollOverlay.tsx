/**
 * Test
 * @module Components/ScrollOverlay
 * @mergeTarget
 */

import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { animated } from '@react-spring/web';
import { useSpring, useSpringRef, useChain, SpringValue } from '@react-spring/core';
import useLayout from 'Utils/stores/layout';
import useStateCallback from 'Utils/hooks/useStateCallback';
import Background from 'Components/scroll/overlay/Background';
import SectionMarker from 'Components/scroll/overlay/SectionMarker';
import PositionMarker from 'Components/scroll/overlay/PositionMarker';

interface ContainerProps {
  $isVertical: boolean;
  $width: number;
  $height: number;
  style: CssProperties & {
    '--scale': AnimatedValue<number>;
  };
}
const Container = styled(animated.div)<ContainerProps>`
  position: fixed;
  right: ${({ $isVertical, $width }) => ($isVertical ? `calc(50% - ${$width / 2}px)` : '0')};
  top: ${({ $isVertical, $height }) => ($isVertical ? 'auto' : `calc(50% - ${$height / 2}px)`)};
  bottom: ${({ $isVertical }) => ($isVertical ? '0' : 'auto')};
  height: ${({ $height }) => $height}px;
  width: ${({ $width }) => $width}px;
  z-index: 2;
  transform-origin: ${({ $isVertical }) => ($isVertical ? 'center bottom' : 'center right')};
  transform: scale(var(--scale, 1));
`;

interface ScrollOverlayProps {
  numSections: number;
  sectionNames?: string[];
}
function ScrollOverlay({ numSections, sectionNames = [] }: ScrollOverlayProps) {
  // switch to vertical layout if screen size is vertical
  const isVertical = useLayout((state) => state.isVertical);

  // calculate marker size and offset between markers
  const size = Math.ceil(window.innerHeight / (9 * numSections));
  const offsetDistance = Math.ceil(size * 2.25);
  // calculate width and height of the container
  const height = isVertical ? size * 4 : numSections * offsetDistance + size;
  const width = isVertical ? numSections * offsetDistance + size : size * 4;

  // calculate background size
  const largestNameLength = sectionNames.reduce((a, b) => (a.length > b.length ? a : b), '').length;
  const scaleFactor = isVertical ? 2.5 : 3.5;
  const maxBackgroundSize = (Math.max(largestNameLength, scaleFactor) / scaleFactor) * 100;

  // calculate offsets for marker positions
  const offsetFactors = Array.from({ length: numSections }, (_, index) => index).map(
    (index) => index - (numSections - 1) / 2
  );

  // state toggle used to interpolate values for animations
  const [toggle, setToggle] = useState(false);

  // set up spring toggles
  const overlaySpringRef = useSpringRef();
  const overlayToggle = useSpring({
    ref: overlaySpringRef,
    toggle: Number(toggle)
  }).toggle;
  const bgSpringRef = useSpringRef();
  const bgToggle = useSpring({
    ref: bgSpringRef,
    toggle: Number(toggle)
  }).toggle;
  const textSpringRefs = [];
  const textToggles: SpringValue<number>[] = [];
  for (let i = 0; i < numSections; i++) {
    textSpringRefs[i] = useSpringRef();
    textToggles[i] = useSpring({
      ref: textSpringRefs[i],
      toggle: Number(toggle)
    }).toggle;
  }

  // set up chain to handle the timing of delays between animations
  useChain(
    [overlaySpringRef, bgSpringRef, ...textSpringRefs],
    toggle
      ? [0, 50, ...textSpringRefs.map((_, index) => 175 + index * 100)]
      : [300, 450, ...textSpringRefs.map((_, index) => index * 50)],
    1
  );

  // state for handling spin of marker when clicking on a section
  const [jumpDirection, setJumpDirection] = useStateCallback<number>(0);
  // timeout ref to handle spin reset across multiple markers
  const timeoutRef = useRef<NodeJS.Timeout>();

  // make the overlay interactable after a very short delay to prevent touches from interacting when opening the menu
  const [active, setActive] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setActive(toggle);
    }, 10);
  }, [toggle]);

  return (
    <Container
      onMouseEnter={() => setToggle(true)}
      onMouseLeave={() => setToggle(false)}
      $isVertical={isVertical}
      $width={width}
      $height={height}
      style={{
        '--scale': overlayToggle.to({ output: [1, 1.5] })
      }}
    >
      <Background
        $isVertical={isVertical}
        style={{
          '--size': bgToggle.to({ output: [100, maxBackgroundSize] }).to((value) => `${value}%`),
          '--opacity': bgToggle.to({ output: [0, 1] })
        }}
      />

      {offsetFactors.map((offsetFactor, index) => (
        <SectionMarker
          key={index}
          isVertical={isVertical}
          isStartEnd={index === 0 || index === offsetFactors.length - 1}
          size={size}
          offset={offsetFactor * offsetDistance}
          breakpoint={index}
          active={active}
          title={sectionNames[index]}
          textToggle={textToggles[index]}
          setJumpDirection={setJumpDirection}
          timeoutRef={timeoutRef}
        />
      ))}

      <PositionMarker
        isVertical={isVertical}
        size={size}
        offsetDistance={offsetDistance}
        numSections={numSections}
        jumpDirection={jumpDirection}
      />
    </Container>
  );
}

export default ScrollOverlay;
