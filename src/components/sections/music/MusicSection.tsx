/**
 * Components for music section with audio playback and a visualizer
 * @module Components/Sections/Music
 * @mergeTarget
 */

import { useRef, useEffect, useState } from 'react';
import { BufferAttribute, BufferGeometry, Line, Vector3 } from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import styled from 'styled-components';
import { Analyser, Playback } from '@ninefour/euphony';
import { lerp } from 'utils/math';
import { useTheme } from 'stores/theme';
import { useLayout } from 'stores/layout';
import { Section, SectionItem } from 'components/sections/Section';
import { Html } from 'components/Html';
import { SongPlayer } from './SongPlayer';

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

// create objects for referring to players
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

/** Props for {@link MusicContainer} */
interface MusicContainerProps {
  $size: number;
  $isVertical: boolean;
}
/** Container for html content of {@link MusicSection} */
const MusicContainer = styled('div')<MusicContainerProps>`
  position: fixed;
  left: -22.5vw;
  top: 7.5vh;
  width: 60vw;
  height: ${({ $size }) => $size * 2}px;
  row-gap: ${({ $size }) => $size / 4}px;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  // scale up if vertical
  transform: scale(${({ $isVertical }) => ($isVertical ? 1.5 : 1)});
`;
/** Flex item sub container for {@link MusicContainer} */
const MusicItem = styled('div')`
  flex-basis: 50%;
  width: 50%;
  height: 50%;
`;

/** Props for {@link MusicSection} */
interface MusicSectionProps {
  /** Index of the {@link Section section} */
  index: number;
  /** Parallax of the {@link Section section} */
  parallax?: number;
}
/**
 * Music section which contains song playback buttons and a visualizer that reacts to the audio playing
 * @param props
 * @returns
 */
function MusicSection({ index, parallax }: MusicSectionProps) {
  // get size of canvas
  const { size } = useThree();
  // change sizing depending on if vertical layout
  const isVertical = useLayout((state) => state.isVertical);

  // calculate size of html content
  const htmlSize = size.width / 14;
  // calculate vertical scale factor of visualizer
  const scaleFactor = size.height / 4;

  // get colors
  const primary = useTheme((state) => state.primaryColor);
  const secondary = useTheme((state) => state.secondaryColor);
  // extract hex values
  const primaryHexValues = primary.match(/[0-9|a-f|A-F]{1,2}/g);
  const secondaryHexValues = secondary.match(/[0-9|a-f|A-F]{1,2}/g);
  if (!primaryHexValues || !secondaryHexValues) throw new Error('hex values not found');
  // convert hex to rgb
  const primaryRgb: number[] = primaryHexValues.map((hex) => parseInt(hex, 16) / 255);
  const secondaryRgb: number[] = secondaryHexValues.map((hex) => parseInt(hex, 16) / 255);

  // load audio
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    // load audio
    Promise.all([
      pm836.load('/music/836pm.mp3'),
      desire.load('/music/desire.mp3'),
      kakin.load('/music/kakin.mp3'),
      hydrogen.load('/music/hydrogen.mp3')
    ])
      .then(() => setIsLoaded(true))
      .catch((error) => console.error(error));
  }, []);

  // start/pause playback of given id and stop all others
  const updateCurrentlyPlaying = (id: string) => {
    if (isLoaded) {
      songs.forEach((song) => {
        // if requested song
        if (song.id === id) {
          // if currently playing pause it
          if (song.playback.isPlaying) {
            song.playback.pause();
          }
          // otherwise begin playback
          else {
            song.playback.play();
          }
        }
        // not the requested song just stop it
        else {
          song.playback.stop();
        }
      });
    }
  };

  // create geometry for the line
  const lineRef = useRef<Line>(null);
  useEffect(() => {
    // number of points for a waveform is equal to the fft size
    const numPoints = analyser.fftSize;

    // generate even distribution of points across the screen
    const points: Vector3[] = [];
    for (let i = 0; i < numPoints; i++) {
      points.push(new Vector3((i / numPoints - 0.5) * size.width, 0, 0));
    }

    // generate vertex colors
    const colors = new Float32Array(numPoints * 3);
    for (let i = 0; i < numPoints * 3; i += 3) {
      colors[i] = secondaryRgb[0];
      colors[i + 1] = secondaryRgb[1];
      colors[i + 2] = secondaryRgb[2];
    }

    // create geometry from points
    const geometry = new BufferGeometry().setFromPoints(points);
    // set vertex colors
    geometry.setAttribute('color', new BufferAttribute(colors, 3));
    geometry.getAttribute('color').needsUpdate = true;

    // attach geometry
    if (lineRef.current) {
      lineRef.current.geometry = geometry;
    }
  }, [size]);

  useFrame(() => {
    if (lineRef.current?.geometry) {
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
        const r = lerp(secondaryRgb[0], primaryRgb[0], Math.min(analyser.frequency[i] * 2, 1));
        const g = lerp(secondaryRgb[1], primaryRgb[1], Math.min(analyser.frequency[i] * 2, 1));
        const b = lerp(secondaryRgb[2], primaryRgb[2], Math.min(analyser.frequency[i] * 2, 1));
        // set left and right color
        color.setXYZ(midPoint + i, r, g, b);
        color.setXYZ(midPoint - i, r, g, b);
      }

      // signal gpu to update buffer attributes
      lineRef.current.geometry.getAttribute('position').needsUpdate = true;
      lineRef.current.geometry.getAttribute('color').needsUpdate = true;
    }
  });

  return (
    <Section index={index} parallax={parallax}>
      <SectionItem>
        {/* @ts-expect-error line conflicts with the svg namespace */}
        <line ref={lineRef} position={new Vector3(0, size.height / 6, 0)}>
          <meshBasicMaterial vertexColors />
        </line>
      </SectionItem>

      <SectionItem parallax={1}>
        <Html>
          <MusicContainer $size={htmlSize} $isVertical={isVertical}>
            {songs.map((song, index) => (
              <MusicItem key={index}>
                <SongPlayer
                  size={htmlSize}
                  playback={song.playback}
                  id={song.id}
                  title={song.title}
                  handler={updateCurrentlyPlaying}
                  color={isLoaded ? primary : '#808080'}
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
export type { MusicSectionProps };
