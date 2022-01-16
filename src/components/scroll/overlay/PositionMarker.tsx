/**
 * Test
 * @module Components/ScrollOverlay
 * @mergeTarget 
 */

import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSpring } from '@react-spring/core';
import { animated } from '@react-spring/web';
import useTransientScroll from 'Utils/hooks/useTransientScroll';
import { lerp } from 'Utils/math';
import Square from 'Components/scroll/overlay/Square';

interface ContainerProps {
  $isVertical: boolean;
  $size: number;
  $scaledSize: number;
  $offset: number;
  style: CssProperties & {
    '--shift': string;
    '--rotate': string | AnimatedValue<string>;
  };
}
const Container = styled(animated.div)<ContainerProps>`
  z-index: 1;
  position: absolute;
  width: ${({ $scaledSize }) => $scaledSize}px;
  height: ${({ $scaledSize }) => $scaledSize}px;
  right: ${({ $isVertical, $size, $offset }) => ($isVertical ? `calc(50% + ${$offset}px)` : `${$size * 2}px`)};
  top: ${({ $isVertical, $offset }) => ($isVertical ? 'auto' : `calc(50% - ${$offset}px)`)};
  bottom: ${({ $isVertical, $size }) => ($isVertical ? `${$size * 2}px` : 'auto')};
  transform: translate(${({ $scaledSize }) => $scaledSize / 2}px, ${({ $scaledSize }) => $scaledSize / 2}px)
    translate(${({ $isVertical }) => ($isVertical ? `var(--shift, 0px), 0px` : `0px, var(--shift, 0px)`)})
    rotateZ(var(--rotate, 0rad));
  user-select: none;
`;

interface PositionMarkerProps {
  isVertical: boolean;
  size: number;
  offsetDistance: number;
  numSections: number;
  jumpDirection: number;
}
function PositionMarker({ isVertical, size, offsetDistance, numSections, jumpDirection }: PositionMarkerProps) {
  const scaleFactor = 2.25;
  const startOffset = (offsetDistance * (numSections + (isVertical ? -1 : 1))) / 2;

  const [scrollPosition, setScrollPosition] = useState(0);

  // set up transient subscription to the scroll position
  const scrollRef = useTransientScroll();

  // set up animation loop to keep scroll position up to date
  const animationRef = useRef<number>(0);
  const animate = () => {
    // lerp towards scroll position for smooth ramp with damping
    setScrollPosition((prevPosition) => {
      return lerp(prevPosition, scrollRef.current, 0.08);
    });

    animationRef.current = requestAnimationFrame(animate);
  };
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const { rotate } = useSpring({
    to: {
      rotate: jumpDirection
    },
    from: {
      rotate: 0
    },
    config: { mass: 1, tension: 200, friction: 60 }
  });

  return (
    <Container
      $isVertical={isVertical}
      $size={size}
      $scaledSize={Math.ceil(size * scaleFactor)}
      $offset={startOffset}
      style={{
        '--shift': `${scrollPosition * offsetDistance}px`,
        '--rotate':
          jumpDirection !== 0
            ? rotate.to((value) => `${value * Math.PI}`).to((value) => value + 'rad')
            : `${scrollPosition * Math.PI}rad`
      }}
    >
      <Square strokeWidth={2} />
    </Container>
  );
}

export default PositionMarker;
