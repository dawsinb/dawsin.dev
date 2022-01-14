import styled from 'styled-components';
import { animated } from '@react-spring/web';
import useStore from 'Utils/hooks/useStore';
import Circle from 'Components/scroll/overlay/Circle';
import Square from 'Components/scroll/overlay/Square';

const Container = styled('div')`
  position: absolute;
  right: ${(props) => (props.isVertical ? `calc(50% - ${props.offset}px)` : `0px`)};
  top: ${(props) => (props.isVertical ? 'auto' : `calc(50% - ${-props.offset}px)`)};
  bottom: ${(props) => (props.isVertical ? `0px` : 'auto')};
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MarkerContainer = styled(({ isVertical, ...props }) => <div {...props} />)`
  position: absolute;
  top: ${(props) => (props.isVertical ? 'auto' : '0')};
  bottom: ${(props) => (props.isVertical ? `${-props.size / 2 + props.size * 2}px` : 'auto')};
  right: ${(props) => (props.isVertical ? 0 : props.size * 2)}px;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  transform: translate(${(props) => props.size / 2}px, ${(props) => -props.size / 2}px);
  cursor: pointer;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TextContainer = styled(({ isVertical, ...props }) => <animated.div {...props} />)`
  position: absolute;
  top: ${(props) => (props.isVertical ? 'auto' : '0')};
  right: ${(props) => (props.isVertical ? `0` : `${props.size * 4.5}px`)};
  bottom: ${(props) => (props.isVertical ? `${props.size * 4}px` : 'auto')};
  transform: translate(
      ${(props) => (props.isVertical ? `${props.size / 2.2}px, ${-props.size}px` : `0px, ${-props.size / 1.7}px`)}
    )
    translate(${(props) => (props.isVertical ? `0px, var(--offset, 0px)` : `var(--offset, 0px), 0px`)});
  white-space: nowrap;
  text-align: right;
  font-size: ${(props) => props.size * (props.isVertical ? 0.8 : 0.9)}px;
  writing-mode: ${(props) => (props.isVertical ? 'vertical-lr' : 'horizontal-lr')};
  text-orientation: ${(props) => (props.isVertical ? 'upright' : 'horizontal')};
`;

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
}) {
  // update scroll position and positionMarker spin on click
  const handleClick = () => {
    if (active) {
      // use setJumpDirection of the positionMarker to set spin
      setJumpDirection(
        // set state
        (prevValue) => {
          let newValue = prevValue + Math.sign(breakpoint - useStore.getState().scrollPosition);
          if (newValue === 0) {
            newValue = Math.sign(breakpoint - useStore.getState().scrollPosition);
          }
          return newValue;
        },
        // callback after state is set
        () => {
          // reset/set timeout for resetting the jump direction
          clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setJumpDirection(0);
          }, 2500);

          // update the scroll position to the breakpoint of the marker
          useStore.setState({ scrollPosition: breakpoint });
        }
      );
    }
  };

  return (
    <Container isVertical={isVertical} offset={offset}>
      <MarkerContainer onClick={handleClick} isVertical={isVertical} size={size}>
        {isStartEnd ? <Circle /> : <Square />}
      </MarkerContainer>

      <TextContainer
        isVertical={isVertical}
        size={size}
        style={{
          opacity: textToggle.to({ output: [0, 1] }),
          '--offset': textToggle.to({ output: [size * 2, 0] }).to((value) => `${value}px`)
        }}
      >
        {title}
      </TextContainer>
    </Container>
  );
}

export default SectionMarker;
