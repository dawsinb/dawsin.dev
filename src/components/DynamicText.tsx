/**
 * Component to automatically size text
 * @module Components/DynamicText
 * @mergeTarget
 */

import { useRef, useLayoutEffect, useEffect, ReactNode, MutableRefObject } from 'react';
import styled from 'styled-components';

/** Content container used to judge if text has overflown its bounds */
const Container = styled.div`
  width: 100%;
  height: 100%;
`;
/** Text container used to judge bounds of text */
const Text = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1px;
`;

/** Props for {@link DynamicText} */
interface DynamicTextProps {
  children: ReactNode;
}
/**
 * Automatically resizes text to perfectly fit within the bounds of the containing element
 * @param props
 * @category Component
 */
function DynamicText({ children }: DynamicTextProps) {
  // set up refs to container div and text
  const containerRef = useRef() as MutableRefObject<HTMLDivElement>;
  const textRef = useRef() as MutableRefObject<HTMLDivElement>;

  // resizes text to just before overflow
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
  };

  // execute on initial mount and when content changes
  useLayoutEffect(resize, [children]);
  // add event listener to execute on resize
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
export type { DynamicTextProps };
