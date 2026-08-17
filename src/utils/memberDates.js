export const HIJRI_DATE_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|30)$/;

export const isValidHijriDate = (value) => {
  const match = HIJRI_DATE_PATTERN.exec(String(value || "").trim());
  return Boolean(match && Number(match[1]) >= 1200 && Number(match[1]) <= 1600);
};

export const formatPatrolPeriod = (entry) => {
  const format = (value) => new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  return `${format(entry.fromDate)} — ${entry.toDate ? format(entry.toDate) : "Present"}`;
};
