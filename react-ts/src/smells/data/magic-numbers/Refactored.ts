// REFACTOR: Replace Magic Literal with Symbolic Constant. Every literal has a
// name that explains its intent, and free-form strings are replaced by a union
// type the compiler checks.
export const HTTP_TOO_MANY_REQUESTS = 429;
export const HTTP_SERVER_ERROR_MIN = 500;
export const MAX_ATTEMPTS = 3;
export const BASE_BACKOFF_MS = 250;
export const MAX_BACKOFF_MS = 8000;

export type ErrorKind = "transient" | "fatal";

const isRetryableStatus = (status: number): boolean =>
  status === HTTP_TOO_MANY_REQUESTS || status >= HTTP_SERVER_ERROR_MIN;

const exponentialBackoff = (attempt: number): number => Math.min(BASE_BACKOFF_MS * 2 ** attempt, MAX_BACKOFF_MS);

export function nextRetryDelay(status: number, attempt: number, errorKind: ErrorKind): number | null {
  if (errorKind === "fatal" || !isRetryableStatus(status) || attempt >= MAX_ATTEMPTS) return null;
  return exponentialBackoff(attempt);
}
