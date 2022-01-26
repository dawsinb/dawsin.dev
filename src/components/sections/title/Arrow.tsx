/**
 * Components used for the title section of the app
 * @module Components/Sections/Title
 * @mergeTarget
 */

import styled from 'styled-components';
import { animated } from '@react-spring/web';

/** Styles for SVG element */
const ArrowSvg = styled('svg')`
  display: block;
`;

/** Props for {@link Arrow} */
interface ArrowProps {
  /** Color of the arrow */
  color: AnimatedValue<string>;
}
/**
 * Displays an arrow svg of the given color and direction
 * @param props
 * @returns
 */
function Arrow({ color }: ArrowProps) {
  return (
    <ArrowSvg viewBox="0 0 150 60">
      <animated.polygon fill={color} points="0,0 20,0 75,40 130,0 150,0 75,60" />
    </ArrowSvg>
  );
}

export { Arrow };
export type { ArrowProps };
