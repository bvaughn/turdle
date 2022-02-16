export function stopEvent(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}
