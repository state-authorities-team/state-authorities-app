import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export function parseExpiresInToSeconds(value: string): number {
  const num = parseInt(value, 10);
  if (Number.isNaN(num)) {
    return 7 * 24 * 60 * 60;
  }
  const unit = value.slice(String(num).length).trim().toLowerCase();
  switch (unit) {
    case "m":
      return num * 60;
    case "h":
      return num * 3600;
    case "d":
      return num * 86400;
    default:
      return num;
  }
}

export function buildExportTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

const SUPPORTED_FORMATS = [
  "DD.MM.YYYY HH:mm:ss",
  "DD.MM.YYYY HH:mm",
  "DD.MM.YYYY",
  "DD/MM/YYYY HH:mm:ss",
  "DD/MM/YYYY HH:mm",
  "DD/MM/YYYY",
  "DD-MM-YYYY HH:mm:ss",
  "DD-MM-YYYY HH:mm",
  "DD-MM-YYYY",
  "YYYY-MM-DD HH:mm:ss",
  "YYYY-MM-DD HH:mm",
  "YYYY-MM-DD",
];

export function parseDate(rawDateStr: string): Date {
  if (!rawDateStr) {
    return new Date();
  }

  const cleaned = rawDateStr.trim();

  // Try to parse strictly using one of our supported formats
  const parsed = dayjs(cleaned, SUPPORTED_FORMATS, true);
  if (parsed.isValid()) {
    // Reconstruct the date explicitly in Europe/Kyiv timezone to prevent server timezone drift
    return dayjs.tz(parsed.format("YYYY-MM-DD HH:mm:ss"), "Europe/Kyiv").toDate();
  }

  // Fallback to standard/native parsing if none of the strict templates match
  const fallback = dayjs(cleaned);
  return fallback.isValid() ? fallback.toDate() : new Date();
}
