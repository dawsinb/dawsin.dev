import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useScroll } from 'stores/scroll';
import { ScrollHandler } from 'components/scroll/ScrollHandler';

describe('ScrollHandler Tests', () => {
  // switch to fake timers
  jest.useFakeTimers();

  // render component
  render(<ScrollHandler numSections={3} />);

  beforeEach(() => {
    // reset scroll
    useScroll.setState({ scrollPosition: 0 });
  });

  test('Wheel Scrolling', () => {
    // scrolling should start at 0
    expect(useScroll.getState().scrollPosition).toBeCloseTo(0);

    // scroll mouse wheel
    act(() => {
      // fire first wheel event
      fireEvent(
        window,
        new WheelEvent('wheel', {
          deltaY: 100
        })
      );
      // scroll should go to next section
      expect(useScroll.getState().scrollPosition).toBeCloseTo(1);

      // fire second wheel event
      fireEvent(
        window,
        new WheelEvent('wheel', {
          deltaY: 100
        })
      );
      // delay hasnt elapsed so additional scrolling shouldnt happen
      expect(useScroll.getState().scrollPosition).toBeCloseTo(1);

      // skip timer
      jest.runOnlyPendingTimers();

      // fire third wheel event
      fireEvent(
        window,
        new WheelEvent('wheel', {
          deltaY: -100
        })
      );
      // scroll should go back to first section
      expect(useScroll.getState().scrollPosition).toBeCloseTo(0);

      // skip timer
      jest.runOnlyPendingTimers();

      // fire third wheel event
      fireEvent(
        window,
        new WheelEvent('wheel', {
          deltaY: 50
        })
      );
      // scroll should be too weak to cause a scroll
      expect(useScroll.getState().scrollPosition).toBeCloseTo(0);
    });
  });

  test('Touch Scrolling', () => {
    // scrolling should start at 0
    expect(useScroll.getState().scrollPosition).toBeCloseTo(0);

    // create touch object
    const touch = new Touch(1, 100);

    // begin touch on screen
    act(() => {
      // fire touchstart event
      fireEvent(
        window,
        new TouchEvent('touchstart', {
          touches: new TouchList([touch])
        })
      );

      // there should be no scrolling yet
      expect(useScroll.getState().scrollPosition).toBeCloseTo(0);
    });

    // move touch
    act(() => {
      // update touch y to above
      touch.clientY = 0;

      // fire touchmove event
      fireEvent(
        window,
        new TouchEvent('touchmove', {
          touches: new TouchList([touch])
        })
      );
      // there should be no scrolling yet
      expect(useScroll.getState().scrollPosition).toBeCloseTo(0);
    });

    // release finger from screen
    act(() => {
      // fire touchend event
      fireEvent(
        window,
        new TouchEvent('touchend', {
          touches: new TouchList([])
        })
      );
      // should scroll to the next section
      expect(useScroll.getState().scrollPosition).toBeCloseTo(1);
    });
  });

  test('Touch Scrolling after Delay', () => {
    // scrolling should start at 0
    expect(useScroll.getState().scrollPosition).toBeCloseTo(0);

    // create touch object
    const touch = new Touch(1, 100);

    // begin touch on screen
    act(() => {
      // fire touchstart event
      fireEvent(
        window,
        new TouchEvent('touchstart', {
          touches: new TouchList([touch])
        })
      );

      // there should be no scrolling yet
      expect(useScroll.getState().scrollPosition).toBeCloseTo(0);
    });

    // move touch
    act(() => {
      // update touch y to above
      touch.clientY = 200;

      // fire touchmove event
      fireEvent(
        window,
        new TouchEvent('touchmove', {
          touches: new TouchList([touch])
        })
      );
      // there should be no scrolling yet
      expect(useScroll.getState().scrollPosition).toBeCloseTo(0);
    });

    // skip timer
    jest.runOnlyPendingTimers();

    // release finger from screen
    act(() => {
      // fire touchend event
      fireEvent(
        window,
        new TouchEvent('touchend', {
          touches: new TouchList([])
        })
      );
      // there should be no scrolling because the timer elapsed
      expect(useScroll.getState().scrollPosition).toBeCloseTo(0);
    });
  });

  test('Out of Bounds Scrolling', () => {
    // scrolling should start at 0
    expect(useScroll.getState().scrollPosition).toBeCloseTo(0);

    // attempt to scroll below 0
    act(() => {
      // fire first wheel event
      fireEvent(
        window,
        new WheelEvent('wheel', {
          deltaY: -100
        })
      );
      // scroll should be kept in bounds
      expect(useScroll.getState().scrollPosition).toBeCloseTo(0);
    });

    // set scroll to max and attempt to scroll past
    act(() => {
      // set to max scroll
      useScroll.setState({ scrollPosition: useScroll.getState().maxScroll });

      // fire first wheel event
      fireEvent(
        window,
        new WheelEvent('wheel', {
          deltaY: 100
        })
      );
      // scroll should be kept in bounds
      expect(useScroll.getState().scrollPosition).toBeCloseTo(useScroll.getState().maxScroll);
    });
  });
});

/* jsdom doesnt support touch events natively so we have to manually recreate them */

// create a minimal Touch class (we only care about identifier and clienty)
class Touch {
  identifier: number;
  clientY: number;

  constructor(id: number, y: number) {
    this.identifier = id;
    this.clientY = y;
  }
}

// recreate touchlist class
class TouchList {
  private touches: Touch[];
  readonly length: number;

  constructor(touches: Touch[]) {
    this.touches = touches;
    this.length = touches.length;
  }

  item(index: number): Touch | null {
    return this.touches[index];
  }
}

// recreate minimal touch event (we only need the argtype and touch list)
interface TouchEventInit extends EventInit {
  touches: TouchList;
}
class TouchEvent extends Event {
  touches: TouchList;

  constructor(typeArg: string, eventInit: TouchEventInit) {
    super(typeArg, eventInit);
    this.touches = eventInit.touches;
  }
}
