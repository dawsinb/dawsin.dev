import { useEffect } from 'react';
import useScroll from 'Utils/stores/scroll';
import ScrollOverlay from 'Components/scroll/overlay/ScrollOverlay';

interface ScrollHandlerProps {
  numSections: number;
  sectionNames?: string[];
  wheelStrength?: number;
  touchStrength?: number;
}

function ScrollHandler({ numSections, sectionNames = [], wheelStrength = 0.075, touchStrength = 3.5 }: ScrollHandlerProps) {
  // update scroll store with number of sections
  useScroll.setState({ maxScroll: numSections - 1 });

  // get update functions from the store
  const applyScrollDelta = useScroll((state) => state.applyScrollDelta);
  const snapScrollPosition = useScroll((state) => state.snapScrollPosition);

  // id of current timeout so old timeouts can be cleared as scrolling happens
  let timeout: NodeJS.Timeout;

  /* scrolling via mouse wheel */

  const handleWheel = (event: WheelEvent) => {
    // adjust scroll position
    applyScrollDelta((event.deltaY / 100) * wheelStrength);

    // set/reset timeout
    clearTimeout(timeout);
    timeout = setTimeout(snapScrollPosition, 500);
  };

  /* scrolling via touch */

  // tracker for previous touch y position so we can calculate how much
  let previousY: number;
  let activeTouch: Touch;

  // initialize previous y on start
  const handleTouchstart = (event: TouchEvent) => {
    // update active touch on only an initial touch event
    if (event.touches.length === 1) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      activeTouch = event.touches.item(0)!;
      previousY = activeTouch.clientY;
    }
  };

  // update scroll on move
  const handleTouchmove = (event: TouchEvent) => {
    // ensure we are tracking the active touch
    if (event.touches.item(0)?.identifier === activeTouch.identifier) {
      // calculate and apply normalized delta
      const scrollDelta = previousY - activeTouch.clientY;
      applyScrollDelta((scrollDelta / window.innerHeight) * touchStrength);

      // update previous position
      previousY = activeTouch.clientY;
    }
  };

  // call snap function when no more touches
  const handleTouchend = (event: TouchEvent) => {
    if (event.touches.length === 0) {
      // set/reset timeout
      clearTimeout(timeout);
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

  return <ScrollOverlay numSections={numSections} sectionNames={sectionNames} />;
}

export default ScrollHandler;
