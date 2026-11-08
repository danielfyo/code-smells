import { useEffect, useState } from "react";

export type SearchApi = (query: string, signal?: AbortSignal) => Promise<string[]>;

// REFACTOR: the effect cleanup marks the request as stale (and aborts it if the API
// supports it). Only the response for the current search may update state.
export function ProductSearch({ query, search }: { query: string; search: SearchApi }) {
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    let isCurrent = true;
    search(query, controller.signal)
      .then((data) => {
        if (isCurrent) setResults(data);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) throw error;
      });
    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, [query, search]);

  return (
    <ul aria-label={`Results for ${query}`}>
      {results.map((r) => (
        <li key={r}>{r}</li>
      ))}
    </ul>
  );
}
