import { useEffect, useState } from "react";

export type SearchApi = (query: string) => Promise<string[]>;

// SMELL: fetch without cancellation. If the user searches "ch" and then "chair", and the
// response for "ch" arrives AFTER the one for "chair", the old effect overwrites the new
// result: the screen shows results for a search that is no longer current.
export function ProductSearch({ query, search }: { query: string; search: SearchApi }) {
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    search(query).then((data) => setResults(data)); // SMELL: stale responses are not ignored
  }, [query, search]);

  return (
    <ul aria-label={`Results for ${query}`}>
      {results.map((r) => (
        <li key={r}>{r}</li>
      ))}
    </ul>
  );
}
