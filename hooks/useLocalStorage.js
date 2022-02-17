import { useCallback, useSyncExternalStore } from "react";
import {
  localStorageGetItem,
  localStorageSetItem,
} from "../utils/localStorage";

// Forked from https://usehooks.com/useLocalStorage/
export default function useLocalStorage(key, initialValue) {
  const serializedValue = useSyncExternalStore(
    function subscribe(callback) {
      window.addEventListener("storage", callback);
      return function unsubscribe() {
        window.removeEventListener("storage", callback);
      };
    },
    function getSnapshot() {
      try {
        return localStorageGetItem(key);
      } catch (error) {
        console.error(error);
      }

      return typeof initialValue === "function" ? initialValue() : initialValue;
    }
  );

  const parsedValue = JSON.parse(serializedValue);

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore =
          value instanceof Function ? value(parsedValue) : value;
        localStorageSetItem(key, JSON.stringify(valueToStore));

        // Notify listeners that this setting has changed.
        window.dispatchEvent(new Event(key));
      } catch (error) {
        console.error(error);
      }
    },
    [key, parsedValue]
  );

  return [parsedValue, setValue];
}
