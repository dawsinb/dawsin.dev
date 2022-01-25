/**
 * @module Components/ScrollHandler
 * @mergeTarget
 */

import { useEffect, useRef } from 'react';
import { useScroll } from 'stores/scroll';
import { ScrollOverlay } from './overlay/ScrollOverlay';

/** Props for {@link ScrollHandler} */
interface ScrollHandlerProps {
  /** Number of sections, needed to set max scroll range */
  numSections: number;
  /** Optional list of titles for each section to be displayed in {@link ScrollOverlay} */
  sectionNames?: string[];
  /** Optional list of japanese titles for each section to be displayed in {@link ScrollOverlay} */
  sectionNamesJp?: string[];
}
/**
 * Creates a scroll handler which updates the global scroll store. Can handle both mouse wheel/trackpad and touch scrolling.
 *
 * Also creates an interactable {@link ScrollOverlay scroll overlay} to show scroll position and allow jumping to {@link Section sections}
 *
 * The scroll store can be accessed using the {@link useTransientScroll} hook or directly using {@link useScroll}
 * @param props
 * @category Component
 */
function ScrollHandler({ numSections, sectionNames = [], sectionNamesJp = [] }: ScrollHandlerProps) {
  // update scroll store with number of sections
  useScroll.setState({ maxScroll: numSections - 1 });

  // get update function from the store
  const applyScrollDelta = useScroll((state) => state.applyScrollDelta);

  /* scrolling via mouse wheel */
  const scrollLock = useRef(false);
  const handleWheel = (event: WheelEvent) => {
    if (!scrollLock.current && Math.abs(event.deltaY) >= 100) {
      // adjust scroll position
      applyScrollDelta(Math.sign(event.deltaY));

      // lock scrolling for 1 second
      scrollLock.current = true;
      setTimeout(() => (scrollLock.current = false), 600);
    }
  };

  /* scrolling via touch */

  // track scrolling of only the first (active) touch
  const activeTouch = useRef<Touch>();
  // track direction of scroll deltas to know which direction to scroll
  const prevY = useRef(0);
  const scrolDirection = useRef(0);
  // enable scroll on start and disable after 1 sec to check for swipe gesture
  const scrollEnable = useRef(false);

  const handleTouchstart = (event: TouchEvent) => {
    // get touch from event
    const touch = event.touches.item(0);
    // only start on first touch
    if (touch && event.touches.length === 1) {
      // update active touch
      activeTouch.current = touch;
      // reset previous y and scroll direction
      prevY.current = touch.clientY;
      scrolDirection.current = 0;

      // enable scrolling for 1 second
      scrollEnable.current = true;
      setTimeout(() => (scrollEnable.current = false), 600);
    }
  };

  const handleTouchmove = (event: TouchEvent) => {
    // ensure we are tracking the active touch
    const touch = event.touches.item(0);
    if (touch && touch.identifier === activeTouch.current?.identifier) {
      // calculate scroll delta and add it to the scroll direction
      const delta = prevY.current - touch.clientY;
      scrolDirection.current += delta;

      // update prev y tracker
      prevY.current = touch.clientY;
    }
  };

  const handleTouchend = (event: TouchEvent) => {
    // apply scroll delta if scrolling is enabled and no touches are left
    if (scrollEnable.current && event.touches.length === 0) {
      applyScrollDelta(Math.sign(scrolDirection.current));
    }
  };

  // register event listeners
  useEffect(() => {
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchstart);
    window.addEventListener('touchmove', handleTouchmove);
    window.addEventListener('touchend', handleTouchend);
  }, []);

  return <ScrollOverlay numSections={numSections} sectionNames={sectionNames} sectionNamesJp={sectionNamesJp} />;
}

export { ScrollHandler };
export type { ScrollHandlerProps };
