// SMELL: configurable data at low levels. The service URL, the timeout and the number of
// retries are buried in a deep helper function. To switch environment or policy you have
// to dig into the code and edit it.
export type Fetcher = (url: string, timeoutMs: number) => Promise<string>;

async function requestWithRetry(path: string, fetcher: Fetcher): Promise<string> {
  const url = "https://api.shop-production.com/v1" + path; // SMELL: hardcoded production URL
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    // SMELL: hardcoded 3 retries
    try {
      return await fetcher(url, 5000); // SMELL: hardcoded timeout
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

export function loadCatalog(fetcher: Fetcher): Promise<string> {
  return requestWithRetry("/catalog", fetcher);
}
