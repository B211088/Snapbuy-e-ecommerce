import { Link, Outlet, useLocation } from "react-router-dom";
import ContainerModeLayer1 from "../Container/ContainerModeLayer1";

const IndustryManager = () => {
  const location = useLocation();

  return (
    <ContainerModeLayer1>
      <div className="w-full flex flex-col container-mode-layer1">
        <div className="w-full flex items-center gap-[10px] py-[10px] px-[10px]">
          <Link
            to="categories"
            className={`w-2/12 flex items-center justify-center px-[20px] py-[5px] border-[1px] rounded-[5px] cursor-pointer font-nunito font-bold text-[0.9rem] ${
              location.pathname.includes("categories")
                ? "bg-blue-500 text-white"
                : ""
            }`}
          >
            Phân loại
          </Link>
          <Link
            to="attributes"
            className={`w-2/12 flex items-center justify-center px-[20px] py-[5px] border-[1px] rounded-[5px] cursor-pointer font-nunito font-bold text-[0.9rem] ${
              location.pathname.includes("attributes")
                ? "bg-blue-500 text-white"
                : ""
            }`}
          >
            Thuộc tính
          </Link>
        </div>
        <Outlet />
      </div>
    </ContainerModeLayer1>
  );
};

export default IndustryManager;
