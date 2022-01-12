import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSpring } from '@react-spring/core';
import { animated } from '@react-spring/web';
import useScroll from 'Utils/hooks/useScroll';
import { lerp } from 'Utils/math';
import Square from 'Components/scroll/overlay/Square';

// eslint-disable-next-line no-unused-vars
const Container = styled(({ isVertical, scaledSize, ...props }) => <animated.div {...props} />)`
  z-index: 1;
  position: absolute;
  width: ${(props) => props.scaledSize}px;
  height: ${(props) => props.scaledSize}px;
  right: ${(props) => (props.isVertical ? `calc(50% + ${props.offset}px)` : `${props.size * 2}px`)};
  top: ${(props) => (props.isVertical ? 'auto' : `calc(50% - ${props.offset}px)`)};
  bottom: ${(props) => (props.isVertical ? `${props.size * 2}px` : 'auto')};
  transform: translate(${(props) => props.scaledSize / 2}px, ${(props) => props.scaledSize / 2}px)
    translate(${(props) => (props.isVertical ? `var(--shift, 0px), 0px` : `0px, var(--shift, 0px)`)})
    rotateZ(var(--rotate, 0rad));
  user-select: none;
`;

function PositionMarker({ isVertical, size, offsetDistance, numSections, jumpDirection }) {
  const scaleFactor = 2.25;
  const startOffset = (offsetDistance * (numSections + (isVertical ? -1 : 1))) / 2;

  const [scrollPosition, setScrollPosition] = useState(0);

  // set up transient subscription to the scroll position
  const scrollRef = useScroll();

  // set up animation loop to keep scroll position up to date
  const animationRef = useRef();
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
      size={size}
      scaledSize={Math.ceil(size * scaleFactor)}
      offset={startOffset}
      isVertical={isVertical}
      style={{
        '--shift': `${scrollPosition * offsetDistance}px`,
        '--rotate':
          jumpDirection !== 0 ? rotate.to((value) => `${value * Math.PI}rad`) : `${scrollPosition * Math.PI}rad`
      }}
    >
      <Square strokeWidth={2} />
    </Container>
  );
}

export default PositionMarker;
