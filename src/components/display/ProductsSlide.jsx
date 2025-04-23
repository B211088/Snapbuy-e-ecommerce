import React, { useEffect, useState, useCallback, useRef } from "react";
import { useTheme } from "../../Provider/ThemeProvider";
import { Link } from "react-router-dom";
import { useAppData } from "../../contexts/client/AppDataContext";
import Loading from "../../views/client/pages/Loading";

const ProductsSlide = () => {
  const { isDarkMode } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productList, setProductList] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const sliderRef = useRef(null);
  const currentIndexRef = useRef(currentIndex);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const {
    productsState: { products },
    getProductsByRating,
  } = useAppData();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductsByRating(0, 15);
        if (response.success) {
          setProductList(response?.data.productRatingOrderResponses || []);
          setLoading(false);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Lỗi khi lấy sản phẩm theo rating:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1200) {
        setItemsPerSlide(3); // PC
      } else if (width >= 768) {
        setItemsPerSlide(2); // Tablet
      } else {
        setItemsPerSlide(1); // Mobile
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const totalSlides = Math.max(
    1,
    Math.ceil(productList.length / itemsPerSlide)
  );

  const changeSlide = useCallback(
    (index) => {
      if (isTransitioning) return;

      setIsTransitioning(true);
      setCurrentIndex(index);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);

      resetAutoScroll();
    },
    [isTransitioning]
  );

  const scrollLeft = useCallback(() => {
    const newIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
    changeSlide(newIndex);
  }, [currentIndex, totalSlides, changeSlide]);

  const scrollRight = () => {
    const newIndex =
      currentIndexRef.current === totalSlides - 1
        ? 0
        : currentIndexRef.current + 1;
    changeSlide(newIndex);
  };

  const resetAutoScroll = useCallback(() => {
    setIsPaused(true);
    const timeout = setTimeout(() => {
      setIsPaused(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (productList.length === 0 || totalSlides <= 1) return;

    const interval = setInterval(() => {
      if (!isPaused && !isTransitioning) {
        scrollRight();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [productList.length, totalSlides]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        scrollRight();
      } else {
        scrollLeft();
      }
      setTouchStart(null);
    }
  };

  const renderProductCard = (item, index) => (
    <div
      key={`${item.id}-${index}`}
      className={`flex-1 min-w-0 flex items-center  gap-[10px] hover:translate-y-[-4px] hover:translate-x-[-4px] transition-all duration-200 my-[10px] ${
        isDarkMode ? "bg-white text-black" : "bg-dark-200 text-white"
      } shadow-md p-[10px] rounded-[5px] cursor-pointer`}
    >
      <img
        className="w-[110px] h-[110px] object-cover aspect-square rounded-[5px]"
        src={item?.thumbnail.avatar_url}
        alt={item.name}
        loading="lazy"
      />
      <div className="w-full h-full py-[5px] flex flex-col justify-between">
        <h3 className="h-[50px] font-nunito font-bold line-clamp-2">
          {item.name}
        </h3>
        <span className="] font-bold text-[1rem] text-[#d81f1f] py-[5px]">
          {item.price.toLocaleString("vi-VN")}đ
        </span>
        <div className="w-full flex items-center justify-between">
          {item.voucher_responses ? (
            <div className="max-w-full flex items-center overflow-auto scrollbar-custom-none gap-[3px] ">
              {[...item.voucher_responses]
                .sort((a, b) => b.discount_percent - a.discount_percent)
                .slice(0, 1)
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
          ) : (
            <div className="h-[22px]"></div>
          )}

          <div className="w-1/12 flex justify-end">
            <Link
              to={`/product/${encodeURIComponent(
                item.id
              )}?name=${encodeURIComponent(item.name)}`}
              className={`w-[28px] h-[28px] rounded-[5px] ${
                isDarkMode ? "bg-white text-black" : "bg-dark text-white"
              } flex items-center justify-center shadow-md text-[1rem]`}
            >
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIndicators = () => (
    <div className="flex items-center justify-center gap-[5px] mt-[15px]">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => changeSlide(index)}
          className={`w-[10px] h-[10px] rounded-full transition-all ${
            index === currentIndex
              ? "bg-[#d81c1c] w-[20px]"
              : isDarkMode
              ? "bg-gray-300"
              : "bg-gray-600"
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="relative pc:w-[90%] tl:w-full mb:w-full pc:py-[30px] tl:py-[30px] tl:px-[10px] mb:py-[20px]">
        <div className="w-full relative">
          <button
            onClick={scrollLeft}
            disabled={isTransitioning}
            className={`absolute w-[36px] h-[36px] flex items-center justify-center pc:left-[-20px] tl:left-[5px] mb:left-[2px] top-1/2 transform -translate-y-1/2 bg-[#2b2b2b41] text-white p-2 rounded-full z-10 hover:bg-[#2b2b2b70] transition-colors ${
              isTransitioning ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Previous slide"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <div
            className="w-full overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            ref={sliderRef}
          >
            {productList.length > 0 ? (
              <div
                className="w-full transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  display: "grid",
                  gridTemplateColumns: `repeat(${totalSlides}, 100%)`,
                  gridGap: "0px",
                }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div
                    key={slideIndex}
                    className="grid"
                    style={{
                      gridTemplateColumns: `repeat(${itemsPerSlide}, 1fr)`,
                      gap: "20px",
                      width: "100%",
                    }}
                  >
                    {productList
                      .slice(
                        slideIndex * itemsPerSlide,
                        Math.min(
                          (slideIndex + 1) * itemsPerSlide,
                          productList.length
                        )
                      )
                      .map((item, i) =>
                        renderProductCard(item, `${slideIndex}-${i}`)
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full mb:px-[10px]">
                <div
                  className={`w-full flex justify-center items-center py-[20px] rounded-[5px]  ${
                    isDarkMode
                      ? "border-[1px] bg-light-100"
                      : " bg-dark-200 text-light-100"
                  }`}
                >
                  <span>Chưa có sản phẩm</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={scrollRight}
            disabled={isTransitioning}
            className={`absolute w-[36px] h-[36px] flex items-center justify-center pc:right-[-20px] tl:right-[5px]  mb:right-[2px] top-1/2 transform -translate-y-1/2 bg-[#2b2b2b41] text-white p-2 rounded-full hover:bg-[#2b2b2b70] transition-colors ${
              isTransitioning ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Next slide"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        {renderIndicators()}
      </div>
    </div>
  );
};

export default ProductsSlide;
