import { useEffect, useState } from "react";
import { useTheme } from "../../Provider/ThemeProvider";

const QuantityProduct = ({ defaultQuantity, onQuantityChange, productId }) => {
  const { isDarkMode } = useTheme();
  const [quantity, setQuantity] = useState(defaultQuantity);

  useEffect(() => {
    setQuantity(defaultQuantity);
  }, [defaultQuantity]);

  useEffect(() => {
    if (onQuantityChange) {
      onQuantityChange(productId, quantity);
    }
  }, [quantity]);

  const handleIncrease = () => setQuantity((prev) => prev + 1);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center gap-[10px]">
      <div
        className={` py-[3px] px-[8px] rounded-[5px] ${
          isDarkMode ? "border-[1px]" : "bg-dark-500"
        }`}
        onClick={handleDecrease}
      >
        <i className="fa-solid fa-minus"></i>
      </div>
      <div
        className={`min-w-[100px] py-[3px] rounded-[5px] ${
          isDarkMode ? "border-[1px]" : "bg-dark-500"
        }`}
      >
        <input
          className="w-full outline-none bg-transparent text-center"
          type="number"
          value={quantity}
          onChange={handleChange}
        />
      </div>
      <div
        className={` py-[3px]  px-[8px] rounded-[5px] ${
          isDarkMode ? "border-[1px]" : "bg-dark-500"
        }`}
        onClick={handleIncrease}
      >
        <i className="fa-solid fa-plus"></i>
      </div>
    </div>
  );
};

export default QuantityProduct;
