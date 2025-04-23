import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import quangcao1 from "../../assets/videos/quangcao1.mp4";
import banner1 from "../../assets/images/banner1.png";
import banner2 from "../../assets/images/banner3.png";
import banner3 from "../../assets/images/banner2.png";
import banner4 from "../../assets/images/banner4.png";
import banner5 from "../../assets/images/banner5.png";
import { useTheme } from "../../Provider/ThemeProvider";
import { useAuth } from "../../contexts/User/AuthContext";
import { useAppData } from "../../contexts/client/AppDataContext";

const Banner = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const bannerItems = [
    { id: 1, src: banner1 },
    { id: 2, src: banner2 },
    { id: 3, src: banner3 },
    { id: 4, src: banner4 },
    { id: 5, src: banner5 },
  ];

  const {
    authState: { user },
  } = useAuth();

  const {
    categoriesState: { categories },
  } = useAppData();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleNext = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === bannerItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? bannerItems.length - 1 : prevIndex - 1
    );
  };

  const handleSelectedItemBanner = (index) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full flex  justify-center pc:py-[20px] tl:py-[20px] mb:pt-[30px] mb:pb-[10px]  ${
        isDarkMode ? "bg-background" : "bg-[#515151]"
      }`}
    >
      <div
        className={`pc:w-[90%] mb:w-full h-full flex tl:flex-col mb:flex-col gap-[10px] `}
      >
        <div className="pc:w-6/12 mb:w-full  pc:pr-[10px]  tl:px-[10px] mb:px-[10px] relative group  rounded-[5px] overflow-hidden">
          <div className="w-full h-fit flex rounded-[5px]">
            <video
              className="w-full h-full rounded-[5px]"
              controls
              src={quangcao1}
              autoPlay
              muted
              loop
              preload="auto"
            ></video>
            <div className="absolute w-[94%] z-10 opacity-0 h-0 translate-y-[-20px] group-hover:opacity-100 group-hover:translate-y-0 flex gap-[5px] items-start justify-between top-[5%] right-[2.5%] font-nunito text-white text-[0.9rem] transition-all duration-300 cursor-pointer">
              <div className="max-w-[400px] rounded-[10px] px-[10px] bg-[#0000005a]">
                <div className="py-[10px]">
                  Cùng Samsung rước tết, trọn đoàn viên
                </div>
              </div>
              <div className="flex items-center gap-[10px]">
                <span className="bg-[#0000005a] py-[10px] px-[20px] rounded-[10px] whitespace-nowrap">
                  Tìm hiểu thêm
                </span>
                <div className="w-[42px] h-[42px] rounded-full bg-[#0000005a] flex items-center justify-center text-white text-[1rem]">
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pc:w-6/12 w-full flex mb:flex-col mb:gap-[10px]">
          <div className="pc:w-8/12 tl:w-8/12  mb:w-full min-h-full flex flex-col  px-[10px]  ">
            <div className="w-full h-[50%] min-h-[50%] flex flex-col  relative group overflow-hidden pb-[10px]">
              <div className="w-full h-full  flex items-center relative overflow-hidden rounded-[5px]">
                <div
                  className="flex w-full  h-full transition-transform duration-500"
                  style={{
                    transform: `translateX(-${selectedIndex * 100}%)`,
                    width: `${bannerItems.length * 100}%`,
                  }}
                >
                  {bannerItems.map((item) => (
                    <img
                      key={item.id}
                      className="w-full   min-w-full  mb:min-h-full  object-cover rounded-[5px]"
                      src={item.src}
                      alt={`Banner ${item.id}`}
                    />
                  ))}
                </div>

                <div className="absolute flex items-center gap-[5px] bottom-[5%] left-[3%] cursor-pointer">
                  {bannerItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`${
                        selectedIndex === index ? "w-[16px]" : "w-[8px]"
                      } h-[8px] bg-[#0000007b] rounded-full transition-all duration-500`}
                      onClick={() => handleSelectedItemBanner(index)}
                    ></div>
                  ))}
                </div>

                <button
                  className="absolute   w-[28px] h-[28px] flex items-center justify-center left-[0%] top-1/2 transform -translate-y-1/2 bg-[#0000005a] text-white p-[10px] rounded-full cursor-pointer hover:bg-[#00000090] transition-all"
                  onClick={handlePrev}
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>

                <button
                  className="absolute w-[28px] h-[28px] flex items-center justify-center right-[0%] top-1/2 transform -translate-y-1/2 bg-[#0000005a] text-white p-[10px] rounded-full cursor-pointer hover:bg-[#00000090] transition-all"
                  onClick={handleNext}
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
            <div className="w-full h-[50%]  min-h-[50%]  flex flex-wrap ">
              <div
                className={`w-4/12 h-[50%] flex  justify-center items-center  rounded-[5px] cursor-pointer text-[#eb2626]  `}
              >
                <div className="relative w-full h-full flex justify-center items-center  pt-[5px]  pr-[5px] ">
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center py-[8px] px-[10px]  ${
                      isDarkMode
                        ? " bg-white  border-[1px]  hover:border-r-[5px] hover:border-b-[5px]  hover:border-r-[#F8AF24] hover:border-b-[#F8AF24]"
                        : "bg-dark-200 hover:border-r-[5px] hover:border-b-[5px]  hover:border-r-[#747474] hover:border-b-[#747474]"
                    }  rounded-[10px] hover:translate-y-[-2px] hover:translate-x-[-2px]   transition-all duration-300`}
                  >
                    <div
                      className={`aspect-square p-[6%] flex justify-center items-center  ${
                        isDarkMode
                          ? " bg-white  border-[1px]"
                          : "bg-dark-300 border-[#494949]"
                      } text-[1rem] rounded-[5px]`}
                    >
                      <i className="leading-[25px] fa-solid fa-bolt-lightning"></i>
                    </div>
                    <div className="mt-[5px] pc:text-[0.9rem] mb:text-[0.8rem]  font-nunito font-bold">
                      {" "}
                      Flash Sale
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-4/12 h-[50%] flex  justify-center items-center rounded-[5px] cursor-pointer text-[#2acfb3] ">
                <div className=" w-full h-full flex justify-center items-center  pt-[5px]  pr-[5px] ">
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center py-[8px] px-[10px]  ${
                      isDarkMode
                        ? " bg-white  border-[1px]  hover:border-r-[5px] hover:border-b-[5px]  hover:border-r-[#F8AF24] hover:border-b-[#F8AF24]"
                        : "bg-dark-200  hover:border-r-[5px] hover:border-b-[5px]  hover:border-r-[#747474] hover:border-b-[#747474]"
                    }  rounded-[10px] hover:translate-y-[-2px] hover:translate-x-[-2px]   transition-all duration-300`}
                  >
                    <div
                      className={`aspect-square p-[6%]  flex justify-center items-center  ${
                        isDarkMode
                          ? " bg-white  border-[1px]"
                          : "bg-dark-300 border-[#494949]"
                      } text-[1rem] rounded-[5px] `}
                    >
                      <i className="leading-[25px] fa-solid fa-truck"></i>
                    </div>
                    <div className="mt-[5px] pc:text-[0.9rem] mb:text-[0.8rem] font-nunito font-bold ">
                      {" "}
                      Free Ship
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-4/12 h-[50%] flex  justify-center items-center  rounded-[5px] cursor-pointer text-[#e89f31]">
                <div className=" w-full h-full flex justify-center items-center  pt-[5px]  pr-[5px] ">
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center py-[8px] px-[10px]  ${
                      isDarkMode
                        ? " bg-white  border-[1px]  hover:border-r-[5px] hover:border-b-[5px]  hover:border-r-[#F8AF24] hover:border-b-[#F8AF24]"
                        : "bg-dark-200 hover:border-r-[5px] hover:border-b-[5px]  hover:border-r-[#747474] hover:border-b-[#747474]"
                    }  rounded-[10px] hover:translate-y-[-2px] hover:translate-x-[-2px]   transition-all duration-300`}
                  >
                    <div
                      className={`aspect-square p-[6%] flex justify-center items-center  ${
                        isDarkMode
                          ? " bg-white  border-[1px]"
                          : "bg-dark-300 border-[#494949]"
                      } text-[1rem] rounded-[5px]`}
                    >
                      <i className="leading-[25px] fa-solid fa-ticket"></i>
                    </div>
                    <div className="mt-[5px] pc:text-[0.9rem] mb:text-[0.8rem]  font-nunito font-bold">
                      Voucher
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-4/12 h-[50%] flex  justify-center items-center  rounded-[5px] cursor-pointer text-[#308ae4]">
                <div className=" w-full h-full flex justify-center items-center pt-[5px] pr-[5px]">
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center py-[8px] px-[10px]  ${
                      isDarkMode
                        ? " bg-white  border-[1px]  hover:border-r-[5px] hover:border-b-[5px]  hover:border-r-[#F8AF24] hover:border-b-[#F8AF24]"
                        : "bg-dark-200 hover:border-r-[5px] hover:border-b-[5px]  hover:border-r-[#747474] hover:border-b-[#747474]"
                    }  rounded-[10px] hover:translate-y-[-2px] hover:translate-x-[-2px]   transition-all duration-300`}
                  >
                    <div
                      className={`aspect-square p-[6%] flex justify-center items-center  ${
                        isDarkMode
                          ? " bg-white  border-[1px]"
                          : "bg-dark-300 border-[#494949]"
                      } text-[1rem] rounded-[5px]`}
                    >
                      <i className="leading-[25px] fa-solid fa-earth-americas"></i>
                    </div>
                    <div className="mt-[5px] pc:text-[0.9rem] mb:text-[0.8rem]  font-nunito font-bold">
                      {" "}
                      Hàng quốc tế
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-4/12 h-[50%] flex  justify-center items-center rounded-[5px] cursor-pointer text-[#9b33eb]">
                <div className="w-full h-full flex justify-center items-center pt-[5px] pr-[5px]">
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center py-[8px] px-[10px]  ${
                      isDarkMode
                        ? " bg-white  border-[1px]  hover:border-r-[5px] hover:border-b-[5px]  hover:border-r-[#F8AF24] hover:border-b-[#F8AF24]"
                        : "bg-dark-200 hover:border-r-[5px] hover:border-b-[5px]  hover:border-r-[#747474] hover:border-b-[#747474]"
                    }  rounded-[10px] hover:translate-y-[-2px] hover:translate-x-[-2px]   transition-all duration-300`}
                  >
                    <div
                      className={`aspect-square p-[6%] flex justify-center items-center  ${
                        isDarkMode
                          ? " bg-white  border-[1px]"
                          : "bg-dark-300  border-[#494949]"
                      } text-[1rem] rounded-[5px]`}
                    >
                      <i className="leading-[25px] fa-solid fa-clipboard-check"></i>
                    </div>
                    <div className="mt-[5px] pc:text-[0.9rem] mb:text-[0.8rem]  font-nunito font-bold">
                      {" "}
                      Deal hời
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-4/12 h-[50%] flex  justify-center items-center  rounded-[5px] cursor-pointer text-[#2db625]">
                <div className=" w-full h-full flex justify-center items-center pt-[5px] pr-[5px]">
                  {" "}
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center py-[8px] px-[10px]  ${
                      isDarkMode
                        ? " bg-white  border-[1px]  hover:border-r-[5px] hover:border-b-[5px]  hover:border-r-[#F8AF24] hover:border-b-[#F8AF24]"
                        : "bg-dark-200 hover:border-r-[5px] hover:border-b-[5px]  hover:border-r-[#747474] hover:border-b-[#747474]"
                    }  rounded-[10px] hover:translate-y-[-2px] hover:translate-x-[-2px]   transition-all duration-300`}
                  >
                    <div
                      className={`aspect-square p-[6%] flex justify-center items-center  ${
                        isDarkMode
                          ? " bg-white  border-[1px]"
                          : "bg-dark-300 border-[#494949]"
                      } text-[1rem] rounded-[5px]`}
                    >
                      <i className="leading-[25px] fa-solid fa-money-check-dollar"></i>
                    </div>
                    <div className="mt-[5px] pc:text-[0.9rem] mb:text-[0.8rem] font-nunito font-bold">
                      {" "}
                      Đơn 0 đồng
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {user ? (
            <div className="pc:w-4/12 h-fit tl:w-4/12 mb:w-full min-h-full  pc:pl-[10px] mb:px-[10px]">
              <ul
                className={`max-h-[400px] sticky top-[20px] overflow-x-hidden overflow-y-auto scrollbar-custom flex flex-col items-center  rounded-[5px] ${
                  isDarkMode
                    ? " bg-white shadow-sm"
                    : "bg-dark-200 text-light-100 border-transparent"
                }  rounded-[5px] p-[10px]`}
              >
                {categories ? (
                  categories.map((cat) => (
                    <li
                      key={cat.id}
                      className={`w-full flex gap-[10px] py-[5px] px-[5px] cursor-pointer ${
                        isDarkMode ? "hover:bg-[#efefef]" : "hover:bg-[#2e2e2e]"
                      } rounded-[5px]`}
                    >
                      <i className="text-[0.5rem] fa-solid fa-circle-dot mt-[6px]"></i>
                      <span className="font-nunito font-semibold text-[0.9rem]">
                        {cat.name}
                      </span>
                    </li>
                  ))
                ) : (
                  <li
                    className={`w-full flex items-center gap-[10px] py-[5px] px-[5px] cursor-pointer ${
                      isDarkMode ? "hover:bg-[#efefef]" : "hover:bg-[#2e2e2e]"
                    } rounded-[5px]`}
                  >
                    <i className="text-[0.5rem] fa-solid fa-angle-right"></i>
                    <span className="font-nunito font-semibold text-[0.9rem]">
                      Chưa có dữ liệu
                    </span>
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <div className="pc:w-4/12 tl:w-4/12 mb:w-full min-h-full  pl-[10px] flex flex-col items-center mb:px-[10px]  rounded-[5px]">
              <div
                className={`w-full pt-[10px] pb-[20px] sticky top-0 ${
                  isDarkMode
                    ? " bg-white shadow-sm"
                    : "bg-dark-200 border-[1px] border-border-dark"
                }  rounded-[5px] p-[10px]`}
              >
                {" "}
                <div className="w-full flex items-center gap-[10px] ">
                  <div
                    className={`w-full font-nunito flex flex-col justify-center items-center  ${
                      isDarkMode ? "text-black" : "text-white"
                    }`}
                  >
                    <h1 className="text-[1.2rem] font-bold">Hãy đăng nhập</h1>
                    <span className=" text-[0.9rem] font-light ">
                      Để sử dụng nhiều dịch vụ hơn
                    </span>
                  </div>
                </div>
                <div className="w-full flex items-center justify-between gap-[10px] py-[20px] ">
                  <Link
                    to="/login"
                    className={`w-full px-[20px] py-[6px]  rounded-[5px] bg-primary text-white`}
                  >
                    {" "}
                    <div className="font-nunito flex items-center justify-center gap-[10px] ">
                      <span className="pc:text-[0.9rem] mb:text-[1rem] font-bold ">
                        Đăng nhập ngay
                      </span>
                      <i className="pc:text-[1rem] mb:text-[1rem] fa-solid fa-right-to-bracket"></i>
                    </div>{" "}
                  </Link>
                </div>
                <div
                  className={`w-full flex items-center gap-[10px] mt-[10px] ${
                    isDarkMode ? "text-black" : " text-white"
                  } `}
                >
                  <div
                    className={`relative w-3/12 flex items-center justify-center p-[10px] ${
                      isDarkMode ? "border-[1px]" : "bg-[#383838]"
                    }  rounded-[5px] group cursor-pointer`}
                  >
                    <i className="fa-solid fa-cart-shopping"></i>
                    <div className="absolute group-hover:flex hidden top-[110%] left-1/2 transform -translate-x-1/2 bg-[#ccc] whitespace-nowrap px-[10px] py-[5px] rounded-[5px] text-[#fff] ">
                      Giỏ hàng
                    </div>
                  </div>
                  <div
                    className={`relative w-3/12 flex items-center justify-center p-[10px] ${
                      isDarkMode ? "border-[1px]" : "bg-[#383838]"
                    }  rounded-[5px] group cursor-pointer`}
                  >
                    <i className="fa-solid fa-star"></i>
                    <div className="absolute group-hover:flex hidden top-[110%] left-1/2 transform -translate-x-1/2 bg-[#ccc] whitespace-nowrap px-[10px] py-[5px] rounded-[5px] text-[#fff]">
                      Yêu thích
                    </div>
                  </div>
                  <div
                    className={`relative w-3/12 flex items-center justify-center p-[10px] ${
                      isDarkMode ? "border-[1px]" : "bg-[#383838]"
                    }  rounded-[5px] group cursor-pointer`}
                  >
                    <i className="fa-solid fa-shop"></i>
                    <div className="absolute group-hover:flex hidden top-[110%] left-1/2 transform -translate-x-1/2 bg-[#ccc] whitespace-nowrap px-[10px] py-[5px] rounded-[5px] text-[#fff]">
                      Cửa hàng
                    </div>
                  </div>
                  <div
                    className={`relative w-3/12 flex items-center justify-center p-[10px] ${
                      isDarkMode ? "border-[1px]" : "bg-[#383838]"
                    }  rounded-[5px] group cursor-pointer`}
                  >
                    <i className="fa-solid fa-clipboard"></i>
                    <div className="absolute group-hover:flex hidden top-[110%] left-1/2 transform -translate-x-1/2 bg-[#ccc] whitespace-nowrap px-[10px] py-[5px] rounded-[5px] text-[#fff]">
                      Lịch sử mua
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;
