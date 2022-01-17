import { useCallback, useEffect, useRef, useState } from 'react';

function useStateCallback<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue);
  const callbackRef = useRef<() => void>();
  const isFirst = useRef(true);

  useEffect(() => {
    // dont run on initial render
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
    callbackRef.current = callback;

    if (newValue instanceof Function) {
      setValue((prevValue) => newValue(prevValue));
    } else {
      setValue(newValue);
    }
  }, []);

  return [value, setValueCallback] as const;
}

// provide type definition for setter function
type SetValue<T> = (newValue: T | ((prevValue?: T) => T), callback?: () => void) => void;

export default useStateCallback;
export type { SetValue };
