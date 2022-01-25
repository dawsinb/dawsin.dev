/**
 * @module Components/ScrollOverlay
 * @mergeTarget
 */

import { useContext } from 'react';
import styled from 'styled-components';
import { animated, SpringValue } from '@react-spring/web';
import { SetValueCallback } from 'Hooks/useStateCallback';
import { useScroll } from 'Stores/scroll';
import { useLanguage } from 'Stores/language';
import { Circle } from 'Components/scroll/overlay/Circle';
import { Square } from 'Components/scroll/overlay/Square';
import { ScrollOverlayContext } from 'Components/scroll/overlay/ScrollOverlay';

/** Props for {@link Container} */
interface ContainerProps {
  $isVertical: boolean;
  $offset: number;
}
/** Container for {@link SectionMarker} to handle positioning */
const Container = styled('div')<ContainerProps>`
  position: absolute;
  // position center right if horizontal; center bottom if vertical; then adjust for offset
  bottom: ${({ $isVertical, $offset }) => ($isVertical ? 0 : `calc(50% + ${$offset}px)`)};
  right: ${({ $isVertical, $offset }) => ($isVertical ? `calc(50% + ${$offset}px)` : 0)};
  // prevent highlighting
  user-select: none;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`;

/** Props for {@link MarkerContainer} */
interface MarkerContainerProps {
  $isVertical: boolean;
  $size: number;
}
/** Container for {@link SectionMarker} to handle positioning and sizing of the marker icon */
const MarkerContainer = styled('div')<MarkerContainerProps>`
  position: absolute;
  // set size
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  // position slightly away from left if horizontal; slightly away from top if vertical
  left: ${({ $isVertical, $size }) => ($isVertical ? 0 : -$size * 2)}px;
  top: ${({ $isVertical, $size }) => ($isVertical ? -$size * 2 : 0)}px;
  // apply centering transform
  transform: translate(${({ $size }) => -$size / 2}px, ${({ $size }) => -$size / 2}px);
  // change cursor to pointer when moused over
  cursor: pointer;
`;

/** Props for {@link TextContainer} */
interface TextContainerProps {
  $isVertical: boolean;
  $size: number;
  $fontSize: number;
  style: CssProperties & {
    '--opacity': AnimatedValue<number>;
    '--shift': AnimatedValue<string>;
  };
}
/** Container for {@link SectionMarker} to handle positioning and sizing of the text */
const TextContainer = styled(animated.div)<TextContainerProps>`
  position: absolute;
  // let text overflow
  white-space: nowrap;
  // set font size
  font-size: ${({ $fontSize }) => $fontSize}px;
  // set text orientation, left -> right if horizontal; top -> bottom if vertical
  writing-mode: ${({ $isVertical }) => ($isVertical ? 'vertical-lr' : 'horizontal-lr')};
  text-orientation: ${({ $isVertical }) => ($isVertical ? 'upright' : 'horizontal')};
  // position from right if horizontal; from bottom if vertical
  right: ${({ $isVertical, $size }) => ($isVertical ? 0 : $size * 5.5)}px;
  bottom: ${({ $isVertical, $size }) => ($isVertical ? $size * 5.5 : 0)}px;
  // apply transforms
  transform: 
    // center
    translate(${({ $size }) => `${$size / 2}px`}, ${({ $size }) => `${$size / 2}px`})
    // shift horizontally if horzontial and vertical if vertical
    translate(${({ $isVertical }) => ($isVertical ? `0px, var(--shift, 0px)` : `var(--shift, 0px), 0px`)});
  // apply opacity
  opacity: var(--opacity);
`;

/** Props for {@link SectionMarker} */
interface SectionMarkerProps {
  /** Determines whether to use circle or square marker; circle if true square otherwise */
  useCircle: boolean;
  /** Base size of the marker */
  markerSize: number;
  /** Offset marker in px */
  offset: number;
  /** Title of the section */
  title: string;
  /** Japanese translation of title of the section */
  titleJp: string;
  /** Index of the section; used for updating the scroll position when jumping */
  index: number;
  /** Determines if the marker is interactable; used to prevent touches from jumping to a section when opening the menu */
  active: boolean;
  /** The spring toggle for this marker's text */
  textToggle: SpringValue<number>;
  /** Function to set the jump direction used by {@link PositionMarker} to determine spin while rotating */
  setJumpDirection: SetValueCallback<number>;
  /** Timeout id to reset {@link PositionMarker} from using jump rotation after user is done jumping sections */
  timeoutRef: React.MutableRefObject<NodeJS.Timeout | undefined>;
}
/**
 * Section marker of {@link ScrollOverlay}. Represents a section of the page alongside its given title and allows the user to jump to the section by clicking the marker
 * @param props
 * @category Component
 */
function SectionMarker({
  useCircle,
  markerSize,
  offset,
  index,
  title,
  titleJp,
  active,
  textToggle,
  setJumpDirection,
  timeoutRef
}: SectionMarkerProps) {
  // switch to vertical layout if screen size is vertical
  const { isVertical } = useContext(ScrollOverlayContext);
  // determine if to use japanese text
  const isJapanese = useLanguage((state) => state.isJapanese);

  // calculate font size
  const fontSize = Math.round((isVertical && !isJapanese ? 0.8 : 0.9) * markerSize);

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
            newValue = prevValue + Math.sign(index - useScroll.getState().scrollPosition);
          }
          // if result add again to get non-zero value
          if (newValue === 0) {
            newValue = Math.sign(index - useScroll.getState().scrollPosition);
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

          // update the scroll position to the index of the marker
          useScroll.setState({ scrollPosition: index });
        }
      );
    }
  };

  return (
    <Container $isVertical={isVertical} $offset={offset}>
      <MarkerContainer onClick={handleClick} $isVertical={isVertical} $size={markerSize}>
        {useCircle ? <Circle /> : <Square />}
      </MarkerContainer>

      <TextContainer
        $isVertical={isVertical}
        $size={markerSize}
        $fontSize={fontSize}
        style={{
          '--opacity': textToggle.to({ output: [0, 1] }),
          '--shift': textToggle.to({ output: [markerSize * 2, 0] }).to((value) => `${value}px`)
        }}
      >
        {isJapanese ? titleJp : title}
      </TextContainer>
    </Container>
  );
}

export { SectionMarker };
export type { SectionMarkerProps };
