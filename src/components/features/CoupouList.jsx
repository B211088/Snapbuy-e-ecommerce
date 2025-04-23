import React from "react";

const CoupouList = ({ coupouList }) => {
  return (
    <div className="flex h-[22px] items-center overflow-auto scrollbar-custom-none gap-[3px] ">
      {[...coupouList]
        .sort((a, b) => b.discount_percent - a.discount_percent)
        .slice(0, 2)
        .map((coupou) => (
          <div
            key={coupou.id}
            className="flex items-center justify-center  bg-[#d81c1c] text-white font-nunito font-bold text-[0.7rem] whitespace-nowrap py-[2px] px-[8px] rounded-[5px]"
          >
            <span>
              {coupou.description} - {coupou.discount_percent}%
            </span>
          </div>
        ))}
    </div>
  );
};

export default CoupouList;
