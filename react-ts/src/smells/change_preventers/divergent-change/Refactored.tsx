import { useState } from "react";

export interface ProfilePayload {
  full_name: string;
  phone: string;
}

export interface ProfileDraft {
  name: string;
  phone: string;
}

// REFACTOR: Split Phase / Extract Module. Each reason to change has its own
// home. In a real project these would be separate files (validation.ts, api.ts,
// format.ts, ProfileEditor.tsx); here they are grouped to keep the example compact.

// --- format: how a phone number is displayed
const onlyDigits = (raw: string): string => raw.replace(/\D/g, "");
export function formatPhone(raw: string): string {
  const d = onlyDigits(raw);
  return d.length === 9 ? `+34 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : raw;
}

// --- validation: business rules, no React
export function validateProfile(draft: ProfileDraft): string | null {
  if (draft.name.trim().length < 2) return "Name is too short";
  if (onlyDigits(draft.phone).length !== 9) return "Phone must have 9 digits";
  return null;
}

// --- api: backend contract
export const toPayload = (draft: ProfileDraft): ProfilePayload => ({
  full_name: draft.name.trim(),
  phone: `+34${onlyDigits(draft.phone)}`,
});

// --- UI: state and layout only
interface ProfileEditorProps {
  initialName: string;
  initialPhone: string;
  onSave: (payload: ProfilePayload) => void;
}

export function ProfileEditor({ initialName, initialPhone, onSave }: ProfileEditorProps) {
  const [draft, setDraft] = useState<ProfileDraft>({ name: initialName, phone: initialPhone });
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    const problem = validateProfile(draft);
    setError(problem);
    if (!problem) onSave(toPayload(draft));
  }

  return (
    <form onSubmit={(e) => (e.preventDefault(), handleSave())}>
      <label>
        Name <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
      </label>
      <label>
        Phone <input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
      </label>
      <p>Preview: {draft.name} · {formatPhone(draft.phone)}</p>
      {error && <p role="alert">{error}</p>}
      <button type="submit">Save</button>
    </form>
  );
}
