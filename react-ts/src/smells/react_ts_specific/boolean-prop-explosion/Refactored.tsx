import type { ReactNode } from "react";

// REFACTOR: Replace Boolean Flags with Union Type. A "variant" prop and a "size" prop with
// literal unions: each button has exactly one variant and one size, and impossible
// combinations don't even compile.
export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
}

export function Button({ children, variant = "secondary", size = "md", onClick }: ButtonProps) {
  return (
    <button className={`btn btn-${variant} btn-${size}`} onClick={onClick}>
      {children}
    </button>
  );
}
