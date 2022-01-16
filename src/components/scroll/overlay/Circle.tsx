/**
 * Test
 * @module Components/ScrollOverlay
 * @mergeTarget
 */

interface CircleProps {
  diameter?: number;
  strokeWidth?: number;
}

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

export default Circle;
