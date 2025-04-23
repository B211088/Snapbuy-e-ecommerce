import React, { useEffect, useState } from "react";
import Card from "./Card";
import sanpham1 from "../../assets/images/sanpham1.webp";
import sanpham2 from "../../assets/images/sanpham2.webp";
import sanpham3 from "../../assets/images/sanpham3.jpg";
import { useTheme } from "../../Provider/ThemeProvider";
import { useAppData } from "../../contexts/client/AppDataContext";
import Loading from "../../views/client/pages/Loading";

const ITEMS_PER_PAGE = 30;

const CardList = () => {
  const { isDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const [productList, setProductList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const {
    productsState: { products },
    getProductsByRating,
  } = useAppData();
  console.log({ productList });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductsByRating(currentPage, 36);
        if (response.success) {
          setProductList(response?.data.productRatingOrderResponses || []);
          setTotalPages(response?.data.total_page || 0);
          setLoading(false);
        }
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm theo rating:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full  flex items-center justify-center my-[40px] tl:px-[10px] mb:px-[10px]">
      <div
        className={`pc:w-[90%] min-w-[90%] mb:w-full flex-col ${
          isDarkMode ? "bg-white" : "bg-dark-200 text-white"
        } shadow-md rounded-[5px]`}
      >
        <div
          className={`w-full h-[54px] mb:h-full  px-[20px] flex items-center mb:flex-wrap   ${
            isDarkMode ? "border-[#ccc]" : "border-border-dark"
          } border-b-[1px] border-dashed`}
        >
          <div className="mb:min-w-full pc:border-r-[1px] pr-[10px]  border-[#ccc] py-[5px]">
            <span className="font-nunito font-bold text-[1.2rem] text-[#F8AF24]">
              Gợi ý sản phẩm dành cho bạn
            </span>
          </div>
          <div className="flex-1 flex items-center gap-[10px] px-[10px] overflow-hidden mb:py-[10px] mb:px-[2px] ">
            <div
              className={`active  border-[1px] border-[#ccc] rounded-full cursor-pointer px-[10px] py-[5px] font-nunito font-semibold text-[0.9rem] ${
                isDarkMode
                  ? " hover:bg-primary hover:text-white hover:border-none"
                  : "hover:bg-dark-700 hover:text-black hover:border-none"
              }`}
            >
              <span className="truncate">Sản phẩm trending</span>
            </div>
            <div
              className={` border-[1px]   border-[#ccc]  rounded-full cursor-pointer px-[10px] py-[5px] font-nunito font-semibold text-[0.9rem] ${
                isDarkMode
                  ? " hover:bg-primary hover:text-white hover:border-none hover:font-bold"
                  : "hover:bg-dark-700 hover:text-black hover:border-none hover:font-bold"
              }`}
            >
              <span className="truncate"> Sản phẩm công nghệ</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center pc:pr-[20px] tl:pr-[10px] mb:pr-[10px] pt-[10px] pb-[20px]">
          {productList?.length > 0 ? (
            productList.map((content) => (
              <Card key={content.id} cardContent={content} />
            ))
          ) : (
            <div className="w-full flex items-end justify-center font-nunito font-bold  py-[20px]">
              <span> Chưa có sản phẩm</span>
            </div>
          )}
        </div>
        {productList?.length > 0 && (
          <div
            className={`flex justify-center items-center space-x-2 py-4 ${
              isDarkMode ? " text-light-100" : "text-light-100"
            }`}
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className={`px-4 py-2 rounded ${
                currentPage === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary"
              }`}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <div className="flex space-x-2">
              {(() => {
                const groupSize = 4;
                const start = Math.floor(currentPage / groupSize) * groupSize;
                const end = Math.min(start + groupSize, totalPages);

                const pageButtons = [];
                for (let i = start; i < end; i++) {
                  pageButtons.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`px-4 py-2 rounded ${
                        currentPage === i ? "bg-primary" : "bg-gray-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                }

                return pageButtons;
              })()}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage + 1 >= totalPages}
              className={`px-4 py-2 rounded ${
                currentPage + 1 >= totalPages
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary"
              }`}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardList;
