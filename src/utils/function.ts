const MINOR_WORDS = new Set(["of"]);

export function toTitleCase(str: string): string {
  return str
    .split(" ")
    .map((word) =>
      MINOR_WORDS.has(word.toLowerCase())
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(" ");
}

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
