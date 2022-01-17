import { useRef, useEffect } from 'react';
import { useScroll } from 'Utils/stores/scroll';

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
