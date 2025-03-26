import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "../../Provider/ThemeProvider";

const InputField = ({ payload, onChange }) => {
  const { name, value, placeholder, type, required, disabled } = payload;
  const { isDarkMode } = useTheme();

  return (
    <div className="flex-1 flex items-center gap-5 ">
      <div
        className={`w-full py-2.5 px-2 rounded-md text-sm ${
          isDarkMode ? "border border-dark-900" : "bg-dark-400 text-dark-1000"
        }`}
      >
        <input
          className="w-full border-none outline-none bg-transparent"
          name={name}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          required={required}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

InputField.propTypes = {
  payload: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    placeholder: PropTypes.string,
    type: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default InputField;
