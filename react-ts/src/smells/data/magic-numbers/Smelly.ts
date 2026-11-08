// SMELL: Magic Numbers / Magic Strings. What do 429, 500, 3, 250, 8000 or
// "fatal" mean? You have to guess. If the number of retries changes, someone
// will have to hunt down every "3" in the code and decide which is "the right one".
export function nextRetryDelay(status: number, attempt: number, errorKind: string): number | null {
  if (errorKind === "fatal") return null;
  if (status !== 429 && status < 500) return null;
  if (attempt >= 3) return null;
  return Math.min(250 * 2 ** attempt, 8000);
}
