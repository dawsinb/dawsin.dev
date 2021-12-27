import { useRef, useEffect } from 'react';
import useStore from 'Utils/store';

function useScroll() {
  // store scroll position in a ref so that it is preserved on rerender and doesn't cause a rerender itself
  const scrollRef = useRef(useStore.getState().scrollPosition);

  // register transient subscription to the scroll position
  useEffect(() => {
    useStore.subscribe(
      (state) => state.scrollPosition,
      (scrollPosition) => (scrollRef.current = scrollPosition)
    );
  }, []);

  return scrollRef;
}

export default useScroll;
