import { useRef, useLayoutEffect, useEffect, ReactNode, MutableRefObject } from 'react';
import styled from 'styled-components';

// create container and section div styles to handle scroll snapping
const Container = styled.div`
  width: 100%;
  height: 100%;
`;
const Text = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1px;
`;

interface DynamicText {
  children: ReactNode;
}
function DynamicText({ children }: DynamicText) {
  const containerRef = useRef() as MutableRefObject<HTMLDivElement>;
  const textRef = useRef() as MutableRefObject<HTMLDivElement>;

  const resize = () => {
    // only run if div is loaded
    if (containerRef.current && textRef.current) {
      // variable to hold incrementing font size
      let fontSize = 1;

      // increase size until text overflows
      let overflow = false;
      while (!overflow) {
        // increment font size
        textRef.current.style.fontSize = `${fontSize}px`;
        // check overflow
        overflow =
          containerRef.current.clientHeight < containerRef.current.scrollHeight ||
          containerRef.current.clientWidth < containerRef.current.scrollWidth;
        if (!overflow) {
          fontSize = fontSize + 0.5;
        }
      }

      // revert to last state where no overflow happened:
      textRef.current.style.fontSize = `${fontSize - 0.5}px`;
    }
    // retry in 100 ms if div isnt loaded
    else {
      setTimeout(resize, 100);
    }
  };

  // TODO: resize text when width or height of container changes
  useLayoutEffect(resize, []);
  useEffect(() => {
    window.addEventListener('resize', () => {
      resize();
    });
  }, []);

  return (
    <Container ref={containerRef}>
      <Text ref={textRef}>{children}</Text>
    </Container>
  );
}

export { DynamicText };
