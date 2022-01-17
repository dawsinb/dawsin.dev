/**
 * @module Components/ScrollOverlay
 * @mergeTarget
 */

/** Props for {@link Square} */
interface SquareProps {
  /** Side length of the square relative to the stroke width */
  sideLength?: number;
  /** Size of the outline of the circle relative to the side length */
  strokeWidth?: number;
}
/**
 * Svg square element of {@link ScrollOverlay}. Has a white outline and translucent fill
 * @param props
 * @category Component
 */
function Square({ sideLength = 100, strokeWidth = 2 }: SquareProps) {
  return (
    <svg
      viewBox={`
        ${-strokeWidth / 2} 
        ${-strokeWidth / 2} 
        ${sideLength + strokeWidth} 
        ${sideLength + strokeWidth}
      `}
    >
      <rect
        width={sideLength}
        height={sideLength}
        strokeWidth={strokeWidth}
        stroke={'white'}
        fill={'white'}
        fillOpacity={0.1}
      />
    </svg>
  );
}

export { Square };
export type { SquareProps };
