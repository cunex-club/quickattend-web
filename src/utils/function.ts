export function deepEqual(a: any, b: any): boolean {
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

  return keysA.every((key) => keysB.includes(key) && deepEqual(a[key], b[key]));
}

export const timeToSeconds = (time: string) => {
  const [hour = "0", minute = "0", second = "0"] = time.split(":");
  return (
    Number.parseInt(hour, 10) * 3600 +
    Number.parseInt(minute, 10) * 60 +
    Number.parseInt(second, 10)
  );
};

export const escapeCsv = (value: string) => {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const toExcelTextValue = (value: string) => `="${value.replace(/"/g, '""')}"`;