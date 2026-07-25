export const isValidPersonRefId = (value: string) =>
  /^(?:\d{8}|\d{10})$/.test(value);
