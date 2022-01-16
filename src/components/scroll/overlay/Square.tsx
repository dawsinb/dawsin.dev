/**
 * Test
 * @module Components/ScrollOverlay
 * @mergeTarget
 */

interface SquareProps {
  sideLength?: number;
  strokeWidth?: number;
}

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

export default Square;
