export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  ) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  const objectA = a as Record<string, unknown>;
  const objectB = b as Record<string, unknown>;

  return keysA.every(
    (key) => keysB.includes(key) && deepEqual(objectA[key], objectB[key]),
  );
}
