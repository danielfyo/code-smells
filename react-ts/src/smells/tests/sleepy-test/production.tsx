import { useState } from "react";

// Production code: a button that saves a draft asynchronously.
export interface SaveDraftButtonProps {
  save: () => Promise<void>;
}

export function SaveDraftButton({ save }: SaveDraftButtonProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const handleClick = async () => {
    setStatus("saving");
    await save();
    setStatus("saved");
  };

  return (
    <div>
      <button onClick={handleClick} disabled={status === "saving"}>
        Save draft
      </button>
      {status === "saving" && <p>Saving…</p>}
      {status === "saved" && <p role="status">Draft saved</p>}
    </div>
  );
}
