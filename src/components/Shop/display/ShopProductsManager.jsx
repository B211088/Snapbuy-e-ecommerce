import OutLetContainer from "../../../views/client/layout/OutLetContainer";
import { useTheme } from "../../../Provider/ThemeProvider";
import { Outlet } from "react-router-dom";

const ShopProductsManager = () => {
  const { isDarkMode } = useTheme();
  return (
    <OutLetContainer>
      <div className="w-full flex flex-col  px-[20px] py-[12px] border-b-[1px] border-dashed ">
        <div className="flex items-center  font-nunito gap-[10px] ">
          <div
            className={`w-[50px] h-[50px] min-w-[50px] flex items-center justify-center rounded-full border-[1px] text-[1.4rem] ${
              isDarkMode ? "text-dark-300" : "text-light-300"
            }`}
          >
            <i className="fa-solid fa-box-open"></i>
          </div>
          <div className="flex flex-col truncate">
            <h1 className="font-bold text-[1.2rem]">Kho sản phẩm</h1>
            <p
              className={`font-normal text-[0.95rem] ${
                isDarkMode ? " text-dark-300" : "text-light-300"
              }`}
            >
              Quản lý kho sản phẩm của bạn
            </p>
          </div>
        </div>
      </div>
      <Outlet />
    </OutLetContainer>
  );
};

export default ShopProductsManager;
