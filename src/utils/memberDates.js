export const HIJRI_DATE_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|30)$/;

export const isValidHijriDate = (value) => {
  const match = HIJRI_DATE_PATTERN.exec(String(value || "").trim());
  return Boolean(match && Number(match[1]) >= 1200 && Number(match[1]) <= 1600);
};

export const HIJRI_MONTHS = ["Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani", "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qadah", "Dhu al-Hijjah"];

export const gregorianToHijriParts = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "UTC" }).formatToParts(date);
  const part = (type) => Number(parts.find((item) => item.type === type)?.value);
  return { year: part("year"), month: part("month"), day: part("day") };
};

const monthCache = new Map();
export const getHijriMonthDays = (year, month) => {
  const key = `${year}-${month}`;
  if (monthCache.has(key)) return monthCache.get(key);
  const approximateYear = Math.floor((year * 354.367) / 365.2425) + 622;
  const cursor = new Date(Date.UTC(approximateYear - 1, 0, 1));
  const days = [];
  for (let index = 0; index < 1100; index += 1) {
    const parts = gregorianToHijriParts(cursor);
    if (parts?.year === year && parts.month === month) days.push({ day: parts.day, weekday: cursor.getUTCDay() });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  const result = days.toSorted((first, second) => first.day - second.day);
  monthCache.set(key, result);
  return result;
};

export const formatPatrolPeriod = (entry) => {
  const format = (value) => new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  return `${format(entry.fromDate)} — ${entry.toDate ? format(entry.toDate) : "Present"}`;
};
