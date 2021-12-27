import { useEffect } from 'react';
import useStore from 'Utils/store';

function ScrollHandler() {
  // get update functions from the store
  const applyScrollDelta = useStore((state) => state.applyScrollDelta);
  const snapScrollPosition = useStore((state) => state.snapScrollPosition);

  // id of current timeout so old timeouts can be cleared as scrolling happens
  let timeout = null;

  /* scrolling via mouse wheel */

  const handleWheel = (event) => {
    // adjust scroll position
    applyScrollDelta(event.deltaY / 100 / 8);
    // clear timeout if one exists
    if (timeout) {
      clearTimeout(timeout);
    }
    // call snap function after short delay
    timeout = setTimeout(snapScrollPosition, 500);
  };

  /* scrolling via touch */

  // portion of screen needed to be scrolled for a full transition
  const scrollFactor = 0.3;

  // tracker for previous touch y position so we can calculate how much
  let previousY;

  // initialize previous y on start
  const handleTouchstart = (event) => {
    // only handle first touch
    if (event.touches.length === 1) {
      previousY = event.touches.item(0).clientY;
    }
  };

  // apply normalized delta on touch move
  const handleTouchmove = (event) => {
    // calculate delta
    const scrollDelta = previousY - event.touches.item(0).clientY;

    // apply scroll normalized by the window height
    applyScrollDelta(scrollDelta / scrollFactor / window.innerHeight);

    previousY = event.touches.item(0).clientY;
  };

  // call snap function when no more touches
  const handleTouchend = (event) => {
    if (event.touches.lenghth === 0) {
      // clear timeout if one exists
      if (timeout) {
        clearTimeout(timeout);
      }
      // call snap function after short delay
      timeout = setTimeout(snapScrollPosition, 500);
    }
  };

  // register event listeners
  useEffect(() => {
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchstart);
    window.addEventListener('touchmove', handleTouchmove);
    window.addEventListener('touchend', handleTouchend);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchstart);
      window.removeEventListener('touchmove', handleTouchmove);
      window.removeEventListener('touchend', handleTouchend);
    };
  }, []);

  return null;
}

export default ScrollHandler;
