export interface InputProps {
  type?: "text" | "email" | "password" | "number";
  value?: string | number;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  classNames?: {
    wrapper?: string;
    input?: string;
    error?: string;
  };
  readOnly?: boolean;
  disabled?: boolean;
  controlled?: boolean;
  error?: string | null;
  name?: string;
  label?: string | null;
}

const defaultStyles = {
  wrapper: "relative mb-4 w-full",
  input:
    "px-4 py-2 text-sm text-[#1e1e1e]  border border-[#1e1e1e]/60 rounded-lg w-full",
  error: "text-xs text-red-400 absolute left-0 -bottom-1 translate-y-full",
};

function Input({
  type = "text",
  value = "",
  placeholder = "",
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  classNames = {
    wrapper: "",
    input: "",
    error: "",
  },
  readOnly = false,
  disabled = false,
  controlled = false,
  error = null,
  name = "name",
  label = null,
}: InputProps) {
  if (!controlled) {
    return (
      <div>
        {label !== null && (
          <label className="text-sm text-[#1e1e1e]" htmlFor={name}>
            {label}
          </label>
        )}
        <div className={`${defaultStyles.wrapper} ${classNames.wrapper}`}>
          <input
            type={type}
            placeholder={placeholder}
            className={`${defaultStyles.input} ${classNames.input}`}
            readOnly={readOnly}
            disabled={disabled}
            name={name}
          />
          {error && (
            <small className={`${defaultStyles.error} ${classNames.error}`}>
              {error}
            </small>
          )}
        </div>
      </div>
    );
  }
  return (
    <div>
      {label !== null && (
        <label className="text-sm text-[#1e1e1e]" htmlFor={name}>
          {label}
        </label>
      )}
      <div className={`${defaultStyles.wrapper} ${classNames.wrapper}`}>
        <input
          type={type}
          placeholder={placeholder}
          className={`${defaultStyles.input} ${classNames.input}`}
          readOnly={readOnly}
          disabled={disabled}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          name={name}
          id={name}
        />
        {error && (
          <small className={`${defaultStyles.error} ${classNames.error}`}>
            {error}
          </small>
        )}
      </div>
    </div>
  );
}

export default Input;
