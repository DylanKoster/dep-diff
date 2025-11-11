import fs from 'fs';

/**
 * Compare the keys of two objects.
 *
 * @param obj1 The Object with which the keys should be compared to obj2.
 * @param obj2 The Object with which the keys should be compared to obj1.
 *
 * @returns True if the keys are equal, false otherwise.
 */
export function haveSameKeys(obj1: object, obj2: object) {
  if (!obj1 || !obj2) return false;
  if (obj1 === obj2) return true;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1 === keys2) return true;
  if (keys1 == null || keys2 == null) return false;
  if (keys1.length !== keys2.length) return false;

  for (var i = 0; i < keys1.length; ++i) {
    if (keys1[i] !== keys2[i]) return false;
  }

  return true;
}
