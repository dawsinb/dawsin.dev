/**
 * Components used for the portfolio section of the app
 * @module Components/Sections/Portfolio
 * @mergeTarget
 */

import styled from 'styled-components';

/** Container for {@link Arrow} */
const Container = styled('div')`
  width: 100%;
  cursor: pointer;
  // expand slightly on hover
  &:hover {
    transform: scale(1.05);
  }
  // move down to simulate being pressed on click
  &:active {
    transform: translateY(2%);
  }
`;

/** Props for {@link ArrowSvg} */
interface ArrowSvgProps {
  $isLeft?: boolean;
}
/** Styles for SVG element; determines rotation if left or right */
const ArrowSvg = styled('svg')<ArrowSvgProps>`
  transform: rotateY(${({ $isLeft }) => ($isLeft ? 180 : 0)}deg);
`;

/** Props for {@link Arrow} */
interface ArrowProps {
  /** Color of the arrow */
  color: string;
  /** Determines direction the arrow faces */
  isLeft?: boolean;
}
/**
 * Displays an arrow svg of the given color and direction
 * @param props
 * @returns
 */
function Arrow({ color, isLeft }: ArrowProps) {
  return (
    <Container>
      <ArrowSvg viewBox="0 0 60 100" $isLeft={isLeft}>
        <polygon fill={color} points="0,0 60,50 0,100 0,75 25,50 0,25" />
      </ArrowSvg>
    </Container>
  );
}

export { Arrow };
export type { ArrowProps };
