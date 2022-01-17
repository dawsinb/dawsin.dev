/**
 * @module Components/ScrollOverlay
 * @mergeTarget
 */

/** Props for {@link Circle} */
interface CircleProps {
  /** Size of the diameter of the circle relative to the stroke width */
  diameter?: number;
  /** Size of the outline of the circle relative to the diameter */
  strokeWidth?: number;
}
/**
 * Svg circle element of {@link ScrollOverlay}. Has a white outline and translucent fill
 * @param props
 * @category Component
 */
function Circle({ diameter = 100, strokeWidth = 2 }: CircleProps) {
  return (
    <svg
      viewBox={`
        ${-strokeWidth} 
        ${-strokeWidth} 
        ${diameter + strokeWidth * 2} 
        ${diameter + strokeWidth * 2}
      `}
    >
      <circle
        r={diameter / 2}
        cx={diameter / 2}
        cy={diameter / 2}
        strokeWidth={strokeWidth}
        stroke={'white'}
        fill={'white'}
        fillOpacity={0.1}
      />
    </svg>
  );
}

export { Circle };
export type { CircleProps };
