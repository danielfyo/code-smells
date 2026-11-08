/* eslint-disable @typescript-eslint/no-explicit-any */
// SMELL: indiscriminate props spreading. The component accepts "anything" and forwards it
// to the <input> with {...props}: domain props (currency, label) end up as unknown DOM
// attributes, internal attributes can be overridden by accident and the component's
// real contract is invisible.
export function PriceInput(props: any) {
  return (
    <label>
      {props.label}
      <input type="number" step="0.01" {...props} />
    </label>
  );
}
