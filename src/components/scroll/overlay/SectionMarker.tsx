/**
 * Test
 * @module Components/ScrollOverlay
 * @mergeTarget
 */

import styled from 'styled-components';
import { animated, SpringValue } from '@react-spring/web';
import useScroll from 'Utils/stores/scroll';
import Circle from 'Components/scroll/overlay/Circle';
import Square from 'Components/scroll/overlay/Square';
import { SetValue } from 'Utils/hooks/useStateCallback';

interface ContainerProps {
  $isVertical: boolean;
  $offset: number;
}
const Container = styled('div')<ContainerProps>`
  position: absolute;
  right: ${({ $isVertical, $offset }) => ($isVertical ? `calc(50% - ${$offset}px)` : `0px`)};
  top: ${({ $isVertical, $offset }) => ($isVertical ? 'auto' : `calc(50% - ${-$offset}px)`)};
  bottom: ${({ $isVertical }) => ($isVertical ? `0px` : 'auto')};
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`;

interface MarkerContainerProps {
  $isVertical: boolean;
  $size: number;
}
const MarkerContainer = styled('div')<MarkerContainerProps>`
  position: absolute;
  top: ${({ $isVertical }) => ($isVertical ? 'auto' : '0')};
  bottom: ${({ $isVertical, $size }) => ($isVertical ? `${-$size / 2 + $size * 2}px` : 'auto')};
  right: ${({ $isVertical, $size }) => ($isVertical ? 0 : $size * 2)}px;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  transform: translate(${({ $size }) => $size / 2}px, ${({ $size }) => -$size / 2}px);
  cursor: pointer;
`;

interface TextContainerProps {
  $isVertical: boolean;
  $size: number;
  $offset: number;
}
const TextContainer = styled(animated.div)<TextContainerProps>`
  position: absolute;
  top: ${({ $isVertical }) => ($isVertical ? 'auto' : '0')};
  right: ${({ $isVertical, $size }) => ($isVertical ? `0` : `${$size * 4.5}px`)};
  bottom: ${({ $isVertical, $size }) => ($isVertical ? `${$size * 4}px` : 'auto')};
  transform: translate(
      ${({ $isVertical, $size }) => ($isVertical ? `${$size / 2.2}px, ${-$size}px` : `0px, ${-$size / 1.7}px`)}
    )
    translate(${({ $isVertical }) => ($isVertical ? `0px, var(--offset, 0px)` : `var(--offset, 0px), 0px`)});
  white-space: nowrap;
  text-align: right;
  font-size: ${({ $isVertical, $size }) => ($isVertical ? 0.8 : 0.9) * $size}px;
  writing-mode: ${({ $isVertical }) => ($isVertical ? 'vertical-lr' : 'horizontal-lr')};
  text-orientation: ${({ $isVertical }) => ($isVertical ? 'upright' : 'horizontal')};
`;

interface SectionMarkerProps {
  isVertical: boolean;
  isStartEnd: boolean;
  size: number;
  offset: number;
  active: boolean;
  breakpoint: number;
  title: string;
  textToggle: SpringValue<number>;
  setJumpDirection: SetValue<number>;
  timeoutRef: React.MutableRefObject<NodeJS.Timeout | undefined>;
}
function SectionMarker({
  isVertical,
  isStartEnd,
  size,
  offset,
  active,
  breakpoint,
  title,
  textToggle,
  setJumpDirection,
  timeoutRef
}: SectionMarkerProps) {
  // update scroll position and positionMarker spin on click
  const handleClick = () => {
    if (active) {
      // use setJumpDirection of the positionMarker to set spin
      setJumpDirection(
        // set state
        (prevValue) => {
          // create holder for new value
          let newValue = 0;

          // add sign of direction of movement to the previous value
          if (prevValue !== undefined) {
            newValue = prevValue + Math.sign(breakpoint - useScroll.getState().scrollPosition);
          }
          // if result add again to get non-zero value
          if (newValue === 0) {
            newValue = Math.sign(breakpoint - useScroll.getState().scrollPosition);
          }

          return newValue;
        },
        // callback after state is set
        () => {
          // reset/set timeout for resetting the jump direction
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            setJumpDirection(0);
          }, 2500);

          // update the scroll position to the breakpoint of the marker
          useScroll.setState({ scrollPosition: breakpoint });
        }
      );
    }
  };

  return (
    <Container $isVertical={isVertical} $offset={offset}>
      <MarkerContainer onClick={handleClick} $isVertical={isVertical} $size={size}>
        {isStartEnd ? <Circle /> : <Square />}
      </MarkerContainer>

      <TextContainer
        $isVertical={isVertical}
        $size={size}
        style={{
          opacity: textToggle.to({ output: [0, 1] }),
          // @ts-expect-error .to returns type Interpolation<number, string> despite the inner function only returning string
          '--offset': textToggle.to({ output: [size * 2, 0] }).to((value) => `${value}px`)
        }}
      >
        {title}
      </TextContainer>
    </Container>
  );
}

export default SectionMarker;
