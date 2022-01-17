/**
 * @module Components/ScrollOverlay
 * @mergeTarget
 */

import { useState, useRef, useEffect, createContext } from 'react';
import styled from 'styled-components';
import { animated } from '@react-spring/web';
import { useSpring, useSpringRef, useChain, SpringValue } from '@react-spring/core';
import { useLayout } from 'Utils/stores/layout';
import { useStateCallback } from 'Utils/hooks/useStateCallback';
import { Background } from 'Components/scroll/overlay/Background';
import { SectionMarker } from 'Components/scroll/overlay/SectionMarker';
import { PositionMarker } from 'Components/scroll/overlay/PositionMarker';

/** Variables provided by {@link ScrollOverlayContext} */
interface ScrollOverlayContextInterface {
  /** Determines weather a vertical layout should be used */
  isVertical: boolean;
}
/**
 * Creates a react context to expose common variables to children. See {@link ScrollOverlayContextInterface} for the variables it provides
 */
const ScrollOverlayContext = createContext<ScrollOverlayContextInterface>({ isVertical: false });

/** Props for {@link Container} */
interface ContainerProps {
  $isVertical: boolean;
  $width: number;
  $height: number;
  style: CssProperties & {
    '--scale': AnimatedValue<number>;
  };
}
/** Container for {@link ScrollOverlay} to determine position and size */
const Container = styled(animated.div)<ContainerProps>`
  position: fixed;
  // position on top
  z-index: 10;
  // set size
  height: ${({ $height }) => $height}px;
  width: ${({ $width }) => $width}px;
  // position center right if horizontal; center bottom if vertical
  right: ${({ $isVertical, $width }) => ($isVertical ? `calc(50% - ${$width / 2}px)` : '0')};
  bottom: ${({ $isVertical, $height }) => ($isVertical ? '0' : `calc(50% - ${$height / 2}px)`)};
  // grow from center right if horizontal; center bottom if vertical
  transform-origin: ${({ $isVertical }) => ($isVertical ? 'center bottom' : 'center right')};
  transform: scale(var(--scale, 1));
`;

/** Props for {@link ScrollOverlay} */
interface ScrollOverlayProps {
  /** Total number of sections to display */
  numSections: number;
  /** Optional list of section names to display alongside their respective markers */
  sectionNames?: string[];
}
/**
 * Scroll overlay which displays page sections and shows current scroll position.
 *
 * Reads scroll position contained in the {@link useScroll scroll store},
 * and allows to update the position by clicking on markers to jump to the respective section.
 *
 * See {@link ScrollHandler} for the handling of user scroll events
 * @param props
 * @category Component
 */
function ScrollOverlay({ numSections, sectionNames = [] }: ScrollOverlayProps) {
  // switch to vertical layout if screen size is vertical
  const isVertical = useLayout((state) => state.isVertical);

  // calculate marker size and offset between markers
  const size = Math.ceil(window.innerHeight / (9 * numSections));
  const offsetDistance = Math.ceil(size * 2.25);
  // calculate width and height of the container
  const height = isVertical ? size * 4 : numSections * offsetDistance + size;
  const width = isVertical ? numSections * offsetDistance + size : size * 4;

  // calculate background size (default to 4 if < 4)
  const largestNameLength = Math.max(sectionNames.reduce((a, b) => (a.length > b.length ? a : b), '').length, 4);

  // calculate offsets for marker positions
  const offsetDistances = Array.from({ length: numSections }, (_, index) => index).map(
    (index) => -Math.round((index - (numSections - 1) / 2) * offsetDistance)
  );

  // state toggle used to interpolate values for animations
  const [toggle, setToggle] = useState(false);

  // set up spring toggles
  const overlaySpringRef = useSpringRef();
  const overlayToggle = useSpring({
    ref: overlaySpringRef,
    toggle: Number(toggle)
  }).toggle;
  const backgroundSpringRef = useSpringRef();
  const backgroundToggle = useSpring({
    ref: backgroundSpringRef,
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
    [overlaySpringRef, backgroundSpringRef, ...textSpringRefs],
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
    <ScrollOverlayContext.Provider value={{ isVertical: isVertical }}>
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
        <Background maxTitleLength={largestNameLength} toggle={backgroundToggle} />

        <PositionMarker
          markerSize={size}
          scaleFactor={2.25}
          offsetDistance={offsetDistance}
          initialOffset={offsetDistances[0]}
          jumpDirection={jumpDirection}
        />

        <div>
          {offsetDistances.map((offset, index) => (
            <SectionMarker
              key={index}
              useCircle={index === 0 || index === offsetDistances.length - 1}
              markerSize={size}
              offset={offset}
              index={index}
              active={active}
              title={sectionNames[index]}
              textToggle={textToggles[index]}
              setJumpDirection={setJumpDirection}
              timeoutRef={timeoutRef}
            />
          ))}
        </div>
      </Container>
    </ScrollOverlayContext.Provider>
  );
}

export { ScrollOverlay, ScrollOverlayContext };
export type { ScrollOverlayProps, ScrollOverlayContextInterface };
