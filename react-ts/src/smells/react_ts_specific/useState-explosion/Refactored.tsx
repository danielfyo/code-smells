import { useReducer } from "react";

export type SubmitApi = (data: { name: string; email: string }) => Promise<void>;

// REFACTOR: useReducer with the submit state modeled as a discriminated union.
// Transitions are centralized and impossible combinations (error + success) don't exist.
type SubmitStatus = { kind: "idle" } | { kind: "loading" } | { kind: "success" } | { kind: "error"; message: string };

interface FormState {
  name: string;
  email: string;
  status: SubmitStatus;
}

type FormAction =
  | { type: "field"; field: "name" | "email"; value: string }
  | { type: "submit" }
  | { type: "success" }
  | { type: "failure"; message: string };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "field":
      return { ...state, [action.field]: action.value };
    case "submit":
      return { ...state, status: { kind: "loading" } };
    case "success":
      return { ...state, status: { kind: "success" } };
    case "failure":
      return { ...state, status: { kind: "error", message: action.message } };
  }
}

export function ContactForm({ submit }: { submit: SubmitApi }) {
  const [state, dispatch] = useReducer(formReducer, { name: "", email: "", status: { kind: "idle" } });
  const { status } = state;

  const handleSubmit = async () => {
    dispatch({ type: "submit" });
    try {
      await submit({ name: state.name, email: state.email });
      dispatch({ type: "success" });
    } catch (error) {
      dispatch({ type: "failure", message: error instanceof Error ? error.message : "Error" });
    }
  };

  return (
    <div>
      <input aria-label="Name" value={state.name} onChange={(e) => dispatch({ type: "field", field: "name", value: e.target.value })} />
      <input aria-label="Email" value={state.email} onChange={(e) => dispatch({ type: "field", field: "email", value: e.target.value })} />
      <button onClick={handleSubmit} disabled={status.kind === "loading"}>
        Send
      </button>
      {status.kind === "error" && <p role="alert">{status.message}</p>}
      {status.kind === "success" && <p role="status">Message sent</p>}
    </div>
  );
}
