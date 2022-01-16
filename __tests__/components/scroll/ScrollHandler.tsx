import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import useScroll from 'Utils/stores/scroll';
import {ScrollHandler} from 'Components/scroll/ScrollHandler';


describe('ScrollHandler Tests', () => {
  // define window size
  Object.defineProperty(window, 'innerWidth', { value: 1920 });
  Object.defineProperty(window, 'innerHeight', { value: 1080 });

  // scroll handler params
  const wheelStrength = 0.1;
  const touchStrength = 3.5;

  // single mouse wheel has delta of 100 positive or negative
  const deltaY = 100;

  test('Render', () => {
    const { container } = render(<ScrollHandler numSections={5} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  beforeEach(() => {
    // switch to fake timers
    jest.useFakeTimers();
    // reset scroll
    useScroll.setState({ scrollPosition: 0 });
    // render component
    render(<ScrollHandler numSections={3} wheelStrength={wheelStrength} touchStrength={touchStrength} />);
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
          deltaY: deltaY
        })
      );
      // scroll should have happened but no snap
      expect(useScroll.getState().scrollPosition).toBeCloseTo(1 * wheelStrength);

      // fire second wheel event
      fireEvent(
        window,
        new WheelEvent('wheel', {
          deltaY: deltaY
        })
      );
      // additional scroll should have happened but no snap
      expect(useScroll.getState().scrollPosition).toBeCloseTo(2 * wheelStrength);

      // skip snap timer
      jest.runOnlyPendingTimers();
      // scroll should snap to nearest whole number
      expect(useScroll.getState().scrollPosition).toBeCloseTo(Math.round(2 * wheelStrength));
    });
  });

  test('Touch Scrolling', () => {
    // scrolling should start at 0
    expect(useScroll.getState().scrollPosition).toBeCloseTo(0);

    // create touch object
    const touch = new Touch(1, 0);

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

    // move touch up screen
    const percentageOfScreenTravelled = 1 / 8;
    act(() => {
      // update touch y
      touch.clientY = -window.innerHeight * percentageOfScreenTravelled;

      // fire touchmove event
      fireEvent(
        window,
        new TouchEvent('touchmove', {
          touches: new TouchList([touch])
        })
      );
      // there should be scrolling now
      expect(useScroll.getState().scrollPosition).toBeCloseTo(percentageOfScreenTravelled * touchStrength);
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
      // there should be a delay before the snap
      expect(useScroll.getState().scrollPosition).toBeCloseTo(percentageOfScreenTravelled * touchStrength);

      // skip snap timer
      jest.runOnlyPendingTimers();
      // scroll should snap to nearest whole number
      expect(useScroll.getState().scrollPosition).toBeCloseTo(Math.round(percentageOfScreenTravelled * touchStrength));
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
          deltaY: -deltaY
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
          deltaY: deltaY
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
