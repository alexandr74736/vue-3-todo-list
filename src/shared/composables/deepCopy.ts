export default function deepCopy(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const copy = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      (copy as Record<string, unknown>)[key] = deepCopy((obj as Record<string, unknown>)[key]);
    }
  }

  return copy;
}