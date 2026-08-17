export const HIJRI_DATE_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|30)$/;
export const HIJRI_MONTHS = ["Moharram al-Haraam", "Safar al-Muzaffar", "Rabi al-Awwal", "Rabi al-Aakhar", "Jumada al-Ula", "Jumada al-Ukhra", "Rajab al-Asab", "Shabaan al-Kareem", "Ramadan al-Moazzam", "Shawwal al-Mukarram", "Zilqad al-Haraam", "Zilhaj al-Haraam"];
const ANCHOR_MS = Date.UTC(2026, 6, 15);
const ANCHOR_YEAR = 1448;
const ANCHOR_DAY_OF_YEAR = 30;
const DAY_MS = 86_400_000;
const LEAP_YEARS = new Set([2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29]);
const isLeap = (year) => LEAP_YEARS.has(((Number(year) - 1) % 30) + 1);
export const daysInHijriMonth = (year, month) => Number(month) === 12 ? (isLeap(year) ? 30 : 29) : (Number(month) % 2 === 1 ? 30 : 29);
const yearLength = (year) => isLeap(year) ? 355 : 354;
const yearOffset = (year) => { let days = 0; if (year >= ANCHOR_YEAR) for (let current = ANCHOR_YEAR; current < year; current += 1) days += yearLength(current); else for (let current = ANCHOR_YEAR - 1; current >= year; current -= 1) days -= yearLength(current); return days; };
const daysBeforeMonth = (year, month) => { let days = 0; for (let current = 1; current < month; current += 1) days += daysInHijriMonth(year, current); return days; };
const canonical = (year, month, day) => `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export const isValidHijriDate = (value) => {
  const match = HIJRI_DATE_PATTERN.exec(String(value || "").trim());
  if (!match) return false;
  const [year, month, day] = match.slice(1).map(Number);
  return year >= 1200 && year <= 1600 && day <= daysInHijriMonth(year, month);
};
export const hijriToGregorian = (year, month, day) => new Date(ANCHOR_MS + (yearOffset(year) + daysBeforeMonth(year, month) + day - 1 - ANCHOR_DAY_OF_YEAR) * DAY_MS);
export const gregorianToHijriParts = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  let dayOfYear = Math.round((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - ANCHOR_MS) / DAY_MS) + ANCHOR_DAY_OF_YEAR;
  let year = ANCHOR_YEAR;
  while (dayOfYear < 0) { year -= 1; dayOfYear += yearLength(year); }
  while (dayOfYear >= yearLength(year)) { dayOfYear -= yearLength(year); year += 1; }
  let month = 1;
  while (dayOfYear >= daysInHijriMonth(year, month)) { dayOfYear -= daysInHijriMonth(year, month); month += 1; }
  return { year, month, day: dayOfYear + 1, canonical: canonical(year, month, dayOfYear + 1) };
};
export const getHijriMonthDays = (year, month) => Array.from({ length: daysInHijriMonth(year, month) }, (_, index) => { const day = index + 1; return { day, weekday: hijriToGregorian(year, month, day).getUTCDay() }; });
export const formatPatrolPeriod = (entry) => { const format = (value) => new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); return `${format(entry.fromDate)} — ${entry.toDate ? format(entry.toDate) : "Present"}`; };
