import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "../../Provider/ThemeProvider";

const InputField = ({ payload, onChange }) => {
  const {
    name,
    value,
    placeholder,
    type,
    required,
    disabled,
    maxLength,
    minLength,
    readOnly,
    autoFocus,
    pattern,
    step,
    min,
    max,
    accept,
    multiple,
    checked,
  } = payload;
  const { isDarkMode } = useTheme();

  const inputClass = `w-full border-none outline-none bg-transparent ${
    type === "checkbox" || type === "radio" ? "w-auto h-auto" : ""
  }`;

  return (
    <div className="flex-1 flex items-center gap-5">
      <div
        className={`w-full py-2.5 px-2 rounded-md text-sm flex items-center ${
          isDarkMode ? "border border-dark-900" : "bg-dark-400 text-dark-1000"
        }`}
      >
        {type === "textarea" ? (
          <textarea
            className={inputClass}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            placeholder={placeholder}
            maxLength={maxLength}
            minLength={minLength}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            rows="4"
          />
        ) : (
          <input
            className={inputClass}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
            maxLength={maxLength}
            minLength={minLength}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            pattern={pattern}
            step={step}
            min={min}
            max={max}
            accept={accept}
            multiple={multiple}
            checked={checked}
          />
        )}
      </div>
    </div>
  );
};

InputField.propTypes = {
  payload: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
    placeholder: PropTypes.string,
    type: PropTypes.string.isRequired,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    maxLength: PropTypes.number,
    minLength: PropTypes.number,
    pattern: PropTypes.string,
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    accept: PropTypes.string,
    multiple: PropTypes.bool,
    checked: PropTypes.bool,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default InputField;
