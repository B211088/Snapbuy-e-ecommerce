import React from "react";
import ContainerModeLayer1 from "../../../components/Container/ContainerModeLayer1";

const OutLetContainer = ({ children }) => {
  return (
    <ContainerModeLayer1>
      <div
        style={{ height: "calc(100dvh - 100px)" }}
        className="w-full flex flex-col  rounded-[5px]"
      >
        {children}
      </div>
    </ContainerModeLayer1>
  );
};

export default OutLetContainer;
