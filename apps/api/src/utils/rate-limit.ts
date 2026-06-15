const DEFAULT_RETRY_DELAY_MS = 10_000;

export const extractRetryDelayMs = (error: unknown): number => {
  if (!(error instanceof Error)) {
    return DEFAULT_RETRY_DELAY_MS;
  }
  const match = error.message.match(/retry in (\d+(?:\.\d+)?)\s*s/i);
  if (match?.[1]) {
    return Math.ceil(parseFloat(match[1])) * 1000 + 1_000; // +1s buffer
  }
  return DEFAULT_RETRY_DELAY_MS;
};

export const isRateLimitError = (error: unknown): boolean => {
  if (!(error instanceof Error)) {
    return false;
  }
  return (
    error.message.includes("429") ||
    error.message.includes("RESOURCE_EXHAUSTED") ||
    error.message.includes("Quota exceeded")
  );
};
