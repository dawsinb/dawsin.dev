/**
 * Test
 * @module Components/ScrollOverlay
 * @mergeTarget
 */

import styled from 'styled-components';
import { animated } from '@react-spring/web';
import { MutableRefObject, useRef } from 'react';

/** Props for {@link Background} */
interface BackgroundProps {
  /** Determines if vertical layout should be used */
  $isVertical: boolean;
  /** Handles css variables for animating css */
  style: CssProperties & {
    /** test */
    '--size': AnimatedValue<string>;
    '--opacity': AnimatedValue<number>;
  };
}
/**
 * style handler for {@link Background}
 * @category Style Provider
 */
const Background = styled(animated.div)<BackgroundProps>`
  position: absolute;
  right: ${({ $isVertical }) => ($isVertical ? 'auto' : 0)};
  bottom: ${({ $isVertical }) => ($isVertical ? 0 : 'auto')};
  height: ${({ $isVertical }) => ($isVertical ? 'var(--size, 100%)' : '100%')};
  width: ${({ $isVertical }) => ($isVertical ? '100%' : 'var(--size, 100%)')};
  opacity: var(--opacity);
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(7px);
`;

export default Background;
export type { BackgroundProps };
