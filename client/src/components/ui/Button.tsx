import type { MouseEventHandler } from "react";

export interface ButtonProps {
  children?: React.ReactElement | string;
  type?: "button" | "submit" | "reset" | undefined;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  inverse?: 0 | 1;
  disabled?: boolean;
}

const defaultStyles = "px-4 py-2 text-sm rounded-md border border-primary";
const inverseZeroStyle = "bg-primary hover:bg-primary/80  text-secondary";
const inverseOneStyle = "bg-secondary hover:bg-secondary/80 text-primary";

function Button({
  children,
  type = "button",
  className = "",
  onClick = () => {},
  inverse = 0,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`${defaultStyles} ${
        inverse === 0 ? inverseZeroStyle : inverseOneStyle
      } ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
