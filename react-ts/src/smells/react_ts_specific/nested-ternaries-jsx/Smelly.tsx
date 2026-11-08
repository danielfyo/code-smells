export type Shipment =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; trackingCode: string | null; delivered: boolean };

// SMELL: nested ternaries in JSX. Four levels of ? : to decide what to render; you have to
// count parentheses to know which condition each branch belongs to.
export function ShipmentStatus({ shipment }: { shipment: Shipment }) {
  return (
    <div>
      {shipment.status === "loading" ? (
        <p>Loading shipment…</p>
      ) : shipment.status === "error" ? (
        <p role="alert">Error: {shipment.message}</p>
      ) : shipment.delivered ? (
        <p>Delivered</p>
      ) : shipment.trackingCode ? (
        <p>In transit ({shipment.trackingCode})</p>
      ) : (
        <p>Preparing the order</p>
      )}
    </div>
  );
}
