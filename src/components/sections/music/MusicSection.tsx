import { useRef, useEffect, useState } from 'react';
import { BufferAttribute, BufferGeometry, Line, Mesh, Vector3 } from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { Section, SectionItem } from 'components/sections/Section';
import { useTheme } from 'Stores/theme';
import { PlaybackSvg } from './PlaybackSvg';
import { SongPlayer } from './SongPlayer';
import { Html } from 'Components/Html';
import styled from 'styled-components';
import { Analyser, Playback } from '@ninefour/euphony';
import { lerp } from 'Utils/math';

const Container = styled('div')`
  width: 10vh;
  height: 10vh;
`;

interface MusicContainerProps {
  $size: number;
}
const MusicContainer = styled('div')<MusicContainerProps>`
  position: fixed;
  left: -22.5vw;
  top: 10vh;
  width: 60vw;
  height: ${({ $size }) => $size * 2}px;
  row-gap: ${({ $size }) => $size / 4}px;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
`;

const MusicItem = styled('div')`
  flex-basis: 50%;
  width: 50%;
  height: 50%;
`;

// create audio nodes
const pm836 = new Playback();
const desire = new Playback();
const kakin = new Playback();
const hydrogen = new Playback();
// create analyser to connect audio nodes into
const analyser = new Analyser();
pm836.connect(analyser);
desire.connect(analyser);
kakin.connect(analyser);
hydrogen.connect(analyser);

// load audio
Promise.all([
  pm836.load('/music/836pm.mp3'),
  desire.load('/music/desire.mp3'),
  kakin.load('/music/kakin.mp3'),
  hydrogen.load('/music/hydrogen.wav')
]).catch((error) => console.error(error));

const songs = [
  {
    playback: pm836,
    id: 'pm836',
    title: '8:36 pm'
  },
  {
    playback: desire,
    id: 'desire',
    title: 'desire'
  },
  {
    playback: kakin,
    id: 'kakin',
    title: 'kakin'
  },
  {
    playback: hydrogen,
    id: 'hydrogen',
    title: 'hydrogen'
  }
];

/** Props for {@link EndSection} */
interface EndSectionProps {
  /** Index of the {@link Section section} */
  index: number;
  /** Parallax of the {@link Section section} */
  parallax?: number;
}
/**
 * End section which contains text that morphs when moused over
 * @param props
 * @returns
 */
function MusicSection({ index, parallax }: EndSectionProps) {
  // get size of canvas
  const { size } = useThree();

  // get colors
  const primary = useTheme((state) => state.primaryColor);
  const secondary = useTheme((state) => state.secondaryColor);

  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const updateCurrentlyPlaying = (id: string) => {
    // if song is already playing find the playback and stop it
    if (currentlyPlaying === id) {
      songs.forEach((song) => {
        if (song.id === id) {
          song.playback.stop();
          setCurrentlyPlaying(null);
        }
      });
    }
    // otherwise stop any other song that is playing and play this one
    else {
      songs.forEach((song) => {
        // if it is the song thats currently playing stop it
        if (song.id === currentlyPlaying) {
          song.playback.stop();
        }
        // if its the song requested play it
        if (song.id === id) {
          song.playback.play();
          setCurrentlyPlaying(id);
        }
      });
    }
  };

  // create geometry for the line
  const lineRef = useRef<Line>(null);
  useEffect(() => {
    // number of points for a waveform is equal to the fft size
    const numPoints = analyser.fftSize;
    console.log(analyser.fftSize, analyser.frequencyBinCount);

    // generate even distribution of points across the screen
    const points: Vector3[] = [];
    const color: Vector3[] = [];
    for (let i = 0; i < numPoints; i++) {
      points.push(new Vector3((i / numPoints - 0.5) * size.width, 0, 0));
      color.push(new Vector3(0, 0, 0));
    }
    // create geometry from points
    const geometry = new BufferGeometry().setFromPoints(points);
    geometry.setAttribute('color', new BufferAttribute(new Float32Array(numPoints * 3), 3));

    // set geometry
    if (lineRef.current) {
      lineRef.current.geometry = geometry;
    }
  }, []);

  const scaleFactor = size.height / 4;
  useFrame(() => {
    if (currentlyPlaying && lineRef.current?.geometry) {
      // update waveform and frequency data
      analyser.updateWaveform();
      analyser.updateFrequency();

      // set position attribute from waveform
      const points = lineRef.current.geometry.getAttribute('position');
      for (let i = 0; i < points.count; i++) {
        points.setY(i, lerp(points.getY(i), analyser.waveform[i] * scaleFactor, 0.5));
      }

      // set color attribute from vertex
      const color = lineRef.current.geometry.getAttribute('color');
      const midPoint = points.count / 2;
      for (let i = 0; i < points.count / 2; i++) {
        // calculate rgb values
        const r = lerp(42, 230, Math.min(analyser.frequency[i] * 2, 1)) / 255;
        const g = lerp(209, 0, Math.min(analyser.frequency[i] * 2, 1)) / 255;
        const b = lerp(175, 80, Math.min(analyser.frequency[i] * 2, 1)) / 255;
        // set left and right color
        color.setXYZ(midPoint + i, r, g, b);
        color.setXYZ(midPoint - i, r, g, b);
      }

      // signal gpu to update buffer attributes
      lineRef.current.geometry.getAttribute('position').needsUpdate = true;
      lineRef.current.geometry.getAttribute('color').needsUpdate = true;
    }
  });

  const htmlSize = size.width / 14;

  return (
    <Section index={index} parallax={parallax}>
      <SectionItem>
        <line ref={lineRef} position={new Vector3(0, size.height / 8, 0)}>
          <meshBasicMaterial vertexColors />
        </line>
      </SectionItem>
      <SectionItem parallax={1}>
        <Html>
          <MusicContainer $size={htmlSize}>
            {songs.map((song, index) => (
              <MusicItem key={index}>
                <SongPlayer
                  size={htmlSize}
                  playback={song.playback}
                  id={song.id}
                  title={song.title}
                  handler={(id) => updateCurrentlyPlaying(id)}
                  color={primary}
                />
              </MusicItem>
            ))}
          </MusicContainer>
        </Html>
      </SectionItem>
    </Section>
  );
}

export { MusicSection };
