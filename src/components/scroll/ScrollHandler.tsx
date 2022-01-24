/**
 * @module Components/ScrollHandler
 * @mergeTarget
 */

import { useEffect } from 'react';
import { useScroll } from 'Stores/scroll';
import { ScrollOverlay } from 'Components/scroll/overlay/ScrollOverlay';

/** Props for {@link ScrollHandler} */
interface ScrollHandlerProps {
  /** Number of sections, needed to set max scroll range */
  numSections: number;
  /** Optional list of titles for each section to be displayed in {@link ScrollOverlay} */
  sectionNames?: string[];
  /** Optional list of japanese titles for each section to be displayed in {@link ScrollOverlay} */
  sectionNamesJp?: string[];
  /** Amount of the page a single movement of the scroll wheel scrolls
   *
   *  *defaults to 1 / 12*
   */
  wheelStrength?: number;
  /**
   * Amount that the movement of a touch is multiplied by.
   * In other words `1 / wheelStrength` gives the percentage of the screen that must be moved for a full page scroll
   *
   * *defaults to 3.5*
   */
  touchStrength?: number;
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
function ScrollHandler({
  numSections,
  sectionNames = [],
  sectionNamesJp = [],
  wheelStrength = 1 / 14,
  touchStrength = 3.5
}: ScrollHandlerProps) {
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
  }, []);

  return <ScrollOverlay numSections={numSections} sectionNames={sectionNames} sectionNamesJp={sectionNamesJp} />;
}

export { ScrollHandler };
export type { ScrollHandlerProps };
