/**
 * Components used for the portfolio section of the app
 * @module Components/Sections/Portfolio
 * @mergeTarget
 */

import styled from 'styled-components';
import { useSpring } from '@react-spring/core';
import { animated } from '@react-spring/web';
import { useLanguage } from 'Stores/language';

/** Props for {@link Container} */
interface ContainerProps {
  // size of the slider by height in vh; length is 5 times as long
  $size: number;
  // handles spring animations
  style: CssProperties & {
    /** background color */
    '--color': AnimatedValue<string>;
  };
}
/** Container for {@link Slider} */
const Container = styled(animated.div)<ContainerProps>`
  // determine size
  height: ${({ $size }) => $size}vh;
  width: ${({ $size }) => $size * 5}vh;
  // round edges
  border-radius: ${({ $size }) => $size}vh;
  // set background color with spring
  background-color: var(--color);
  cursor: pointer;
`;

/** Props for {@link Marker} */
interface MarkerProps {
  /** size of the container */
  $size: number;
  // handles spring animations
  style: CssProperties & {
    /** background color */
    '--offset': AnimatedValue<string>;
  };
}
/** Marker circle for {@link Slider} */
const Marker = styled(animated.div)<MarkerProps>`
  position: absolute;
  background-color: black;
  // position in front
  z-index: 1;
  // position left
  left: 50%;
  top: 0;
  // determine size
  height: ${({ $size }) => $size}vh;
  width: ${({ $size }) => $size}vh;
  // round edges
  border-radius: 100%;
  // handle transforms
  transform-origin: center;
  transform: 
    // center
    translateX(-50%) // move based on spring offset
    translateX(var(--offset, 0)) // scale down slightly to leave room in the container
    scale(0.85);
`;

/** Props for {@link Text} */
interface TextProps {
  /** size of the container */
  $size: number;
  // handles spring animations
  style: CssProperties & {
    /** color of the text */
    '--color': AnimatedValue<string>;
  };
}
/** Text container for {@link Slider} */
const Text = styled(animated.div)<TextProps>`
  position: absolute;

  // calculate font size
  font-size: ${({ $size }) => $size / 1.5}vh;
  // determine color from spring
  color: var(--color);
  // position in center
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  // prevent highlighting
  user-select: none;
`;

/** Props for {@link Slider} */
interface SliderProps {
  toggle: boolean;
  size: number;
  leftColor: string;
  rightColor: string;
  onClick: () => void;
}
/**
 * Slider component to toggle devices for {@link PortfolioSection}
 * @param Props
 */
function Slider({ toggle, size, leftColor, rightColor, onClick }: SliderProps) {
  // check language for which text to use
  const isJapanese = useLanguage((state) => state.isJapanese);

  // set up spring for the marker position
  const { markerToggle } = useSpring({
    markerToggle: Number(toggle),
    config: {
      mass: 1,
      tension: 210,
      friction: 30,
      clamp: true
    }
  });
  // set up spring for the color
  const { colorToggle } = useSpring({
    colorToggle: Number(toggle),
    config: {
      mass: 1,
      tension: 120,
      friction: 40
    }
  });

  return (
    <Container
      $size={size}
      onClick={onClick}
      style={{
        '--color': colorToggle.to({ output: [leftColor, rightColor] })
      }}
    >
      <Text
        $size={size * (isJapanese ? 0.8 : 1)}
        style={{
          '--color': colorToggle.to({ output: ['#cccccc', '#000000'] })
        }}
      >
        <b>{toggle ? (isJapanese ? 'フォーン' : 'mobile') : isJapanese ? 'ノート' : 'desktop'}</b>
      </Text>
      <Marker
        $size={size}
        style={{
          '--offset': markerToggle.to({ output: [-size * 2, size * 2] }).to((value) => `${value}vh`)
        }}
      />
    </Container>
  );
}

export { Slider };
export type { SliderProps };
