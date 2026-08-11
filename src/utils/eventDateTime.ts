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
  const startDate = new Date(startIso);
  const endDate = new Date(endIso);
  const start = startDate.toLocaleTimeString(tag, opts);
  const end = endDate.toLocaleTimeString(tag, opts);

  const sameDay =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate();

  if (sameDay) {
    return `${start} - ${end}`;
  }

  const endDateLabel = endDate.toLocaleDateString(tag, {
    day: "numeric",
    month: "short",
  });
  return `${start} - ${end} (${endDateLabel})`;
};

export const formatHourBucket = (isoStr: string, locale: string) => {
  const date = new Date(isoStr);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleTimeString(localeToIntlTag(locale), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
