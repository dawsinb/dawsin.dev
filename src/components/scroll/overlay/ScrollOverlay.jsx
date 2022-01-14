import { useState, useRef, useEffect } from 'react';
import { animated } from '@react-spring/web';
import { useSpring, useSpringRef, useChain } from '@react-spring/core';
import styled from 'styled-components';
import useStore from 'Utils/hooks/useStore';
import useStateCallback from 'Utils/hooks/useStateCallback';
import Background from 'Components/scroll/overlay/Background';
import SectionMarker from 'Components/scroll/overlay/SectionMarker';
import PositionMarker from 'Components/scroll/overlay/PositionMarker';

// eslint-disable-next-line no-unused-vars
const Container = styled(({ isVertical, ...props }) => <animated.div {...props} />)`
  position: fixed;
  right: ${(props) => (props.isVertical ? `calc(50% - ${props.width / 2}px)` : '0')};
  top: ${(props) => (props.isVertical ? 'auto' : `calc(50% - ${props.height / 2}px)`)};
  bottom: ${(props) => (props.isVertical ? '0' : 'auto')};
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  z-index: 2;
  transform-origin: ${(props) => (props.isVertical ? 'center bottom' : 'center right')};
  transform: scale(var(--scale, 1));
`;

function ScrollOverlay({ numSections, sectionNames }) {
  // switch to vertical layout if screen size is vertical
  const isVertical = useStore((state) => state.isVertical);

  // calculate marker size and offset between markers
  const size = Math.ceil(window.innerHeight / (9 * numSections));
  const offsetDistance = Math.ceil(size * 2.25);
  // calculate width and height of the container
  const height = isVertical ? size * 4 : numSections * offsetDistance + size;
  const width = isVertical ? numSections * offsetDistance + size : size * 4;

  // calculate background size
  const largestNameLength = sectionNames.reduce((a, b) => (a.length > b.length ? a : b)).length;
  const maxBackgroundSize = (largestNameLength / (isVertical ? 2.5 : 3.5)) * 100;

  // calculate offsets for marker positions
  const offsetFactors = [...Array(numSections)].map((_, index) => index - (numSections - 1) / 2);

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
  const textToggles = [];
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
  const [jumpDirection, setJumpDirection] = useStateCallback(null);
  // timeout ref to handle spin reset across multiple markers
  const timeoutRef = useRef();

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
      isVertical={isVertical}
      width={width}
      height={height}
      style={{
        '--scale': overlayToggle.to({ output: [1, 1.5] })
      }}
    >
      <Background
        isVertical={isVertical}
        style={{
          '--size': bgToggle.to({ output: [100, maxBackgroundSize] }).to((value) => `${value}%`),
          opacity: bgToggle.to({ output: [0, 1] })
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
