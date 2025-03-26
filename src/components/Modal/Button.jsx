import React from "react";

const Button = ({ onClick, children }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onClick();
    }
  };
  return (
    <button
      className="w-full py-[5px] bg-primary rounded-[5px] text-white font-bold"
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </button>
  );
};

export default Button;
