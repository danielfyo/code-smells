import type { InputHTMLAttributes } from "react";

// REFACTOR: explicit contract. The component's own props are destructured and only a typed
// subset of native attributes is forwarded. Attributes the component controls (type,
// step, onChange) are applied last so they cannot be overridden.
type NativeInputProps = Pick<InputHTMLAttributes<HTMLInputElement>, "id" | "name" | "disabled" | "placeholder">;

export interface PriceInputProps extends NativeInputProps {
  label: string;
  currency: "EUR" | "USD";
  value: number;
  onAmountChange: (amount: number) => void;
}

export function PriceInput({ label, currency, value, onAmountChange, ...nativeProps }: PriceInputProps) {
  return (
    <label>
      {label} ({currency})
      <input
        {...nativeProps}
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => onAmountChange(Number(e.target.value))}
      />
    </label>
  );
}
