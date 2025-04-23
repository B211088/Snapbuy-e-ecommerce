import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LayoutModeBackground from "../layout/LayoutModeBackground";
import HeaderTop from "../../../components/Header/HeaderTop";
import Header from "../../../components/Header/Header";
import SuggestionsSlide from "../../../components/Header/SuggestionsSlide";
import SectionContainer from "../layout/SectionContainer";
import { useTheme } from "../../../Provider/ThemeProvider";
import { useAppData } from "../../../contexts/client/AppDataContext";
import Loading from "./Loading";
import ModalContainer from "../../../components/Modal/ModalContainer";
import { useAuth } from "../../../contexts/User/AuthContext";
import { useNotify } from "../../../components/Notify/NotifyModal";
import FeedBackProduct from "../../../components/Products/feedBackProduct";
import ProductsSlide from "../../../components/display/ProductsSlide";
import Footer from "../../../components/display/Footer";
function ProductDetail() {
  const { getProductDetail } = useAppData();
  const {
    authState: { user },
    addProductToCart,
  } = useAuth();
  const { notifySuccess, notifyWarning, notifyError } = useNotify();
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [product, setProduct] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [mainImageId, setMainImageId] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [productPrice, setProductPrice] = useState(0);
  const [selectedLv1, setSelectedLv1] = useState(null);
  const [selectedLv1Data, setSelectedLv1Data] = useState(null);
  const [selectedLv2, setSelectedLv2] = useState(null);
  const [selectedLv2Data, setSelectedLv2Data] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [productShippingInfo, setProductShippingInfo] = useState([]);
  const [orderProductListData, setOrderProductListData] = useState([
    {
      user_id: user?.id,
      shop_id: 0,
      quantityProduct: 0,
      order_detail_dtos: [
        {
          product_id: 0,
          thumbnail: "",
          name: "",
          product_option: {},
          sub_product_option: {},
          quantity: 0,
          price: 0,
        },
      ],
      infoShop: {
        shop_name: "",
        description: "",
        logo: "",
      },
    },
  ]);

  console.log({ product });

  const handleAddProductToCart = async () => {
    try {
      const formData = {
        user_id: user?.id,
        product_id: product?.product_basic_info.product_id,
        quantity: quantity,
        product_category_id: selectedLv1,
        product_subcategory_id: selectedLv2 ? selectedLv2 : null,
      };
      const response = await addProductToCart(formData);
      if (response.success) {
        notifySuccess("Đã thêm vào giỏ hàng");
        return;
      }
      notifyWarning(response.message);
      return;
    } catch (error) {
      notifyError("Lỗi server:", error.message);
    }
  };

  const [showSelectProductShiping, setShowSelectProductShiping] =
    useState(false);

  const handeShowSelectProductShiping = () => {
    setShowSelectProductShiping(true);
  };

  const handeCloseSelectProductShiping = () => {
    setShowSelectProductShiping(false);
  };

  useEffect(() => {
    setOrderProductListData([
      {
        user_id: user?.id,
        shop_id: product?.shop_response.id,
        quantityProduct: 1,
        order_detail_dtos: [
          {
            product_id: product?.product_basic_info.product_id,
            thumbnail: product?.thumbnail?.avatar_url,
            name: product?.product_basic_info.name,
            product_option: selectedLv1Data,
            sub_product_option: selectedLv2Data ? selectedLv2Data : null,
            quantity: quantity,
            price: productPrice,
          },
        ],
        shipping_types: product?.product_shipping_type_responses,
        infoShop: {
          shop_name: product?.shop_response.shop_name,
          description: product?.shop_response.description,
          logo: product?.shop_response.logo,
        },
      },
    ]);
  }, [selectedLv1, selectedLv2, quantity]);

  const handlePlaceOrder = () => {
    navigate("/checkout", {
      state: { orderProductListState: orderProductListData },
    });
  };

  const isTwoLevel =
    product?.product_category_responses?.product_category_two_level?.length > 0;
  const isOneLevel =
    product?.product_category_responses?.product_category_one_level_responses
      ?.length > 0;

  const level1Name =
    product?.product_category_responses?.product_category_group
      ?.product_category_group_name || "Phân loại 1";
  const level2Name =
    product?.product_category_responses?.sub_product_category_group
      ?.product_category_group_name || "Phân loại 2";

  const selectedLv1Option =
    isTwoLevel && selectedLv1
      ? product?.product_category_responses?.product_category_two_level.find(
          (option) => option.product_category_response.id === selectedLv1
        )
      : null;

  const availableLv2Options =
    selectedLv1Option?.child_product_category_responses || [];

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await getProductDetail(id);
        if (response.success) {
          setProduct(response.data);

          // Set initial main image
          const firstImage = response.data?.product_images?.[0];
          if (firstImage) {
            setMainImage(firstImage.avatar_url);
            setMainImageId(firstImage.public_id);
            setPreviousImage(firstImage.avatar_url);
          }

          // Set initial price based on product structure
          if (
            response.data?.product_category_responses
              ?.product_category_one_level_responses?.length > 0
          ) {
            // One-level variant products
            const firstOption =
              response.data.product_category_responses
                .product_category_one_level_responses[0];
            setProductPrice(firstOption.price);
            setSelectedLv1(firstOption.id);
            setSelectedLv1Data(firstOption);
          } else if (
            response.data?.product_category_responses
              ?.product_category_two_level?.length > 0
          ) {
            // Two-level variant products
            const firstLv1 =
              response.data.product_category_responses
                .product_category_two_level[0];
            const firstLv2 = firstLv1.child_product_category_responses[0];

            setSelectedLv1(firstLv1.product_category_response.id);
            setSelectedLv1Data(firstLv1.product_category_response);
            setSelectedLv2(firstLv2.id);
            setSelectedLv2Data(firstLv2);
            setProductPrice(firstLv2.price);
            setSelectedVariant({
              level1: firstLv1.product_category_response.name,
              level2: firstLv2.name,
              price: firstLv2.price,
              quantity: firstLv2.quantity,
            });
          }
          setProductShippingInfo(response.data.product_shipping_type_responses);
        }
      } catch (error) {
        console.error("Error fetching product details:", error.message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  // Update selected variant information when selections change
  useEffect(() => {
    if (isTwoLevel && selectedLv1 && selectedLv2) {
      const lv1Option =
        product.product_category_responses.product_category_two_level.find(
          (option) => option.product_category_response.id === selectedLv1
        );

      const lv2Option = lv1Option?.child_product_category_responses.find(
        (option) => option.id === selectedLv2
      );

      if (lv1Option && lv2Option) {
        setSelectedVariant({
          level1: lv1Option.product_category_response.name,
          level2: lv2Option.name,
          price: lv2Option.price,
          quantity: lv2Option.quantity,
        });
      }
    } else if (isOneLevel && selectedLv1) {
      const option =
        product.product_category_responses.product_category_one_level_responses.find(
          (option) => option.id === selectedLv1
        );

      if (option) {
        setSelectedVariant({
          level1: option.value,
          price: option.price,
          quantity: option.quantity,
        });
      }
    }
  }, [selectedLv1, selectedLv2, isTwoLevel, isOneLevel, product]);

  const handleClickThumb = (publicId) => {
    const selectedImage = product?.product_images.find(
      (image) => image.public_id === publicId
    );
    if (selectedImage) {
      setMainImage(selectedImage.avatar_url);
      setMainImageId(selectedImage.public_id);
    }
  };

  const handleTriggerCategoryImages = (option) => {
    setPreviousImage(mainImage);

    if (isOneLevel && option.public_id) {
      setMainImage(option.image_url);
    } else if (isTwoLevel && option.image_url) {
      setMainImage(option.image_url);
    }
  };

  const handleRemoveCategoryImages = () => {
    setMainImage(previousImage);
  };

  const handleSelectLv1 = (option) => {
    if (isOneLevel) {
      setSelectedLv1(option.id);
      setSelectedLv1Data(option);
      setProductPrice(option.price);
    } else if (isTwoLevel) {
      const lv1Id = option.product_category_response.id;
      setSelectedLv1(lv1Id);
      setSelectedLv2(null); // Reset level 2 selection

      // Set image if available
      if (option.product_category_response.image_url) {
        setPreviousImage(mainImage);
        setMainImage(option.product_category_response.image_url);
      }
    }
  };

  const handleSelectLv2 = (option) => {
    setSelectedLv2(option.id);
    setSelectedLv2Data(option);
    setProductPrice(option.price);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    const maxQty = selectedVariant?.quantity || 999;
    if (quantity < maxQty) {
      setQuantity(quantity + 1);
    }
  };

  const handleKeyDown = (event) => {
    if (!product?.product_images?.length) return;

    if (event.key === "ArrowRight") {
      const currentIndex = product.product_images.findIndex(
        (img) => img.public_id === mainImageId
      );
      const nextIndex = (currentIndex + 1) % product.product_images.length;
      setMainImage(product.product_images[nextIndex].avatar_url);
      setMainImageId(product.product_images[nextIndex].public_id);
    } else if (event.key === "ArrowLeft") {
      const currentIndex = product.product_images.findIndex(
        (img) => img.public_id === mainImageId
      );
      const prevIndex =
        (currentIndex - 1 + product.product_images.length) %
        product.product_images.length;
      setMainImage(product.product_images[prevIndex].avatar_url);
      setMainImageId(product.product_images[prevIndex].public_id);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [product, mainImageId]);

  const getVariantDetail = () => {
    if (!selectedVariant) return "";

    if (isTwoLevel) {
      return `${selectedVariant.level1}, ${selectedVariant.level2}`;
    } else if (isOneLevel) {
      return selectedVariant.level1;
    }
    return "";
  };

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <LayoutModeBackground>
        <HeaderTop />
        <Header />
        <SuggestionsSlide />
        <SectionContainer>
          <div className="w-full h-96 flex items-center justify-center">
            <div className="text-lg">Không tìm thấy sản phẩm</div>
          </div>
        </SectionContainer>
      </LayoutModeBackground>
    );
  }

  return (
    <div className="w-full">
      <HeaderTop />
      <Header />
      <SuggestionsSlide />
      <LayoutModeBackground>
        <SectionContainer>
          <div className="w-full min-h-[100vh] flex flex-col justify-center px-5 py-[5px] rounded">
            <div className="w-full flex flex-col md:flex-row gap-2.5 py-5">
              <div className=" pc:w-5/12 w-full  flex mb:flex-col-reverse gap-2">
                <div className="w-2/12 h-fit mb:w-full  flex flex-col mb:flex-row  gap-2">
                  {product?.product_images?.map((img) => (
                    <div
                      key={img.public_id}
                      className="w-full aspect-square cursor-pointer"
                      onClick={() => handleClickThumb(img.public_id)}
                    >
                      <img
                        className={`w-full h-full object-cover rounded-[5px] aspect-square ${
                          img.public_id !== mainImageId ? "brightness-50" : ""
                        }`}
                        src={img.avatar_url}
                        alt={`thumb-${img.public_id}`}
                      />
                    </div>
                  ))}
                </div>
                <div
                  className={`relative w-10/12 h-fit mb:w-full flex items-center justify-center aspect-square  rounded-[5px] ${
                    isDarkMode ? "bg-dark-200" : "bg-dark-400"
                  }`}
                >
                  <img
                    className="w-full h-full absolute aspect-square top-0 left-0   rounded object-contain"
                    src={mainImage || ""}
                    alt="main"
                  />
                </div>
              </div>

              <div
                className={`pc:w-7/12  w-full flex flex-col ${
                  isDarkMode ? "bg-light-100" : "bg-dark-400"
                } rounded py-2.5 pc:px-5 px-[10px]`}
              >
                <div className="w-full h-full flex flex-col  font-nunito">
                  <div className="w-full flex flex-col">
                    <div className="w-full font-semibold text-xl py-2.5">
                      <h1>{product?.product_basic_info?.name}</h1>
                    </div>

                    <div className="w-full flex items-center font-normal py-[10px]">
                      <div className="w-full flex items-center  py-1.5 text-sm">
                        <div className="w-3/12">
                          <span>Phân loại</span>
                        </div>
                        <span>
                          {
                            product?.product_basic_info?.subcategory_id
                              ?.category_response?.name
                          }
                        </span>
                        <span>{"-"}</span>
                        <span>
                          {product?.product_basic_info?.subcategory_id?.name}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`w-full flex font-semibold text-2xl py-[10px]  rounded `}
                    >
                      <div className="w-3/12 font-normal">
                        <span className="text-[0.9rem]">Giá</span>
                      </div>
                      <div
                        className={`w-9/12 px-[10px] py-[10px] rounded-[5px]  ${
                          isDarkMode
                            ? "bg-dark-900 text-red-500 "
                            : "bg-dark-300 text-red-500 "
                        }`}
                      >
                        <span>{productPrice?.toLocaleString("vi-VN")} ₫</span>
                      </div>
                    </div>

                    <div className="w-full flex text-[0.9rem] py-[10px]">
                      <div className="w-3/12 ">Vận chuyển</div>
                      <div className="w-9/12 flex flex-col ">
                        <div className="w-full flex items-center gap-[10px]">
                          <i className="fa-solid fa-truck text-green-700"></i>
                          <div className="flex items-center gap-[10px]">
                            <span>Nhận vào</span>
                            <span>
                              {(() => {
                                const estimatedDays =
                                  productShippingInfo[0]?.estimated_time;
                                const deliveryDate = new Date(
                                  Date.now() +
                                    estimatedDays * 24 * 60 * 60 * 1000
                                );
                                const day = deliveryDate
                                  .getDate()
                                  .toString()
                                  .padStart(2, "0");
                                const month = (deliveryDate.getMonth() + 1)
                                  .toString()
                                  .padStart(2, "0");
                                return `${day} Th${month}`;
                              })()}
                            </span>
                          </div>
                          <div
                            className="w-[30px] h-[30px] flex items-center justify-center cursor-pointer "
                            onClick={handeShowSelectProductShiping}
                          >
                            <i className="fa-regular fa-circle-question"></i>
                          </div>
                        </div>
                        <div className="w-full flex items-center gap-[10px] ml-[30px] text-[0.8rem] text-dark-400">
                          <div className="">{productShippingInfo[0]?.name}</div>
                          <div className="">
                            {productShippingInfo[0]?.price.toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </div>
                        </div>
                      </div>
                    </div>

                    {showSelectProductShiping && (
                      <ModalContainer
                        onCloseModal={handeCloseSelectProductShiping}
                      >
                        <div className="w-full flex flex-col  items-center gap-[5px] px-[10px]  font-nunito font-bold ">
                          <div className="w-full flex items-center px-[10px] gap-[10px] border-b-[1px] border-dashed py-[10px]">
                            <div className="min-w-[50px] h-[50px] flex items-center justify-center rounded-full text-[1.4rem] border-[1px] ">
                              <i className="fa-solid fa-layer-group"></i>
                            </div>
                            <div className="w-full">
                              <h1 className="text-[1.2rem]">
                                Thông tin về phí vận chuyển
                              </h1>
                            </div>
                          </div>
                          <div className="w-full flex flex-col   font-nunito ">
                            {productShippingInfo?.map((item) => {
                              return (
                                <div
                                  key={item.id}
                                  className={`w-full flex items-center gap-[10px] px-[20px] py-[10px] cursor-pointer rounded-[5px] ${
                                    isDarkMode ? "hover:bg-dark-900" : ""
                                  }`}
                                >
                                  <div className="w-full flex flex-col ">
                                    <div className="">{item?.name}</div>
                                    <div className="w-full flex items-center gap-[10px] text-[0.8rem] text-dark-400">
                                      <div className="flex items-center gap-[10px]">
                                        <span>Nhận vào</span>
                                        <span>
                                          {(() => {
                                            const estimatedDays =
                                              item?.estimated_time;
                                            const deliveryDate = new Date(
                                              Date.now() +
                                                estimatedDays *
                                                  24 *
                                                  60 *
                                                  60 *
                                                  1000
                                            );
                                            const day = deliveryDate
                                              .getDate()
                                              .toString()
                                              .padStart(2, "0");
                                            const month = (
                                              deliveryDate.getMonth() + 1
                                            )
                                              .toString()
                                              .padStart(2, "0");
                                            return `${day} Th${month}`;
                                          })()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="w-full flex items-center justify-end gap-[10px]  text-[0.9rem] ">
                                    <div className="">
                                      {Number(
                                        item?.price.toFixed(2)
                                      ).toLocaleString("vi-VN")}
                                      đ
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="w-full  px-[10px] font-nunito py-[10px]">
                            <div className="w-full flex flex-col bg-dark-900 p-[10px] rounded-[5px]">
                              <h1 className="w-full flex flex-col font-bold text-[0.9rem]  text-dark-300 pb-[10px]">
                                Quy định vận chuyển Thời gian giao hàng được
                                tính
                              </h1>
                              <ul className="w-full flex flex-col font-normal text-[0.8rem] text-dark-300  gap-[5px] text-justify pl-[20px] list-disc ">
                                <li className="">
                                  theo ngày làm việc, không bao gồm Thứ Bảy, Chủ
                                  Nhật và ngày lễ.
                                </li>
                                <li>
                                  Ngày lễ như Tết, 30/4, 1/5, 2/9... sẽ được tự
                                  động loại trừ khỏi thời gian giao hàng.
                                </li>
                                <li>
                                  Một số khu vực xa, hẻo lánh có thể giao hàng
                                  chậm hơn dự kiến.
                                </li>
                                <li>
                                  Đơn hàng đặt sau 17h sẽ được xử lý vào ngày
                                  làm việc tiếp theo.
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="w-full flex items-center justify-end px-[20px] border-t-[1px] py-[10px]">
                            <div
                              className="bg-primary px-[20px] py-[8px] text-light-100 rounded-[5px] font-normal text-[0.9rem] cursor-pointer "
                              onClick={handeCloseSelectProductShiping}
                            >
                              <span>Đã hiểu</span>
                            </div>
                          </div>
                        </div>
                      </ModalContainer>
                    )}

                    {selectedVariant && (
                      <div className="w-full flex items-center text-sm py-2.5">
                        <div className="w-3/12">Đã chọn:</div>
                        <div className="w-9/12 font-medium">
                          {getVariantDetail()}
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className={`w-full flex flex-col gap-5 p-5 rounded ${
                      isDarkMode ? "border" : " bg-dark-300"
                    }`}
                  >
                    {/* Level 1 Selection */}
                    {isOneLevel && (
                      <div className="w-full flex items-start font-nunito">
                        <div className="w-3/12 flex text-sm truncate pt-2.5">
                          {product?.product_category_responses
                            ?.product_category_group
                            ?.product_category_group_name || "Phân loại"}
                        </div>
                        <div className="w-9/12 flex flex-wrap">
                          {product?.product_category_responses?.product_category_one_level_responses?.map(
                            (option) => (
                              <div
                                key={option.id}
                                className={`min-w-[100px] flex items-center ml-2.5 mt-2.5 px-2 py-1.5 rounded gap-2.5 cursor-pointer ${
                                  selectedLv1 === option.id
                                    ? "border border-red-500"
                                    : isDarkMode
                                    ? "border"
                                    : "bg-dark-500"
                                }`}
                                onMouseEnter={() => {
                                  setIsHovered(true);
                                  handleTriggerCategoryImages(option);
                                }}
                                onMouseLeave={() => {
                                  setIsHovered(false);
                                  handleRemoveCategoryImages();
                                }}
                                onClick={() => handleSelectLv1(option)}
                              >
                                {option.image_url && (
                                  <img
                                    className="aspect-square w-8 h-8 rounded-sm"
                                    src={option.image_url}
                                    alt=""
                                  />
                                )}
                                <span className="text-sm line-clamp-3">
                                  {option.value}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Two-level selections */}
                    {isTwoLevel && (
                      <>
                        {/* Level 1 Selection */}
                        <div className="w-full flex items-start font-nunito">
                          <div className="w-3/12 flex text-sm truncate pt-2.5">
                            {level1Name}
                          </div>
                          <div className="w-9/12 flex flex-wrap">
                            {product?.product_category_responses?.product_category_two_level?.map(
                              (item) => (
                                <div
                                  key={item.product_category_response.id}
                                  className={`min-w-[100px] flex items-center ml-2.5 mt-2.5 px-2 py-1.5 rounded gap-2.5 cursor-pointer ${
                                    selectedLv1 ===
                                    item.product_category_response.id
                                      ? "border border-red-500"
                                      : isDarkMode
                                      ? "border"
                                      : "bg-dark-500"
                                  }`}
                                  onMouseEnter={() => {
                                    setIsHovered(true);
                                    handleTriggerCategoryImages(
                                      item.product_category_response
                                    );
                                  }}
                                  onMouseLeave={() => {
                                    setIsHovered(false);
                                    handleRemoveCategoryImages();
                                  }}
                                  onClick={() => handleSelectLv1(item)}
                                >
                                  {item.product_category_response.image_url && (
                                    <img
                                      className="aspect-square w-8 h-8 rounded-sm"
                                      src={
                                        item.product_category_response.image_url
                                      }
                                      alt=""
                                    />
                                  )}
                                  <span className="text-sm line-clamp-3">
                                    {item.product_category_response.name}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* Level 2 Selection */}
                        {selectedLv1 && (
                          <div className="w-full flex items-start font-nunito">
                            <div className="w-3/12 flex text-sm truncate pt-2.5">
                              {level2Name}
                            </div>
                            <div className="w-9/12 flex flex-wrap">
                              {availableLv2Options.map((option) => (
                                <div
                                  key={option.id}
                                  className={`min-w-[100px] flex items-center justify-center ml-2.5 mt-2.5 px-2 py-1.5 rounded gap-2.5 cursor-pointer ${
                                    selectedLv2 === option.id
                                      ? "border border-red-500"
                                      : isDarkMode
                                      ? "border"
                                      : "bg-dark-500"
                                  }`}
                                  onClick={() => handleSelectLv2(option)}
                                >
                                  <div className="flex-1 text-sm flex items-center justify-center">
                                    <span className="w-full text-center">
                                      {option.name}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Quantity selector */}
                    <div className="w-full flex items-center mt-2.5 ">
                      <div className="w-3/12 text-sm">Số lượng</div>
                      <div className="w-9/12 flex items-center pl-[10px]">
                        <div className="flex border rounded ">
                          <button
                            className="px-3 py-1 border-r"
                            onClick={decreaseQuantity}
                          >
                            -
                          </button>
                          <div className="px-4 py-1 flex items-center justify-center">
                            {quantity}
                          </div>
                          <button
                            className="px-3 py-1 border-l"
                            onClick={increaseQuantity}
                          >
                            +
                          </button>
                        </div>
                        {selectedVariant && (
                          <div className="ml-4 text-sm text-gray-500">
                            {selectedVariant.quantity} sản phẩm có sẵn
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Attributes */}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex item flex-col md:flex-row gap-5 py-5 pr-5 pl-0 mb:p-[0px]">
              <div className="w-full md:w-5/12 flex items-center gap-2.5 font-nunito text-sm font-bold">
                <div className="flex justify-center items-center gap-2.5 px-5 py-2 border rounded cursor-pointer">
                  <div>
                    <i className="fa-solid fa-share-from-square"></i>
                  </div>
                  <span>Chia sẻ</span>
                </div>
              </div>
              <div className="w-full md:w-7/12 py-[10px] flex items-center justify-end gap-2.5 font-nunito text-sm font-bold">
                <div
                  className="mb:w-6/12 flex justify-center items-center px-5 py-2  border rounded cursor-pointer"
                  onClick={handleAddProductToCart}
                >
                  <span>Thêm vào giỏ hàng</span>
                </div>
                <div
                  className="mb:w-6/12 flex justify-center items-center px-5 py-2 border bg-primary rounded cursor-pointer text-light-100"
                  onClick={handlePlaceOrder}
                >
                  <span>Đặt hàng ngay</span>
                </div>
              </div>
            </div>

            <div className="w-full flex items-center flex-row md:flex-row gap-[5px] py-[10px] pr-5 pl-0 border-t-[1px] mb:py-[5px]">
              <div className="flex items-center gap-[10px]">
                <div className="w-[60px] h-[60px] mb:w-[50px] mb:h-[50px] aspect-square rounded-full border">
                  <img src={product?.shop_response.logo} alt="" />
                </div>
                <div className="w-full flex flex-col  ">
                  <div className="font-bold ">
                    {product?.shop_response.shop_name}
                  </div>
                  <p className="text-[0.9rem]">
                    {product?.shop_response.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="w-full flex flex-row mb:flex-col-reverse gap-[30px] border-t-[1px] py-[20px]">
              {product?.product_basic_info?.description && (
                <div className="pc:w-7/12 w-full ">
                  <h2 className="text-lg font-semibold mb-2.5">
                    Mô tả sản phẩm
                  </h2>
                  <p
                    className={`whitespace-pre-line text-justify mb:text-[0.9rem] ${
                      isDarkMode ? "text-dark-300" : "text-dark-800"
                    }`}
                  >
                    {product.product_basic_info.description}
                  </p>
                </div>
              )}
              {product?.product_attribute_value_responses?.length > 0 && (
                <div className="pc:w-5/12 w-full pc:h-fit pc:sticky top-[20px] flex flex-col border-[1px] p-[10px] rounded-[5px]">
                  <div className="text-sm font-semibold p-[10px]">
                    Thông tin sản phẩm
                  </div>
                  <div className="w-full mb:max-h-[280px] overflow-y-auto overflow-x-hidden scrollbar-custom flex flex-wrap gap-y-3 pb-[10px]">
                    {product.product_attribute_value_responses.map((attr) => (
                      <div
                        key={attr.product_attribute_value_id}
                        className={`min-w-3/12 mb:min-w-full   flex items-center pl-[10px] `}
                      >
                        <div
                          className={`w-full flex items-center rounded p-2 ${
                            isDarkMode ? "border" : "bg-dark-400"
                          }`}
                        >
                          <div
                            className={`text-sm  mr-1 whitespace-nowrap ${
                              isDarkMode ? "text-dark-200" : "text-dark-900"
                            }`}
                          >
                            {attr.attribute_name}:
                          </div>
                          <div className=" text-sm font-medium  inline-block ">
                            {attr.value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </SectionContainer>
        <SectionContainer>
          <FeedBackProduct productId={product.product_basic_info.product_id} />
        </SectionContainer>
        <div className="w-full flex flex-col items-center justify-center">
          <div className="pc:w-[90%] w-full  ">
            <h1 className="font-bold text-[1.2rem] text-primary">
              Gợi ý dành cho bạn
            </h1>
          </div>
          <ProductsSlide />
        </div>{" "}
      </LayoutModeBackground>
      <Footer />
    </div>
  );
}

export default ProductDetail;
