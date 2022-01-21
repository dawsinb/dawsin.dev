import styled from 'styled-components';
import { useSpring } from '@react-spring/core';
import { animated } from '@react-spring/web';

interface ContainerProps {
  $size: number;
  style: CssProperties & {
    '--color': AnimatedValue<string>;
  };
}
const Container = styled(animated.div)<ContainerProps>`
  height: ${({ $size }) => $size}vh;
  width: ${({ $size }) => $size * 5}vh;
  background-color: var(--color);
  border-radius: ${({ $size }) => $size}vh;
  cursor: pointer;
  transform: translateX(1px);
`;

interface MarkerProps {
  $size: number;
  style: CssProperties & {
    '--offset': AnimatedValue<string>;
  };
}
const Marker = styled(animated.div)<MarkerProps>`
  position: absolute;
  top: 0;
  left: 50%;
  height: ${({ $size }) => $size}vh;
  width: ${({ $size }) => $size}vh;
  background-color: black;
  border-radius: 100%;
  z-index: 1;
  transform-origin: center;
  transform: translateX(-50%) translateX(var(--offset, 0)) scale(0.85);
`;

interface TextProps {
  $size: number;
  style: CssProperties & {
    '--color': AnimatedValue<string>;
  };
}
const Text = styled(animated.div)<TextProps>`
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: ${({ $size }) => $size / 1.5}vh;
  color: var(--color);
  transform: translate(-50%, -50%);
  user-select: none;
`;

interface SliderProps {
  toggle: boolean;
  size: number;
  leftColor: string;
  rightColor: string;
  onClick: () => void;
}
function Slider({ toggle, size, leftColor, rightColor, onClick }: SliderProps) {
  const { markerToggle } = useSpring({
    markerToggle: Number(toggle),
    config: {
      mass: 1,
      tension: 210,
      friction: 30,
      clamp: true
    }
  });
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
        $size={size}
        style={{
          '--color': colorToggle.to({ output: ['#cccccc', '#000000'] })
        }}
      >
        <b>{toggle ? 'mobile' : 'desktop'}</b>
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
