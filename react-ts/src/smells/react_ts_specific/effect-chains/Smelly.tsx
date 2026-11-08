import { useEffect, useState } from "react";

const CITIES: Record<string, string[]> = {
  ES: ["Madrid", "Barcelona"],
  FR: ["Paris", "Lyon"],
};

// SMELL: effect chain. Changing the country fires an effect that resets the city, which
// fires another effect that recomputes shipping, which fires another that builds the
// summary. Each link is an extra render and the real flow is scattered and hidden.
export function ShippingForm({ onSummary }: { onSummary?: (summary: string) => void }) {
  const [country, setCountry] = useState("ES");
  const [city, setCity] = useState(CITIES.ES[0]);
  const [cost, setCost] = useState(0);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    setCity(CITIES[country][0]);
  }, [country]);

  useEffect(() => {
    setCost(country === "ES" ? 5 : 12);
  }, [country, city]);

  useEffect(() => {
    setSummary(`${city} (${country}): ${cost} €`);
  }, [city, country, cost]);

  useEffect(() => {
    if (summary) onSummary?.(summary);
  }, [summary, onSummary]);

  return (
    <div>
      <select aria-label="Country" value={country} onChange={(e) => setCountry(e.target.value)}>
        <option value="ES">Spain</option>
        <option value="FR">France</option>
      </select>
      <select aria-label="City" value={city} onChange={(e) => setCity(e.target.value)}>
        {CITIES[country].map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <p>{summary}</p>
    </div>
  );
}
