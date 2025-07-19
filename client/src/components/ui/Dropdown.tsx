import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type SetStateAction,
} from "react";
import Input, { type InputProps } from "./Input";
import { createPortal } from "react-dom";
import type {
  Coordinates,
  CordinateStateInterface,
} from "../../types/coordinates";

export interface DropdownOption {
  id: string;
  [props: string]: string | number | undefined;
}

export interface DropdownProps<T extends DropdownOption = DropdownOption>
  extends Omit<InputProps, "type" | "onFocus" | "onBlur" | "controlled"> {
  freeText?: boolean;
  classNames?: Partial<{
    wrapper: string;
    dropdownWrapper: string;
    dropdownOptions: string;
  }>;
  children: React.ReactElement;
  id: string;
  onSelectOption: ({
    name,
    option,
  }: {
    name: string;
    option: T | null;
  }) => void;
  targetLabel: string;
  selectedOption: T | null;
}

export interface DropdownCtxInteface {
  showDropdown: boolean;
  setShowDropdown: React.Dispatch<SetStateAction<boolean>>;
  id: string;
}

export interface DropdownOptionsProps<
  T extends DropdownOption = DropdownOption
> {
  options: T[];
  targetLabel?: string;
  onSelectOption: ({ name, option }: { name: string; option: T }) => void;
  name?: string;
}

const DropdownCtx = createContext<DropdownCtxInteface | undefined>(undefined);

const defaultStyles = {
  wrapper: "relative",
  clearBtn: "absolute right-2 top-1/2 -translate-y-1/2",
  dropdownWrapper:
    "fixed max-h-48 overflow-y-auto bg-white border border-[#1e1e1e]/20 rounded-md shadow-lg",
  dropdownOptions:
    "[&>li:not(:last-child)]:border-b [&>li:not(:last-child)]:border-[#1e1e1e]/20 [&>li>button]:px-3 [&>li>button]:py-2 [&>li>button]:text-sm [&>li]:hover:bg-black/10 [&>li>button]:cursor-pointer [&>li>button]:w-full [&>li>button]:text-start",
};

function Dropdown<T extends DropdownOption = DropdownOption>({
  value = "",
  onChange = () => {},
  placeholder = "",
  classNames = {},
  readOnly = false,
  disabled = false,
  error = null,
  freeText = false,
  children,
  id = "dropdown",
  onSelectOption = () => {},
  selectedOption = null,
  name,
  label,
}: DropdownProps<T>) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownOptionRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<CordinateStateInterface | null>(null);

  useEffect(() => {
    if (
      dropdownOptionRef.current !== null &&
      showDropdown &&
      coords !== null &&
      coords.vdirection === null
    ) {
      const coordinates = (
        dropdownOptionRef.current as HTMLElement
      ).getBoundingClientRect();

      const windowHeight = window.innerHeight;
      let vdirection = "DOWN";
      if (windowHeight - (coords.bottom + 5) < coordinates.height) {
        vdirection = "UP";
      }
      setCoords((prevState) => {
        return {
          ...prevState,
          vdirection: vdirection,
        } as Coordinates;
      });
    }
  }, [showDropdown, coords]);

  const onFocusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    const target = e.target;

    const wrapper = target.closest(`#${id}`);
    const coordinates = wrapper?.getBoundingClientRect();
    setShowDropdown(true);
    setCoords({
      top: coordinates?.top as number,
      bottom: coordinates?.bottom as number,
      left: coordinates?.left as number,
      right: coordinates?.right as number,
      width: coordinates?.width as number,
      heigth: coordinates?.height as number,
      vdirection: null,
    });
  };

  const onBlurHandler = () => {
    if (!readOnly && freeText) {
      // onSelectOption({
      //   id: "",
      //   [targetLabel]: value,
      // });
    } else if (!readOnly && !freeText) {
      if (selectedOption !== null && selectedOption?.id.trim().length === 0) {
        onChange({
          target: {
            value: "",
            name: name!,
          },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  };

  const onClearHandler = () => {
    onSelectOption({ name: name!, option: null });
    if (showDropdown) {
      setShowDropdown(false);
    }
  };

  return (
    <DropdownCtx.Provider value={{ showDropdown, setShowDropdown, id }}>
      <div
        id={id}
        className={`${defaultStyles.wrapper} ${classNames.wrapper ?? ""}`}
      >
        <Input
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={onFocusHandler}
          readOnly={readOnly}
          disabled={disabled}
          error={error}
          controlled={true}
          onBlur={onBlurHandler}
          name={name}
          label={label}
        />
        {value.toString().length > 0 && (
          <button
            type="button"
            className={`${defaultStyles.clearBtn} ${
              label ? "top-[calc(14px+50%)] " : ""
            }`}
            onClick={onClearHandler}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        )}
      </div>
      {showDropdown &&
        createPortal(
          <div
            ref={dropdownOptionRef}
            id={`${id}_options`}
            className={`${defaultStyles.dropdownWrapper} ${
              coords === null ? "hidden" : ""
            } ${coords?.vdirection === "UP" ? "-translate-y-full" : ""} ${
              classNames.dropdownWrapper ?? ""
            }`}
            style={{
              top:
                coords?.vdirection === "DOWN"
                  ? coords.bottom + "px"
                  : coords?.top + "px",
              width: coords?.width + "px",
              left: coords?.left + "px",
            }}
          >
            {children}
          </div>,
          document.body
        )}
    </DropdownCtx.Provider>
  );
}

function DropdownOptions<T extends DropdownOption = DropdownOption>({
  options = [],
  targetLabel = "value",
  onSelectOption = () => {},
  name,
}: DropdownOptionsProps<T>) {
  const ctx = useContext(DropdownCtx);
  if (!ctx) throw new Error("DropdownOptions must be used within Dropdown");
  const { showDropdown, setShowDropdown, id } = ctx;

  useEffect(() => {
    function outSideClick(e: MouseEvent) {
      if (!showDropdown) {
        return;
      }
      const target = e.target as HTMLElement;

      const closestDropdown = target.closest(`#${id}`);
      const closestDropdownOption = target.closest(`#${id}_options`);

      if (closestDropdown === null && closestDropdownOption == null) {
        setShowDropdown(false);
      }
    }

    window.addEventListener("click", outSideClick);

    return () => {
      window.removeEventListener("click", outSideClick);
    };
  }, [id, showDropdown, setShowDropdown]);

  useEffect(() => {
    document.body.classList.add("overflow-y-hidden");

    return () => {
      document.body.classList.remove("overflow-y-hidden");
    };
  }, []);

  const onSelect = (option: T) => {
    onSelectOption({
      name: name!,
      option: option,
    });
    setShowDropdown(false);
  };

  return (
    <ul className={`${defaultStyles.dropdownOptions}`}>
      {options.map((opt) => {
        return (
          <li key={opt.id}>
            <button type="button" onClick={onSelect.bind(null, opt)}>
              {opt[targetLabel]}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

Dropdown.options = DropdownOptions;

export default Dropdown;
