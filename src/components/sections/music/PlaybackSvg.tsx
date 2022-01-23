import { useEffect, useRef } from 'react';
import styled from 'styled-components';

/** SVG styles for {@link PlaybackSvg} */
const PlaySvg = styled('svg')`
  transform: scale(${(props) => props.scale});
  .ring {
    transition: stroke-dashoffset 0.35s;
    transform-origin: 50% 50%;
    transform: rotate(-90deg);
  }
  .icon {
    transform: scale(0.4);
    transform-origin: 50% 50%;
    transition: transform 200ms ease-out;
  }
  :hover {
    .icon {
      transform: scale(0.45);
    }
  }
`;

/** Props for {@link PlaybackSvg} */
interface PlaybackSvgProps {
  /** Color of the ring */
  color: string;
  /** Determines whether to display the play or pause icon; true for pause icon, false for play */
  isPlaying: boolean;
  /** Progress of playback as a number in the range [0, 1] with 1 being the end of the playback */
  progress: number;
  /** Diameter of the SVG in relation to the stroke width; defaults to 100 */
  diameter?: number;
  /** Stroke width of the ring in relation to the diameter; defaults to 4 */
  strokeWidth?: number;
}
/**
 * Playback svg which contains a play/pause icon and a ring to display playback progress
 * @param Props
 * @returns
 */
function PlaybackSvg({ color, isPlaying, progress, diameter = 100, strokeWidth = 4 }: PlaybackSvgProps) {
  // calculate offset for displaying progress
  const circumference = diameter * Math.PI;
  const strokeDashoffset = circumference - (Math.min(progress, 1) - 1) * circumference;

  // refs to handle icon transition animation
  const playToStop = useRef<SVGAnimateElement>(null);
  const stopToPlay = useRef<SVGAnimateElement>(null);

  // when playing status changes toggle the icon
  useEffect(() => {
    if (playToStop.current && stopToPlay.current) {
      if (isPlaying) {
        playToStop.current.beginElement();
      } else {
        stopToPlay.current.beginElement();
      }
    }
  }, [isPlaying]);

  return (
    <PlaySvg
      viewBox={`
        ${0} 
        ${0} 
        ${diameter + strokeWidth * 2} 
        ${diameter + strokeWidth * 2}
      `}
    >
      <circle
        className="ring"
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset: strokeDashoffset }}
        r={diameter / 2}
        cx={diameter / 2 + strokeWidth}
        cy={diameter / 2 + strokeWidth}
      />
      <polygon id="shape" className="icon" stroke="#c2c2c2" fill="#c2c2c2" points="15,0 105,50 105,50 15,100">
        <animate
          ref={playToStop}
          begin="indefinite"
          attributeName="points"
          fill="freeze"
          dur="200ms"
          to="4,0 104,0 104,100 4,100"
        />
        <animate
          ref={stopToPlay}
          begin="indefinite"
          attributeName="points"
          fill="freeze"
          dur="200ms"
          to="15,0 105,50 105,50 15,100"
        />
      </polygon>
    </PlaySvg>
  );
}

export { PlaybackSvg };
export type { PlaybackSvgProps };
