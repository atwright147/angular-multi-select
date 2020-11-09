/**
 * Compare two objects deeply with dot notation tracker.
 */
export function compareFn(trackBy, current, next) {
  if (trackBy) {
    current = trackBy(null, current);
    next = trackBy(null, next);
  }

  return current === next;
}
