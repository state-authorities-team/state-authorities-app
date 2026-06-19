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

export function parseDate(rawDateStr: string): Date {
  if (!rawDateStr) {
    return new Date();
  }

  const cleaned = rawDateStr.trim();

  // Match formats like DD.MM.YYYY or DD/MM/YYYY, with optional HH:MM[:SS]
  const match = cleaned.match(
    /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/,
  );
  if (match) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // JS Date months are 0-11
    const year = parseInt(match[3], 10);
    const hours = match[4] ? parseInt(match[4], 10) : 0;
    const minutes = match[5] ? parseInt(match[5], 10) : 0;
    const seconds = match[6] ? parseInt(match[6], 10) : 0;

    const date = new Date(year, month, day, hours, minutes, seconds);
    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  // Fallback to native parsing
  const parsed = new Date(cleaned);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}
