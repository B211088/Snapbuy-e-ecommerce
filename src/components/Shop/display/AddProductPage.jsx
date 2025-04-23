// // Main component file: AddProduct.jsx
// import { useEffect, useState } from "react";
// import { useTheme } from "../../../Provider/ThemeProvider";
// import { useNotify } from "../../Notify/NotifyModal";
// import { useAppData } from "../../../contexts/client/AppDataContext";
// import { useShop } from "../../../contexts/User/ShopContext";
// import ContainerModeLayer1 from "../../Container/ContainerModeLayer1";

// // Import sub-components
// import ProductBasicInfo from "../sections/ProductBasicInfo";
// import ProductImagesSection from "../sections/ProductImagesSection";
// import ProductAttributesSection from "../sections/ProductAttributesSection";
// import ProductVariantsSection from "../sections/ProductVariantsSection";
// import ShippingInfoSection from "../sections/ShippingInfoSection";
// import GetCategory from "../Modal/GetCategory";

// // Import custom hooks
// import useProductImages from "../hooks/useProductImages";
// import useProductVariants from "../hooks/useProductVariants";

// const AddProduct = () => {
//   const { isDarkMode } = useTheme();
//   const {
//     shopState,
//     createProduct,
//     addMultipleAttributes,
//     addInfoProductsSellerLv1,
//     addInfoProductsSellerLv2,
//     getShipingType,
//   } = useShop();
//   const { getAllSubcategoryAttributes } = useAppData();
//   const { notifySuccess, notifyError, notifyWarning } = useNotify();

//   const [loading, setLoading] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [shopId, setShopId] = useState(null);
//   const [attributeProduct, setAttributeProduct] = useState([]);
//   const [subcategoryAttributes, setSubcategoryAttributes] = useState([]);
//   const [shipingType, setShipingType] = useState([]);
//   const [infoProduct, setInfoProduct] = useState({
//     name: "",
//     description: "",
//     subcategoryId: "",
//   });

//   // Use custom hooks
//   const {
//     ratio,
//     imageThumbnail,
//     imageThumbnailPreview,
//     imagesProduct,
//     imagesProductPreview,
//     handleRatioChange,
//     handleImageThumbnailChange,
//     handleImagesProductChange,
//     handleRemoveImageProduct,
//     handleRemoveImageThumbnail,
//     cropImage,
//   } = useProductImages();

//   const {
//     categories,
//     tableData,
//     imagesOption,
//     imagesOptionPreview,
//     handleCategoryChange,
//     handleOptionChange,
//     handleAddCategory,
//     handleAddOption,
//     handleRemoveOption,
//     handleRemoveCategory,
//     handlePriceChange,
//     handleQuantityChange,
//     handleImageChange,
//     handleRemoveImageOption,
//     generateTable,
//   } = useProductVariants();

//   // Set shop ID when shopInfo is available
//   useEffect(() => {
//     if (shopState?.shopInfo?.id) {
//       setShopId(shopState.shopInfo.id);
//     }
//   }, [shopState.shopInfo]);

//   // Fetch shipping types
//   useEffect(() => {
//     const fetchShipingType = async () => {
//       try {
//         const response = await getShipingType();
//         if (response.success) {
//           setShipingType(response.data);
//         }
//       } catch (error) {
//         console.log(error.message);
//       }
//     };

//     fetchShipingType();
//   }, [getShipingType]);

//   // Handle attribute changes
//   const handleAttributeChange = (subcategory_attribute_id, value) => {
//     setAttributeProduct((prev) => {
//       const existingAttribute = prev.find(
//         (attr) => attr.subcategory_attribute_id === subcategory_attribute_id
//       );

//       if (existingAttribute) {
//         return prev.map((attr) =>
//           attr.subcategory_attribute_id === subcategory_attribute_id
//             ? { ...attr, value }
//             : attr
//         );
//       } else {
//         return [...prev, { subcategory_attribute_id, value }];
//       }
//     });
//   };

//   // Fetch attributes for selected category
//   const fetchAttributes = async (subCategoryAttributeId) => {
//     try {
//       const response = await getAllSubcategoryAttributes(
//         subCategoryAttributeId
//       );
//       if (response.success && response.data.length > 0) {
//         setSubcategoryAttributes(response.data);
//       } else {
//         setSubcategoryAttributes([]);
//       }
//     } catch (error) {
//       notifyWarning(error.message);
//       setSubcategoryAttributes([]);
//     }
//   };

//   // Handle category selection
//   const handleSelect = (item) => {
//     setInfoProduct({ ...infoProduct, subcategoryId: item.id });
//     setSelectedCategory(item);
//     setIsModalOpen(false);
//     fetchAttributes(item.id);
//   };

//   // Handle text input changes
//   const handleInfoChange = (event) => {
//     const { name, value } = event.target;
//     setInfoProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   // Add product attributes
//   const handleAddAttribute = async (productId) => {
//     try {
//       const response = await addMultipleAttributes(
//         productId,
//         shopId,
//         attributeProduct
//       );

//       if (response.success) {
//         setInfoProduct({ name: "", description: "", subcategoryId: "" });
//         // Reset other states as needed
//         return { success: true };
//       } else {
//         notifyError("Thêm thuộc tính thất bại!");
//         return { success: false };
//       }
//     } catch (error) {
//       notifyError(error.message);
//       return { success: false };
//     }
//   };

//   // Add Level 1 product info
//   const handleAddInfoProductsSellerLv1 = async (productId) => {
//     const form = new FormData();

//     const productCategoryRequestLv1 = {
//       product_category_group_name:
//         categories[0]?.product_category_group_name || "",
//       product_categories: tableData.map(
//         ({ first_category, quantity, price }) => ({
//           value: first_category,
//           price: parseInt(price),
//           quantity: Number(quantity),
//         })
//       ),
//     };
//     form.append(
//       "productCategoryRequest",
//       new Blob([JSON.stringify(productCategoryRequestLv1)], {
//         type: "application/json",
//       })
//     );

//     const filesArray = Object.values(imagesOption);

//     for (let i = 0; i < filesArray.length; i++) {
//       form.append("files", filesArray[i].file, `option_${i + 1}.jpg`);
//     }

//     try {
//       const response = await addInfoProductsSellerLv1(productId, shopId, form);

//       if (response.success) {
//         setCategories([]);
//         setImagesOption({});
//         setImagesOptionPreview({});
//         setTableData([]);

//         return { success: true };
//       }

//       notifyWarning("Thêm thông tin bán hàng không thành công");
//       return { success: false };
//     } catch (error) {
//       console.error("Lỗi:", error);
//     }
//   };

//   // Add Level 2 product info
//   const handleAddInfoProductsSellerLv2 = async (productId) => {
//     const form = new FormData();
//     const productCategoryRequestLv2 = {
//       product_category_group:
//         categories[0]?.product_category_group_name?.toLowerCase() || "",
//       sub_product_category_group:
//         categories[1]?.product_category_group_name?.toLowerCase() || "",
//       product_category_two_level: categories[0]?.options
//         .map((option) => {
//           const rows = tableData.filter((row) => row.first_category === option);

//           if (rows.length === 0) return null;

//           return {
//             parent_product_category: option,
//             child_product_categories: rows.map((row) => ({
//               name: row.second_category,
//               quantity: Number(row.quantity),
//               price: parseInt(row.price),
//             })),
//           };
//         })
//         .filter(Boolean),
//     };

//     form.append(
//       "multipleProductCategoryDTO",
//       new Blob([JSON.stringify(productCategoryRequestLv2)], {
//         type: "application/json",
//       })
//     );

//     const filesArray = Object.values(imagesOption);

//     for (let i = 0; i < filesArray.length; i++) {
//       const croppedImageOption = await cropImage(filesArray[i].file, "1x1");
//       form.append("files", croppedImageOption, `option_${i + 1}.jpg`);
//     }

//     try {
//       const response = await addInfoProductsSellerLv2(productId, shopId, form);
//       if (response.success) {
//         setCategories([]);
//         setImagesOption({});
//         setImagesOptionPreview({});
//         setTableData([]);

//         return { success: true };
//       }
//       notifyWarning("Thêm thông tin bán hàng không thành công");
//       return { success: false };
//     } catch (error) {
//       console.error("Lỗi:", error);
//     }
//   };
//   // Create product
//   const handleCreateProduct = async () => {
//     setLoading(true);

//     // Validate form data
//     if (
//       !infoProduct.name ||
//       !infoProduct.description ||
//       !infoProduct.subcategoryId
//     ) {
//       notifyWarning("Vui lòng nhập đầy đủ thông tin!");
//       setLoading(false);
//       return;
//     }

//     if (!imageThumbnail) {
//       notifyWarning("Vui lòng chọn ảnh bìa sản phẩm!");
//       setLoading(false);
//       return;
//     }

//     if (imagesProduct.length === 0) {
//       notifyWarning("Vui lòng chọn ít nhất một ảnh sản phẩm!");
//       setLoading(false);
//       return;
//     }

//     // Create form data
//     const formData = new FormData();
//     Object.keys(infoProduct).forEach((key) => {
//       formData.append(key, infoProduct[key]);
//     });

//     // Add cropped images
//     const croppedThumbnail = await cropImage(imageThumbnail, ratio);
//     formData.append("thumbnail", croppedThumbnail, "thumbnail.jpg");

//     for (let i = 0; i < imagesProduct.length; i++) {
//       const croppedImage = await cropImage(imagesProduct[i].file, ratio);
//       formData.append("productImages", croppedImage, `product_${i + 1}.jpg`);
//     }

//     try {
//       // Create product
//       const response = await createProduct(shopId, formData);

//       if (response.success) {
//         // Add attributes
//         await handleAddAttribute(response.data.product_id);

//         // Add seller info based on category levels
//         if (categories.length === 1) {
//           const responseInfoSeller = await handleAddInfoProductsSellerLv1(
//             response.data.product_id
//           );
//           if (responseInfoSeller.success) {
//             notifySuccess("Tạo sản phẩm thành công!");
//           }
//         } else {
//           const responseInfoSeller = await handleAddInfoProductsSellerLv2(
//             response.data.product_id
//           );
//           if (responseInfoSeller.success) {
//             notifySuccess("Tạo sản phẩm thành công!");
//           }
//         }
//       }
//     } catch (error) {
//       notifyError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full flex flex-col">
//       <ContainerModeLayer1>
//         <div className="w-full flex flex-col px-[20px] py-[12px] border-b-[1px] border-dashed">
//           <div className="flex items-center font-nunito gap-[10px] pb-[10px]">
//             <div
//               className={`w-[50px] h-[50px] min-w-[50px] flex items-center justify-center rounded-full border-[1px] text-[1.4rem] ${
//                 isDarkMode ? "text-dark-300" : "text-light-300"
//               }`}
//             >
//               <i className="fa-solid fa-dolly"></i>
//             </div>
//             <div className="flex flex-col truncate">
//               <h1 className="font-bold text-[1.2rem]">Thêm sản phẩm</h1>
//               <p
//                 className={`font-normal text-[0.95rem] ${
//                   isDarkMode ? " text-dark-300" : "text-light-300"
//                 }`}
//               >
//                 Thêm sản phẩm vào kho
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Product Images Section */}
//         <ProductImagesSection
//           ratio={ratio}
//           imageThumbnail={imageThumbnail}
//           imageThumbnailPreview={imageThumbnailPreview}
//           imagesProduct={imagesProduct}
//           imagesProductPreview={imagesProductPreview}
//           handleRatioChange={handleRatioChange}
//           handleImageThumbnailChange={handleImageThumbnailChange}
//           handleImagesProductChange={handleImagesProductChange}
//           handleRemoveImageProduct={handleRemoveImageProduct}
//           handleRemoveImageThumbnail={handleRemoveImageThumbnail}
//           isDarkMode={isDarkMode}
//           loading={loading}
//         />

//         {/* Product Basic Info */}
//         <ProductBasicInfo
//           infoProduct={infoProduct}
//           handleInfoChange={handleInfoChange}
//           selectedCategory={selectedCategory}
//           setIsModalOpen={setIsModalOpen}
//           isDarkMode={isDarkMode}
//           loading={loading}
//         />
//       </ContainerModeLayer1>

//       {/* Category selection modal */}
//       {isModalOpen && (
//         <GetCategory
//           onCloseModal={() => setIsModalOpen(false)}
//           onSelect={handleSelect}
//         />
//       )}

//       {/* Product Attributes Section */}
//       {subcategoryAttributes.length > 0 && (
//         <ProductAttributesSection
//           subcategoryAttributes={subcategoryAttributes}
//           handleAttributeChange={handleAttributeChange}
//           isDarkMode={isDarkMode}
//           loading={loading}
//         />
//       )}

//       {/* Product Variants Section */}
//       <ProductVariantsSection
//         categories={categories}
//         tableData={tableData}
//         imagesOption={imagesOption}
//         imagesOptionPreview={imagesOptionPreview}
//         handleCategoryChange={handleCategoryChange}
//         handleOptionChange={handleOptionChange}
//         handleAddCategory={handleAddCategory}
//         handleAddOption={handleAddOption}
//         handleRemoveOption={handleRemoveOption}
//         handleRemoveCategory={handleRemoveCategory}
//         handlePriceChange={handlePriceChange}
//         handleQuantityChange={handleQuantityChange}
//         handleImageChange={handleImageChange}
//         handleRemoveImageOption={handleRemoveImageOption}
//         isDarkMode={isDarkMode}
//         loading={loading}
//       />

//       {/* Shipping Info Section */}
//       <ShippingInfoSection
//         shipingType={shipingType}
//         isDarkMode={isDarkMode}
//         loading={loading}
//       />

//       {/* Submit Button Section */}
//       <ContainerModeLayer1>
//         <div className="w-full flex justify-end py-[20px] px-[20px]">
//           <button
//             disabled={loading}
//             className={`py-[5px] px-[20px] rounded-[5px] flex items-center gap-2 ${
//               loading
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-primary text-light-100"
//             }`}
//             onClick={handleCreateProduct}
//           >
//             {loading && (
//               <svg
//                 className="animate-spin h-5 w-5 text-white"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <path d="M12 6v6l4 2" />
//               </svg>
//             )}
//             {loading ? "Đang xử lý..." : "Thêm sản phẩm"}
//           </button>
//         </div>
//       </ContainerModeLayer1>
//     </div>
//   );
// };

// export default AddProduct;
