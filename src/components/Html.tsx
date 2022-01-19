import { createRoot, Root } from 'react-dom';
import { useRef, useEffect, ReactNode } from "react"
import { Group, Vector3 } from "three"
import styled from 'styled-components';
import { useFrame } from '@react-three/fiber';

/** Anchor to place {@link Html} content in the center to match with the threejs coordinate system */
const HtmlAnchor = styled('div')`
  position: fixed;
  top: calc(50%);
  left: calc(50%);
`
/** Props for {@link HtmlContainer} */
interface HtmlContainerProps {
  style?: CssProperties & {
    /** Current X position of world coordinates in px */
    '--x': string;
    /** Current Y position of world coordinates in px */
    '--y': string;
  }
}
/** Container for {@link Html} content to apply CSS transforms for positioning */
const HtmlContainer = styled('div')<HtmlContainerProps>`
  position: fixed;
  transform: 
    translateX(var(--x, 0px))
    translateY(var(--y, 0px));
`

// get main root from html
const rootElement = document.getElementById('html-root');

/** Props for {@link Html} */
interface HtmlProps {
  children: ReactNode
}
/**
 * TODO: add description
 * @param props 
 * @returns 
 */
function Html({ children }: HtmlProps ) {
  // throw error if no root element was found
  if (!rootElement) throw new Error('Failed to find the root element');

  // create sub root render tree on mount
  const subRoot = useRef<Root>();
  useEffect(() => {
    // create sub root element to act as portal for html content
    const subRootElement = document.createElement('div');
    // add sub root element to the dom
    rootElement.appendChild(subRootElement);
    // create new render tree at sub root for html content
    subRoot.current = createRoot(subRootElement);
  }, [])
    

  // create ref to the child of the three render tree to get world coordinate information from the parent
  const threeChildRef = useRef<Group>()
  // vectors to track world position
  const worldPosition = new Vector3();
  const lastWorldPosition = new Vector3();

  // set up animation loop to keep position up to date
  useFrame(() => {
    // update world position
    if (threeChildRef.current?.parent) {
      threeChildRef.current.parent.getWorldPosition(worldPosition);
    }
    // check if world position has changed
    if (lastWorldPosition.y !== worldPosition.y || lastWorldPosition.x !== worldPosition.x ) {
      // update previous world position
      lastWorldPosition.copy(worldPosition);

      // re-render html content
      if (subRoot.current) {
        subRoot.current.render(
          <HtmlAnchor>
            <HtmlContainer style={{ '--x': `${worldPosition.x}px`, '--y': `${-worldPosition.y}px` }}>
              {children}
            </HtmlContainer>
          </HtmlAnchor>
        )
      }
    }
  })

  return <group ref={threeChildRef} />
}

export { Html };
export type { HtmlProps };