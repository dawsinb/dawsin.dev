/**
 * @module Components/ScrollOverlay
 * @mergeTarget
 */

import { useState, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { useSpring } from '@react-spring/core';
import { animated } from '@react-spring/web';
import useTransientScroll from 'Utils/hooks/useTransientScroll';
import { lerp } from 'Utils/math';
import { ScrollOverlayContext } from 'Components/scroll/overlay/ScrollOverlay';
import { Square } from 'Components/scroll/overlay/Square';

/** Props for {@link Container} */
interface ContainerProps {
  $isVertical: boolean;
  $initialOffset: number;
}
/** Container for {@link PositionMarker} to handle positioning */
const Container = styled('div')<ContainerProps>`
  position: absolute;
  // Position center right if horizontal; center bottom if vertical; then adjust for
  right: ${({ $isVertical, $initialOffset }) => ($isVertical ? `calc(50% + ${$initialOffset}px)` : 0)};
  bottom: ${({ $isVertical, $initialOffset }) => ($isVertical ? 0 : `calc(50% + ${$initialOffset}px)`)};
`;

/** Props for {@link Marker} */
interface MarkerProps {
  $isVertical: boolean;
  $size: number;
  $scaleFactor: number;
  $initialOffset: number;
  style: CssProperties & {
    '--shift': string;
    '--rotate': string | AnimatedValue<string>;
  };
}
/** Marker style handler for {@link PositionMarker} */
const Marker = styled(animated.div)<MarkerProps>`
  position: absolute;
  user-select: none;
  // position in front of the rest of the overlay
  z-index: 2;
  // set size
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  // Position slightly away from left if horizontal; slightly away from top if vertical
  left: ${({ $isVertical, $size }) => ($isVertical ? 0 : -$size * 2)}px;
  top: ${({ $isVertical, $size }) => ($isVertical ? -$size * 2 : 0)}px;
  // Apply transforms
  transform: 
    // Center
    translate(${({ $size }) => -$size / 2}px, ${({ $size }) => -$size / 2}px)
    // If horizontal shift vertically; if vertical shift horizontally
    translate(${({ $isVertical }) => ($isVertical ? `var(--shift, 0px), 0px` : `0px, var(--shift, 0px)`)})
    // Handle rotation
    rotateZ(var(--rotate, 0rad)) // Scale
    scale(${({ $scaleFactor }) => $scaleFactor});
`;

/** Props for {@link PositionMarker} */
interface PositionMarkerProps {
  /** Base size of the marker */
  markerSize: number;
  /** Factor to scale the size of the marker by */
  scaleFactor?: number;
  /** Initial offset of the marker, should be set to the same as the first marker */
  initialOffset: number;
  /** Distance between markers, used to know how much to move the marker by when scrolling */
  offsetDistance: number;
  /** Current direction of jump scroll, used to set the rotation when jumping */
  jumpDirection: number;
}
/**
 * Postion marker of {@link ScrollOverlay}. Moves to match the scroll position to represent where in the page the user has scrolled to
 * @param props
 * @category Component
 */
function PositionMarker({
  markerSize,
  scaleFactor = 1,
  initialOffset,
  offsetDistance,
  jumpDirection
}: PositionMarkerProps) {
  // switch to vertical layout if screen size is vertical
  const { isVertical } = useContext(ScrollOverlayContext);

  // set up transient subscription to the scroll position
  const scrollRef = useTransientScroll();
  // create state to update scroll position
  const [scrollPosition, setScrollPosition] = useState(0);

  // set up animation loop to keep scroll position up to date
  const animationRef = useRef<number>(0);
  const animate = () => {
    // lerp towards scroll position for smooth ramp with damping
    setScrollPosition((prevPosition) => {
      return lerp(prevPosition, scrollRef.current, 0.07);
    });

    animationRef.current = requestAnimationFrame(animate);
  };
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  // set up spring to handle jump rotation
  const { rotate } = useSpring({ to: { rotate: jumpDirection }, config: { mass: 1, tension: 200, friction: 60 } });

  return (
    <Container $isVertical={isVertical} $initialOffset={initialOffset}>
      <Marker
        $isVertical={isVertical}
        $size={markerSize}
        $scaleFactor={scaleFactor}
        $initialOffset={initialOffset}
        style={{
          '--shift': `${scrollPosition * offsetDistance}px`,
          '--rotate':
            jumpDirection !== 0
              ? rotate.to((value) => `${value * Math.PI}`).to((value) => value + 'rad')
              : `${scrollPosition * Math.PI}rad`
        }}
      >
        <Square strokeWidth={2} />
      </Marker>
    </Container>
  );
}

export { PositionMarker };
export type { PositionMarkerProps };
