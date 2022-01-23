import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

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

interface PlaybackSvgProps {
  color: string;
  isPlaying: boolean;
  progress: number;
}
function PlaybackSvg({ color, isPlaying, progress }: PlaybackSvgProps) {
  const diameter = 100;
  const strokeWidth = 4;

  const circumference = diameter * Math.PI;
  const strokeDashoffset = circumference - (Math.min(progress, 1) - 1) * circumference;

  const playToStop = useRef<SVGAnimateElement>(null);
  const stopToPlay = useRef<SVGAnimateElement>(null);

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
