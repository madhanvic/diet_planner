

interface SpinnerProps {
  size?: number | string;
  className?: string;
  label?: string;
}

function Spinner({ size = 32, className = "", label = "Loading..." }: SpinnerProps) {
  return (
    <div
      className={`flex justify-center items-center ${className}`}
      data-testid="spinnerComponent"
      role="status"
      aria-label={label}
    >
      <div
        className="animate-spin rounded-full border-t-2 border-b-2 border-primary"
        style={{ width: size, height: size }}
      ></div>
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default Spinner;
