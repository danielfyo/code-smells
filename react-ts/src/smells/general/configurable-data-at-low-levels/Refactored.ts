// REFACTOR: configuration moves up to the highest level and is injected downwards.
// Low levels receive the values; they don't decide them.
export type Fetcher = (url: string, timeoutMs: number) => Promise<string>;

export interface ApiConfig {
  baseUrl: string;
  timeoutMs: number;
  maxAttempts: number;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  baseUrl: "https://api.shop-production.com/v1",
  timeoutMs: 5000,
  maxAttempts: 3,
};

async function requestWithRetry(path: string, fetcher: Fetcher, config: ApiConfig): Promise<string> {
  let lastError: unknown;
  for (let attempt = 0; attempt < config.maxAttempts; attempt++) {
    try {
      return await fetcher(config.baseUrl + path, config.timeoutMs);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

export function loadCatalog(fetcher: Fetcher, config: ApiConfig = DEFAULT_API_CONFIG): Promise<string> {
  return requestWithRetry("/catalog", fetcher, config);
}
