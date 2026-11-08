import { useState } from "react";

// SMELL: non-standard nomenclature. It ignores React/TS conventions everybody knows:
// - lowercase component with an odd suffix (counter_widget),
// - the hook doesn't start with "use" (counterLogic), so hook lint rules don't catch it,
// - the handler is called "clickHappened" instead of onX/handleX,
// - props in snake_case.
interface counter_widget_props {
  start_value: number;
  when_changed?: (value: number) => void;
}

export function counterLogic(initial: number) {
  const [value, setValue] = useState(initial);
  return { value, bump: () => setValue((v) => v + 1) };
}

export function counter_widget({ start_value, when_changed }: counter_widget_props) {
  const c = counterLogic(start_value);
  const clickHappened = () => {
    c.bump();
    when_changed?.(c.value + 1);
  };
  return <button onClick={clickHappened}>Units: {c.value}</button>;
}
