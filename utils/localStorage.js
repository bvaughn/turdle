export function localStorageGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

export function localStorageRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {}
}

export function localStorageSetItem(key, value) {
  try {
    localStorage.setItem(key, value);

    // Support useSyncExternalStore()
    window.dispatchEvent(new Event("storage"));
  } catch (error) {}
}
