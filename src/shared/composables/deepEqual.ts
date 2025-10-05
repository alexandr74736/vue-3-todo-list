import isObject from './isObject';

export default function deepEqual(object1: unknown, object2: unknown): boolean {
  if (
    object1 === null ||
    object1 === undefined ||
    object2 === null ||
    object2 === undefined
  ) {
    return object1 === object2;
  }

  if (isObject(object1) && isObject(object2)) {
    const keys1 = Object.keys(object1 as Record<string, unknown>);
    const keys2 = Object.keys(object2 as Record<string, unknown>);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (let key of keys1) {
      const val1 = (object1 as Record<string, unknown>)[key];
      const val2 = (object2 as Record<string, unknown>)[key];
      const areObjects = isObject(val1) && isObject(val2);
      if (
        (areObjects && !deepEqual(val1, val2)) ||
        (!areObjects && val1 !== val2)
      ) {
        return false;
      }
    }
    return true;
  } else if (Array.isArray(object1) && Array.isArray(object2)) {
    if (object1.length !== object2.length) {
      return false;
    }

    for (let i = 0; i < object1.length; i++) {
      if (!deepEqual(object1[i], object2[i])) {
        return false;
      }
    }
    return true;
  }
  
  return object1 === object2;
}