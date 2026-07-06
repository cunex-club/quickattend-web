export const localeToIntlTag = (locale: string) =>
  locale === "th" ? "th-TH" : "en-US";

export const formatEventDate = (isoStr: string, locale: string) =>
  new Date(isoStr).toLocaleDateString(localeToIntlTag(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const formatEventTimeRange = (
  startIso: string,
  endIso: string,
  locale: string,
) => {
  const opts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const tag = localeToIntlTag(locale);
  const start = new Date(startIso).toLocaleTimeString(tag, opts);
  const end = new Date(endIso).toLocaleTimeString(tag, opts);
  return `${start} - ${end}`;
};
