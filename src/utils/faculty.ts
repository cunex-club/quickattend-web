import faculties from "./faculty.json";

const thFacultyNames = faculties.th as Record<string, string>;
const enFacultyNames = faculties.en as Record<string, string>;

export const FacultyCodeMap: Record<string, number> = Object.fromEntries(
  Object.entries(thFacultyNames).map(([code, name]) => [name, Number(code)]),
);

export const FacultyNameEnByCode: Record<number, string> = Object.fromEntries(
  Object.entries(enFacultyNames).map(([code, name]) => [Number(code), name]),
);

export const FacultyList: string[] = Object.keys(FacultyCodeMap).sort((a, b) =>
  a.localeCompare(b, "th"),
);

export const FacultyOptions: { th: string; en: string }[] = FacultyList.map(
  (th) => ({ th, en: FacultyNameEnByCode[FacultyCodeMap[th]] ?? "" }),
);

export const FacultyEnByTh: Record<string, string> = Object.fromEntries(
  FacultyOptions.map(({ th, en }) => [th, en]),
);

export const FacultyThByEnLower: Record<string, string> = Object.fromEntries(
  FacultyOptions.map(({ th, en }) => [en.toLowerCase(), th]),
);

export function filterFacultyOptions(query: string): string[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  return FacultyOptions.filter(
    ({ th, en }) =>
      th.includes(query) || en.toLowerCase().includes(normalizedQuery),
  ).map(({ th }) => th);
}
