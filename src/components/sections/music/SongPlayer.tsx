import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { PlaybackSvg } from './PlaybackSvg';
import { DynamicText } from 'Components/DynamicText';
import { Playback } from '@ninefour/euphony';

const Container = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

interface PlaybackButtonContainerProps {
  $size: number;
}
const PlaybackButtonContainer = styled('div')<PlaybackButtonContainerProps>`
  width: ${({ $size }) => $size}px;
  margin-right: ${({ $size }) => $size / 4}px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

interface TextContainerProps {
  $size: number;
}
const TextContainer = styled('div')<TextContainerProps>`
  height: ${({ $size }) => $size / 3}px;
  text-overflow: clip;
  white-space: nowrap;
  display: block;
  color: rgba(255, 255, 255, 0.8);
`;

interface SongPlayerProps {
  playback: Playback;
  id: string;
  title: string;
  handler: (id: string) => void;
  color: string;
  size: number;
}
function SongPlayer({ playback, id, title, handler, color, size }: SongPlayerProps) {
  const [progress, setProgress] = useState(0);

  // set up animation loop
  const requestRef = useRef<number>(0);
  const tick = () => {
    // update song progress
    setProgress(playback.getPlaybackTime() / playback.duration);

    // request next animation tick
    requestRef.current = requestAnimationFrame(tick);
  };
  // start animation loop
  useEffect(() => {
    requestRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <Container>
      <PlaybackButtonContainer $size={size} onClick={() => handler(id)}>
        <PlaybackSvg color={color} isPlaying={progress > 0} progress={progress} />
      </PlaybackButtonContainer>

      <TextContainer $size={size}>
        <DynamicText>
          <i>{title}</i>
        </DynamicText>
      </TextContainer>
    </Container>
  );
}

export { SongPlayer };
