import styled from 'styled-components';
import { animated } from '@react-spring/web';

interface BackgroundProps {
  $isVertical: boolean;
  style: CssProperties & {
    '--size': AnimatedValue<number>;
    '--opacity': AnimatedValue<number>;
  };
}
const Background = styled(animated.div)<BackgroundProps>`
  position: absolute;
  right: ${({ $isVertical }) => ($isVertical ? 'auto' : 0)};
  bottom: ${({ $isVertical }) => ($isVertical ? 0 : 'auto')};
  height: ${({ $isVertical }) => ($isVertical ? 'var(--size, 100%)' : '100%')};
  width: ${({ $isVertical }) => ($isVertical ? '100%' : 'var(--size, 100%)')};
  opacity: var(--opacity);
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(7px);
`;

export default Background;
