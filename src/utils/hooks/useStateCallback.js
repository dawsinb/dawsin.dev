import { useCallback, useEffect, useRef, useState } from 'react';

function useStateCallback(initialValue) {
  var [value, setValue] = useState(initialValue);
  var callbackRef = useRef(null);
  var isFirst = useRef(true);

  useEffect(() => {
    // dont run on initial render
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    // execute callback if one was defined
    if (typeof callbackRef.current === 'function') {
      callbackRef.current();
    }
  }, [value]);

  // define callback
  var setValueCallback = useCallback((newVal, callback) => {
    callbackRef.current = callback;
    setValue(newVal);
  }, []);

  return [value, setValueCallback];
}

export default useStateCallback;
