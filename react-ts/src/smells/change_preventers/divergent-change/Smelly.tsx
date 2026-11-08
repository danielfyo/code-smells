import { useState } from "react";

export interface ProfilePayload {
  full_name: string;
  phone: string;
}

interface ProfileEditorProps {
  initialName: string;
  initialPhone: string;
  onSave: (payload: ProfilePayload) => void;
}

// SMELL: Divergent Change. This component changes for very different reasons:
// when the validation rules change, when the API payload format changes, when
// the way phones are displayed changes, or when the form layout changes.
// Four different teams would end up editing the same file.
export function ProfileEditor({ initialName, initialPhone, onSave }: ProfileEditorProps) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [error, setError] = useState<string | null>(null);

  // SMELL: reason to change #1 — presentation format.
  const digits = phone.replace(/\D/g, "");
  const prettyPhone = digits.length === 9 ? `+34 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}` : phone;

  function handleSave() {
    // SMELL: reason to change #2 — validation rules.
    if (name.trim().length < 2) {
      setError("Name is too short");
      return;
    }
    if (phone.replace(/\D/g, "").length !== 9) {
      setError("Phone must have 9 digits");
      return;
    }
    setError(null);
    // SMELL: reason to change #3 — backend contract.
    onSave({ full_name: name.trim(), phone: `+34${phone.replace(/\D/g, "")}` });
  }

  // SMELL: reason to change #4 — layout.
  return (
    <form onSubmit={(e) => (e.preventDefault(), handleSave())}>
      <label>
        Name <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Phone <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </label>
      <p>Preview: {name} · {prettyPhone}</p>
      {error && <p role="alert">{error}</p>}
      <button type="submit">Save</button>
    </form>
  );
}
