import { useState } from "react";

const CITIES: Record<string, string[]> = {
  ES: ["Madrid", "Barcelona"],
  FR: ["Paris", "Lyon"],
};

// REFACTOR: pure functions for derived values; used both in render and in the handlers.
const shippingCost = (country: string): number => (country === "ES" ? 5 : 12);
const shippingSummary = (country: string, city: string): string =>
  `${city} (${country}): ${shippingCost(country)} €`;

// REFACTOR: break the chain. What responds to a user action happens in the event handler
// (change country => reset city) and derived values (cost, summary) are computed during
// render. One render per interaction and the flow reads in a single place.
export function ShippingForm({ onSummary }: { onSummary?: (summary: string) => void }) {
  const [country, setCountry] = useState("ES");
  const [city, setCity] = useState(CITIES.ES[0]);

  const summary = shippingSummary(country, city);

  const notify = (nextCountry: string, nextCity: string) => onSummary?.(shippingSummary(nextCountry, nextCity));

  const handleCountryChange = (nextCountry: string) => {
    const firstCity = CITIES[nextCountry][0];
    setCountry(nextCountry);
    setCity(firstCity);
    notify(nextCountry, firstCity);
  };

  const handleCityChange = (nextCity: string) => {
    setCity(nextCity);
    notify(country, nextCity);
  };

  return (
    <div>
      <select aria-label="Country" value={country} onChange={(e) => handleCountryChange(e.target.value)}>
        <option value="ES">Spain</option>
        <option value="FR">France</option>
      </select>
      <select aria-label="City" value={city} onChange={(e) => handleCityChange(e.target.value)}>
        {CITIES[country].map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <p>{summary}</p>
    </div>
  );
}
