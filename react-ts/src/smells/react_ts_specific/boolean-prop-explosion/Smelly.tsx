import type { ReactNode } from "react";

// SMELL: boolean prop explosion. isPrimary, isDanger, isGhost, isSmall, isLarge... allow
// impossible combinations (isPrimary + isDanger, isSmall + isLarge) that the type doesn't
// prevent, and the component has to decide by hand which one wins.
export interface ButtonProps {
  children: ReactNode;
  isPrimary?: boolean;
  isDanger?: boolean;
  isGhost?: boolean;
  isSmall?: boolean;
  isLarge?: boolean;
  onClick?: () => void;
}

export function Button({ children, isPrimary, isDanger, isGhost, isSmall, isLarge, onClick }: ButtonProps) {
  let variant = "secondary";
  if (isPrimary) variant = "primary";
  if (isDanger) variant = "danger"; // SMELL: implicit, hidden precedence
  if (isGhost) variant = "ghost";
  let size = "md";
  if (isSmall) size = "sm";
  if (isLarge) size = "lg";
  return (
    <button className={`btn btn-${variant} btn-${size}`} onClick={onClick}>
      {children}
    </button>
  );
}
