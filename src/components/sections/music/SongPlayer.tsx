import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { PlaybackSvg } from './PlaybackSvg';
import { DynamicText } from 'Components/DynamicText';
import { Playback } from '@ninefour/euphony';

/** Container to hold the SVG and Text */
const Container = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

/** Props for {@link PlaybackButtonContainer} */
interface PlaybackButtonContainerProps {
  $size: number;
}
/** Container for the playback SVG */
const PlaybackButtonContainer = styled('div')<PlaybackButtonContainerProps>`
  width: ${({ $size }) => $size}px;
  margin-right: ${({ $size }) => $size / 4}px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

/** Props for {@link TextContainer} */
interface TextContainerProps {
  $size: number;
}
/** Container for the title text */
const TextContainer = styled('div')<TextContainerProps>`
  height: ${({ $size }) => $size / 3}px;
  text-overflow: clip;
  white-space: nowrap;
  display: block;
  color: rgba(255, 255, 255, 0.8);
`;

/** Props for {@link SongPlayer} */
interface SongPlayerProps {
  /** Playback node */
  playback: Playback;
  /** Title text */
  title: string;
  /** Color of progress ring */
  color: string;
  /** Size of the SVG and text */
  size: number;
  /** Id to use for handler */
  id: string;
  /** Handler for determining play/pause status of the group */
  handler: (id: string) => void;
}
/**
 * Displays a song with a playback icon that can be started and stopped by clicking the icon.
 * A custom handler is passed to determine play/pause status of a group of songs
 * @param props
 * @returns
 */
function SongPlayer({ playback, id, title, handler, color, size }: SongPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // set up animation loop
  const requestRef = useRef<number>(0);
  const countRef = useRef<number>(0);
  const tick = () => {
    // update count
    countRef.current += 1;

    // limit update framerate
    if (countRef.current % 15 === 0) {
      // update progress and playing status
      setProgress(playback.getPlaybackTime() / playback.duration);
      setIsPlaying(playback.isPlaying);
    }

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
        <PlaybackSvg color={color} isPlaying={isPlaying} progress={progress} />
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
export type { SongPlayerProps };
