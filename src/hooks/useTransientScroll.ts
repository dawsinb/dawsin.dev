/**
 * Custom hooks to provide utility within react components
 * @module Hooks
 * @mergeTarget
 */

import { useRef, useEffect } from 'react';
import { useScroll } from 'stores/scroll';

/**
 * Creates a transient subscription to the scroll position of {@link useScroll} to allow for tracking of the scroll position without causing a rerender
 * @returns A react ref containing the scroll position
 */
function useTransientScroll() {
  // store scroll position in a ref so that it is preserved on rerender and doesn't cause a rerender itself
  const scrollRef = useRef(useScroll.getState().scrollPosition);

  // register transient subscription to the scroll position
  useEffect(() => {
    useScroll.subscribe(
      (state) => state.scrollPosition,
      (scrollPosition) => (scrollRef.current = scrollPosition)
    );
  }, []);

  return scrollRef;
}

export { useTransientScroll };
