import React, { useEffect, useState } from "react";
import LayoutModeBackground from "../layout/LayoutModeBackground";
import HeaderTop from "../../../components/Header/HeaderTop";
import Header from "../../../components/Header/Header";
import SuggestionsSlide from "../../../components/Header/SuggestionsSlide";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "../../../Provider/ThemeProvider";
import { useAppData } from "../../../contexts/client/AppDataContext";
import Card from "../../../components/Products/Card";

const SearchProductByKeyWord = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");
  const { isDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);

  const {
    productsState: { products },
    getProductsByKeyword,
  } = useAppData();

  const [productList, setProductList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // Filter states
  const [priceSort, setPriceSort] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [ratingFilter, setRatingFilter] = useState(0);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductsByKeyword(keyword, currentPage, 36);
        const products = response?.data.product_keyword_responses || [];
        setProductList(products);
        setFilteredProducts(products);
        setTotalPages(response?.data.total_page || 0);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm theo từ khóa:", error);
      }
    };

    fetchProducts();
  }, [currentPage, keyword, getProductsByKeyword]);

  // Apply filters when they change
  useEffect(() => {
    let result = [...productList];

    // Filter by price range
    if (priceRange.min !== "") {
      result = result.filter(
        (product) => product.price >= Number(priceRange.min)
      );
    }

    if (priceRange.max !== "") {
      result = result.filter(
        (product) => product.price <= Number(priceRange.max)
      );
    }

    // Filter by rating
    if (ratingFilter > 0) {
      result = result.filter((product) => product.rating >= ratingFilter);
    }

    // Filter by discount
    if (hasDiscount) {
      result = result.filter(
        (product) =>
          product.product_discount_response ||
          (product.voucher_responses && product.voucher_responses.length > 0)
      );
    }

    // Sort by price
    if (priceSort === "asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (priceSort === "desc") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [productList, priceSort, priceRange, ratingFilter, hasDiscount]);

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setPriceSort("");
    setPriceRange({ min: "", max: "" });
    setRatingFilter(0);
    setHasDiscount(false);
  };

  return (
    <LayoutModeBackground>
      <HeaderTop />
      <Header />
      <SuggestionsSlide />
      <div className="w-full flex justify-center">
        <div className="pc:w-[90%] tl:w-[95%] mb:w-full flex mb:flex-col gap-[10px] my-[40px] tl:px-[10px] mb:px-[10px]">
          <div className="pc:w-full flex flex-col gap-[10px]">
            <div
              className={`w-full h-auto min-h-[54px] px-[20px] flex items-center mb:flex-wrap rounded-[5px] ${
                isDarkMode
                  ? "shadow-sm bg-light-100"
                  : "border-border-dark bg-dark-200 text-light-100"
              }`}
            >
              <div className="pc:border-r-[1px] pr-[10px] pb-[3px] mb:py-[5px]">
                <span className="font-nunito font-bold pc:text-[1.2rem] mb:text-[0.9rem] text-[#F8AF24]">
                  Kết quả tìm kiếm dành cho
                </span>
              </div>
              <div className="flex-1 flex items-center gap-[10px] px-[10px] overflow-hidden mb:py-[5px] mb:px-[2px] mb:text-[0.9rem] font-nunito font-bold">
                {`"${keyword}"`}
              </div>
            </div>

            {/* Filter section */}
            <div
              className={`w-full ${
                isDarkMode ? "bg-white" : "bg-dark-200 text-white"
              } shadow-md rounded-[5px] mb-[10px]`}
            >
              <div className="w-full flex items-center justify-between gap-[10px] px-[20px] py-[12px] border-b-[1px]">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 py-2 px-4 rounded-md ${
                    isDarkMode
                      ? "bg-gray-100 hover:bg-gray-200"
                      : "bg-dark-300 hover:bg-dark-400"
                  }`}
                >
                  <i className="fa-solid fa-filter"></i>
                  <span className="mb:hidden">Bộ lọc</span>
                </button>

                <div className="flex items-center gap-[10px]">
                  <div className="pc:w-[180px] tl:w-[150px] mb:w-[120px] flex border-[1px] rounded-[5px] px-[5px] py-[8px]">
                    <select
                      className="w-full outline-none border-none bg-transparent"
                      value={priceSort}
                      onChange={(e) => setPriceSort(e.target.value)}
                    >
                      <option className="bg-transparent" value="">
                        --Sắp xếp theo giá--
                      </option>
                      <option value="asc">Thấp đến cao</option>
                      <option value="desc">Cao đến thấp</option>
                    </select>
                  </div>

                  {productList?.length > 0 && (
                    <div
                      className={`flex justify-center items-center space-x-4 ${
                        isDarkMode ? "text-dark-100" : "text-light-100"
                      }`}
                    >
                      {/* Nút "Trước" */}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 0))
                        }
                        disabled={currentPage === 0}
                        className={`px-4 py-2 rounded ${
                          currentPage === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        <i className="fa-solid fa-chevron-left"></i>
                      </button>

                      {/* Số trang */}
                      {currentPage >= 0 && (
                        <button
                          className={`px-4 py-2 rounded ${
                            isDarkMode ? "border" : "bg-dark-700"
                          }`}
                        >
                          {currentPage + 1 + "/" + totalPages}
                        </button>
                      )}

                      {/* Nút "Tiếp" */}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages - 1)
                          )
                        }
                        disabled={currentPage + 1 >= totalPages}
                        className={`px-4 py-2 rounded ${
                          currentPage + 1 >= totalPages
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded filters */}
              {showFilters && (
                <div
                  className={`w-full px-[20px] py-[15px] border-b-[1px] ${
                    isDarkMode ? "bg-gray-50" : "bg-dark-300"
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="grid pc:grid-cols-3 tl:grid-cols-2 mb:grid-cols-1 gap-4">
                      {/* Price Range Filter */}
                      <div className="flex flex-col gap-2">
                        <label className="font-medium">Khoảng giá</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            name="min"
                            value={priceRange.min}
                            onChange={handlePriceRangeChange}
                            placeholder="Từ"
                            className={`w-full p-2 rounded border ${
                              isDarkMode ? "border-gray-300" : "border-dark-400"
                            } outline-none bg-transparent`}
                          />
                          <span>-</span>
                          <input
                            type="number"
                            name="max"
                            value={priceRange.max}
                            onChange={handlePriceRangeChange}
                            placeholder="Đến"
                            className={`w-full p-2 rounded border ${
                              isDarkMode ? "border-gray-300" : "border-dark-400"
                            } outline-none bg-transparent`}
                          />
                        </div>
                      </div>

                      {/* Rating Filter */}
                      <div className="flex flex-col gap-2">
                        <label className="font-medium">Đánh giá</label>
                        <div className="flex items-center gap-1">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRatingFilter(star)}
                              className={`p-2 rounded ${
                                ratingFilter === star
                                  ? "bg-yellow-400 text-dark-100"
                                  : isDarkMode
                                  ? "bg-gray-200"
                                  : "bg-dark-400"
                              }`}
                            >
                              {star}
                              <i className="fa-solid fa-star ml-1 text-yellow-500"></i>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Discount Filter */}
                      <div className="flex flex-col gap-2">
                        <label className="font-medium">Khuyến mãi</label>
                        <div className="flex items-center">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={hasDiscount}
                              onChange={() => setHasDiscount(!hasDiscount)}
                              className="sr-only peer"
                            />
                            <div
                              className={`relative w-11 h-6 bg-gray-200 rounded-full peer 
                              peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                              peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                              after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                              after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}
                            ></div>
                            <span className="ms-3">Có khuyến mãi</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Filter actions */}
                    <div className="flex justify-end gap-3 mt-2">
                      <button
                        onClick={resetFilters}
                        className={`px-4 py-2 rounded border ${
                          isDarkMode
                            ? "border-gray-300 hover:bg-gray-100"
                            : "border-dark-400 hover:bg-dark-300"
                        }`}
                      >
                        Xóa bộ lọc
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Product list */}
              <div className="flex flex-wrap items-center pc:px-[20px] tl:px-[10px] mb:px-[10px] pc:pt-[20px] tl:pt-[15px] mb:pt-[10px] pb-[20px]">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((content) => (
                    <Card
                      key={content.id}
                      cardContent={{
                        ...content,
                        thumbnail: {
                          avatar_url: content.thumbnail_response.avatar_url,
                        },
                      }}
                    />
                  ))
                ) : (
                  <div className="w-full flex items-end justify-center font-nunito font-bold py-[20px]">
                    <span>Không tìm thấy sản phẩm phù hợp</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutModeBackground>
  );
};

export default SearchProductByKeyWord;
