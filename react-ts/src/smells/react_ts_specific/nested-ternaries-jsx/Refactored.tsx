export type Shipment =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; trackingCode: string | null; delivered: boolean };

// REFACTOR: Extract Component + guard clauses. The decision moves out of the JSX into a
// function with early returns that reads top to bottom; each case takes one line.
function ShipmentMessage({ shipment }: { shipment: Shipment }) {
  if (shipment.status === "loading") return <p>Loading shipment…</p>;
  if (shipment.status === "error") return <p role="alert">Error: {shipment.message}</p>;
  if (shipment.delivered) return <p>Delivered</p>;
  if (shipment.trackingCode) return <p>In transit ({shipment.trackingCode})</p>;
  return <p>Preparing the order</p>;
}

export function ShipmentStatus({ shipment }: { shipment: Shipment }) {
  return (
    <div>
      <ShipmentMessage shipment={shipment} />
    </div>
  );
}
