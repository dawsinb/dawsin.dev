/**
 * @module Components/Language
 * @mergeTarget
 */

/** Props for {@link LanguageSvg} */
interface LanguageSvgProps {
  /** Color of the svg */
  color: string;
  /** Size of the diameter of the svg relative to the stroke width */
  diameter?: number;
  /** Size of the outline of the svg relative to the diameter */
  strokeWidth?: number;
}
/**
 * Svg element of a globe to signify language switcher
 * @param props
 * @category Component
 */
function LanguageSvg({ color, diameter = 100, strokeWidth = 2 }: LanguageSvgProps) {
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
        stroke={color}
        fill="none"
      />
      <line x1="50" y1="0" x2="50" y2="100" stroke={color} strokeWidth={strokeWidth} />
      <line x1="0" y1="50" x2="100" y2="50" stroke={color} strokeWidth={strokeWidth} />
      <path d="M50,0 C50,0 -20,50 50,100" fill="none" stroke={color} strokeWidth={strokeWidth} />
      <path d="M50,0 C50,0 120,50 50,100" fill="none" stroke={color} strokeWidth={strokeWidth} />
      <path d="M10,20 C10,20 50,50 90,20" fill="none" stroke={color} strokeWidth={strokeWidth} />
      <path d="M10,80 C10,80 50,50 90,80" fill="none" stroke={color} strokeWidth={strokeWidth} />
    </svg>
  );
}

export { LanguageSvg };
export type { LanguageSvgProps };
