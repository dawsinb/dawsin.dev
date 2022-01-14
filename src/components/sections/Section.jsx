import { createContext, useRef, useContext } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { lerp } from 'Utils/math';
import useScroll from 'utils/hooks/useTransientScroll';

const ParallaxContext = createContext({ offset: 0, parallax: 1 });

// creates a section to anchor elements to a screen in a one page scroll layout
function Section({ index, parallax, children, ...props }) {
  const { size } = useThree();

  // calculate total height up to this section
  const totalHeight = index * size.height;
  // calculate position (adjust for parallax factor)
  const position = -totalHeight * parallax;

  // set up a ref to the sub group so that we can scroll it relative to the position
  const subgroupRef = useRef();
  // set up transient subscription to the scroll position
  const scrollRef = useScroll();
  // lerp y position to scroll position for a smooth scroll effect
  useFrame(() => {
    subgroupRef.current.position.y = lerp(
      subgroupRef.current.position.y,
      scrollRef.current * size.height * parallax,
      0.07
    );
  });

  return (
    <ParallaxContext.Provider value={{ offset: position, parallax: parallax }}>
      <group position={[0, position, 0]} {...props}>
        <group ref={subgroupRef}>{children}</group>
      </group>
    </ParallaxContext.Provider>
  );
}
// default to no parallax if not specified
Section.defaultProps = {
  parallax: 1
};

// creates a sub section item which can have a different parallax than the parent
function SectionItem({ parallax, children }) {
  const { size } = useThree();

  // calculate position from offset and parallax factor
  const { offset: parentOffset, parallax: parentParallax } = useContext(ParallaxContext);
  const position = parentOffset * parallax;

  // set up a ref to the sub group so that we can scroll it relative to the position
  const subgroupRef = useRef();
  // set up transient subscription to the scroll position
  const scrollRef = useScroll();
  // lerp y position to scroll position (adjusted for parallax) for a smooth scroll effect
  useFrame(() => {
    subgroupRef.current.position.y = lerp(
      subgroupRef.current.position.y,
      scrollRef.current * size.height * parallax * parentParallax,
      0.07
    );
  });

  return (
    <group position={[0, position, 0]}>
      <group ref={subgroupRef}>{children}</group>
    </group>
  );
}
// default to no parallax if not specified
SectionItem.defaultProps = {
  parallax: 1
};

export default Section;
export { Section, SectionItem, ParallaxContext };
