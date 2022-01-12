import styled from 'styled-components';
import { animated } from '@react-spring/web';

// eslint-disable-next-line no-unused-vars
const Background = styled(({ isVertical, ...props }) => <animated.div {...props} />)`
  position: absolute;
  right: ${(props) => (props.isVertical ? 'auto' : 0)};
  bottom: ${(props) => (props.isVertical ? 0 : 'auto')};
  height: ${(props) => (props.isVertical ? 'var(--size, 100%)' : '100%')};
  width: ${(props) => (props.isVertical ? '100%' : 'var(--size, 100%)')};
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(7px);
`;

export default Background;
