import { useCallback, useEffect, useRef, useState } from 'react';

function useStateCallback(initialValue: unknown) {
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
  const setValueCallback = useCallback((newVal: unknown, callback: () => void) => {
    callbackRef.current = callback;
    setValue(newVal);
  }, []);

  return [value, setValueCallback];
}

export default useStateCallback;
