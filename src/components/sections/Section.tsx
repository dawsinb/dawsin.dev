/**
 * Test
 * @module Components/Section
 * @mergeTarget
 */

import { createContext, useRef, useContext, ReactNode } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { lerp } from 'Utils/math';
import useScroll from 'utils/hooks/useTransientScroll';
import { Group } from 'three';

/**
 * Creates a react context to allow for children to know the offset and parallax of the parent section
 *
 * Used by {@link SectionItem} to set up relative parallax
 */
const ParallaxContext = createContext({ offset: 0, parallax: 1 });

/** Props for {@link Section} */
interface SectionProps {
  /**
   * Whole number index of the section starting at 0
   *
   * ***do not skip indicies as it may lead to unexpected behavior***
   */
  index: number;
  /**
   *  Parallax factor which determines how fast the section will scroll in. Can be set to a negative number to scroll backwards
   *
   *  *defaults to 1 for regular scroll speed*
   */
  parallax?: number;
  /** Children contained within the section */
  children?: ReactNode;
}
/**
 * Creates a section to anchor elements to a screen in a one page scroll layout
 * @param props
 * @category Component
 */
function Section({ index, parallax = 1, children }: SectionProps) {
  // get screen size
  const { size } = useThree();

  // calculate total height up to this section
  const totalHeight = index * size.height;
  // calculate position (adjust for parallax factor)
  const position = -totalHeight * parallax;

  // set up a ref to the sub group so that we can scroll it relative to the position
  const subgroupRef = useRef<Group>();
  // set up transient subscription to the scroll position
  const scrollRef = useScroll();
  // lerp y position to scroll position for a smooth scroll effect
  useFrame(() => {
    if (subgroupRef.current) {
      subgroupRef.current.position.y = lerp(
        subgroupRef.current.position.y,
        scrollRef.current * size.height * parallax,
        0.07
      );
    }
  });

  return (
    <ParallaxContext.Provider value={{ offset: position, parallax: parallax }}>
      <group position={[0, position, 0]}>
        <group ref={subgroupRef}>{children}</group>
      </group>
    </ParallaxContext.Provider>
  );
}

// creates a sub section item which can have a different parallax than the parent
interface SectionItemProps {
  /**
   *  Parallax factor which determines how fast the section will scroll in relative to the parent parallax. Can be set to a negative number to scroll backwards
   *
   *  *defaults to 1, which matches the parent scroll speed*
   */
  parallax?: number;
  /** Children contained within the sub-section */
  children: ReactNode;
}
/**
 * Creates a sub-section which can have a different parallax than the parent, allowing elements within a page to be scrolled in at different rates
 * @param props
 * @category Component
 */
function SectionItem({ parallax = 1, children }: SectionItemProps) {
  // get screen size
  const { size } = useThree();

  // calculate position from offset and parallax factor
  const { offset: parentOffset, parallax: parentParallax } = useContext(ParallaxContext);
  const position = parentOffset * parallax;

  // set up a ref to the sub group so that we can scroll it relative to the position
  const subgroupRef = useRef<Group>();
  // set up transient subscription to the scroll position
  const scrollRef = useScroll();
  // lerp y position to scroll position (adjusted for parallax) for a smooth scroll effect
  useFrame(() => {
    if (subgroupRef.current) {
      subgroupRef.current.position.y = lerp(
        subgroupRef.current.position.y,
        scrollRef.current * size.height * parallax * parentParallax,
        0.07
      );
    }
  });

  return (
    <group position={[0, position, 0]}>
      <group ref={subgroupRef}>{children}</group>
    </group>
  );
}

export { Section, SectionItem, ParallaxContext };
export type { SectionProps, SectionItemProps };
