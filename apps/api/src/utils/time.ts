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
