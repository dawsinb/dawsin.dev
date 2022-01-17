/**
 * Custom hooks to provide utility within react components
 * @module Hooks
 * @mergeTarget
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Wrapper for React's `useState` hook that allows a callback to be executed after the value is updated
 * @param initialValue The initial value to set the state to
 * @returns
 * An array `[value, setValueCallback]` where `value` is the readonly value of the state and `setValueCallback` is a function to set `value` with an optional callback
 *
 * *See {@link setValuecallback} for more information*
 */
function useStateCallback<T>(initialValue: T) {
  // init base setState hook
  const [value, setValue] = useState(initialValue);
  // ref to hold the callback function
  const callbackRef = useRef<() => void>();

  // ref to track if this is the initial call
  const isFirst = useRef(true);

  // register effect to execute callback when value changes
  useEffect(() => {
    // dont run on initialization
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    // execute callback if one was defined
    if (callbackRef.current) {
      callbackRef.current();
    }
  }, [value]);

  // define callback
  const setValueCallback = useCallback((newValue: T | ((prevValue?: T) => T), callback?: () => void) => {
    // update callback function
    callbackRef.current = callback;

    // set new value
    if (newValue instanceof Function) {
      setValue((prevValue) => newValue(prevValue));
    } else {
      setValue(newValue);
    }
  }, []);

  return [value, setValueCallback] as const;
}

/**
 * Set state with an optional callback function
 * @param newValue The new value to set. Can either be a plain value or a function that takes the previous value and returns a new one
 * @param callback The optional callback to execute after the new value is set and updated
 */
type SetValueCallback<T> = (newValue: T | ((prevValue?: T) => T), callback?: () => void) => void;

export { useStateCallback };
export type { SetValueCallback };
