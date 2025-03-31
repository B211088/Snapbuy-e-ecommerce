import React, { useEffect } from "react";
import OutLetContainer from "../../../views/client/layout/OutLetContainer";
import { useTheme } from "../../../Provider/ThemeProvider";
import { Link, Outlet } from "react-router-dom";
import ContainerModeLayer1 from "../../Container/ContainerModeLayer1";
import { useState } from "react";
import { useNotify } from "../../Notify/NotifyModal";
import InputField from "../../Modal/InputField";
import GetCategory from "../Modal/GetCategory";
import { useAppData } from "../../../contexts/client/AppDataContext";
import { useShop } from "../../../contexts/User/ShopContext";

const AddProduct = () => {
  const { isDarkMode } = useTheme();
  const {
    shopState: { shopInfo, products },
    createProduct,
    addMultipleAttributes,
    addInfoProductsSeller,
  } = useShop();
  const { getAllSubcategoryAttributes } = useAppData();
  const { notifySuccess, notifyError, notifyWarning } = useNotify();
  const [ratio, setRatio] = useState("1x1");
  const [loading, setLoading] = useState(false);
  const [imageThumbnailPreview, setImageThumbnailPreview] = useState(null);
  const [imageThumbnail, setImageThumbnail] = useState(null);
  const [imagesProductPreview, setImagesProductPreview] = useState([]);
  const [imagesProduct, setImagesProduct] = useState([]);
  const [subcategoryAttributes, setSubcategoryAttributes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shopId, setShopId] = useState(null);
  const [attributeProduct, setAttributeProduct] = useState([]);
  const [infoProduct, setInfoProduct] = useState({
    name: "",
    description: "",
    subcategoryId: "",
  });

  useEffect(() => {
    if (shopInfo?.id) {
      setShopId(shopInfo.id);
    }
  }, [shopInfo]);

  const handleAttributeChange = (subcategory_attribute_id, value) => {
    setAttributeProduct((prev) => {
      const existingAttribute = prev.find(
        (attr) => attr.subcategory_attribute_id === subcategory_attribute_id
      );
      let updatedAttributes;

      if (existingAttribute) {
        updatedAttributes = prev.map((attr) =>
          attr.subcategory_attribute_id === subcategory_attribute_id
            ? { ...attr, value }
            : attr
        );
      } else {
        updatedAttributes = [...prev, { subcategory_attribute_id, value }];
      }

      return updatedAttributes;
    });
  };

  const fetchAttributes = async (subCategoryAttributeId) => {
    try {
      const response = await getAllSubcategoryAttributes(
        subCategoryAttributeId
      );
      if (response.success && response.data.length > 0) {
        setSubcategoryAttributes(response.data);
      } else {
        setSubcategoryAttributes([]);
      }
    } catch (error) {
      notifyWarning(error.message);
      setSubcategoryAttributes([]);
    }
  };

  const cropImage = async (imageFile) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(imageFile);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const { width: imgW, height: imgH } = img;
        let cropX = 0,
          cropY = 0,
          cropWidth = imgW,
          cropHeight = imgH;

        if (ratio === "1x1") {
          const size = Math.min(imgW, imgH);
          cropX = (imgW - size) / 2;
          cropY = (imgH - size) / 2;
          cropWidth = size;
          cropHeight = size;
          canvas.width = size;
          canvas.height = size;
        } else if (ratio === "3x4") {
          if (imgW / imgH > 3 / 4) {
            cropHeight = imgH;
            cropWidth = (imgH * 3) / 4;
            cropX = (imgW - cropWidth) / 2;
          } else {
            cropWidth = imgW;
            cropHeight = (imgW * 4) / 3;
            cropY = (imgH - cropHeight) / 2;
          }
          canvas.width = cropWidth;
          canvas.height = cropHeight;
        }

        ctx.drawImage(
          img,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );

        canvas.toBlob((blob) => resolve(blob), "image/jpeg");
      };
    });
  };

  const handleAddAttribute = async (productId) => {
    try {
      const response = await addMultipleAttributes(
        productId,
        shopId,
        attributeProduct
      );
      if (response.success) {
        notifySuccess("Sản phẩm đã được thêm thành công!");
        setInfoProduct({ name: "", description: "", subcategoryId: "" });
        setImagesProduct([]);
        setImagesProductPreview([]);
        setImageThumbnail(null);
        setImageThumbnailPreview(null);
        setSelectedCategory("");
        setSubcategoryAttributes([]);
        setLoading(false);
      } else {
        notifyError("Thêm thuộc tính thất bại!");
      }
    } catch (error) {
      notifyError(error.message);
    }
  };

  const handleCreateProduct = async () => {
    setLoading(true);
    if (
      !infoProduct.name ||
      !infoProduct.description ||
      !infoProduct.subcategoryId
    ) {
      notifyWarning("Vui lòng nhập đầy đủ thông tin!");
      setLoading(false);
      return;
    }

    if (!imageThumbnail) {
      notifyWarning("Vui lòng chọn ảnh bìa sản phẩm!");
      setLoading(false);
      return;
    }

    if (imagesProduct.length === 0) {
      notifyWarning("Vui lòng chọn ít nhất một ảnh sản phẩm!");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.keys(infoProduct).forEach((key) => {
      formData.append(key, infoProduct[key]);
    });

    const croppedThumbnail = await cropImage(imageThumbnail, ratio);
    formData.append("thumbnail", croppedThumbnail, "thumbnail.jpg");

    for (let i = 0; i < imagesProduct.length; i++) {
      const croppedImage = await cropImage(imagesProduct[i].file, ratio);
      formData.append("productImages", croppedImage, `product_${i + 1}.jpg`);
    }

    try {
      const response = await createProduct(shopId, formData);
      if (response) {
        handleAddAttribute(response.data.product_id);
      }
      setLoading(false);
    } catch (error) {
      notifyError("Lỗi khi thêm sản phẩm! Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const handleSelect = (item, type) => {
    setInfoProduct({ ...infoProduct, subcategoryId: item.id });
    setSelectedCategory(item);
    setIsModalOpen(false);
    fetchAttributes(item.id);
  };

  const handleRatioChange = (event) => {
    setRatio(event.target.value);
  };

  const handleImageThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageThumbnailPreview(URL.createObjectURL(file));
      setImageThumbnail(file);
    }
  };

  const handleImagesProductChange = (event) => {
    if (imagesProduct.length >= 5) {
      notifyWarning("Chỉ được thêm tối đa 5 ảnh");
      return;
    }

    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const newFiles = files.map((file) => {
        const id = crypto.randomUUID();

        return {
          id,
          file,
          src: URL.createObjectURL(file),
        };
      });

      setImagesProductPreview((prev) => [...prev, ...newFiles]);
      setImagesProduct((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveImageProduct = (id) => {
    setImagesProductPreview((prev) => prev.filter((image) => image.id !== id));
    setImagesProduct((prev) => prev.filter((image) => image.id !== id));
  };

  const handleRemoveImageThumbnail = () => {
    setImageThumbnailPreview(null);
    setImageThumbnail(null);
  };

  const handleInfoChange = (event) => {
    const { name, value } = event.target;
    setInfoProduct((prev) => ({ ...prev, [name]: value }));
  };
  const [categories, setCategories] = useState([
    { product_category_group_name: "", options: [""], error: "" },
  ]);
  const [tableData, setTableData] = useState([]);

  const sendProductCategory = async () => {
    const formData = new FormData();

    const productCategoryRequest = {
      productId: 1,
      shopId: shopId,
      product_category_groups: categories.map((category) => ({
        product_category_group_name: category.product_category_group_name,
        product_categories: tableData.map(
          ({ first_category, second_category, quantity }) => ({
            first_category,
            second_category,
            quantity: Number(quantity),
          })
        ),
      })),
    };

    formData.append(
      "productCategoryRequest",
      JSON.stringify(productCategoryRequest)
    );

    try {
      const response = await addInfoProductsSeller(formData);

      if (!response.ok) {
        throw new Error("Lỗi khi gửi dữ liệu");
      }

      const result = await response.json();
      console.log("Kết quả:", result);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const productCategoryRequest = {
    productId: 1,
    shopId: 1,
    product_category_groups: categories.map((category) => ({
      product_category_group_name: category.product_category_group_name,
      product_categories: tableData.map(
        ({ first_category, second_category, quantity, price }) => ({
          first_category,
          second_category,
          price,
          quantity: Number(quantity),
        })
      ),
    })),
  };

  console.log("productCategoryRequest ", productCategoryRequest);

  const handleCategoryChange = (index, value) => {
    const newCategories = [...categories];
    newCategories[index].product_category_group_name = value;

    const duplicate = newCategories.some(
      (cat, i) =>
        cat.product_category_group_name === value && i !== index && value !== ""
    );

    newCategories[index].error = duplicate
      ? "Các phân loại hàng phải khác nhau"
      : "";

    setCategories(newCategories);
    generateTable(newCategories);
  };

  const handleAddCategory = () => {
    if (categories.length < 2) {
      setCategories([
        ...categories,
        { product_category_group_name: "", options: [""], error: "" },
      ]);
    }
  };

  const handleOptionChange = (catIndex, optIndex, value) => {
    const newCategories = [...categories];
    newCategories[catIndex].options[optIndex] = value;

    const isDuplicate = newCategories[catIndex].options.some(
      (opt, i) => opt === value && i !== optIndex && value !== ""
    );

    newCategories[catIndex].error = isDuplicate
      ? "Các phân loại hàng phải khác nhau"
      : "";

    setCategories(newCategories);
    generateTable(newCategories);
  };

  const handleAddOption = (catIndex) => {
    const newCategories = [...categories];
    newCategories[catIndex].options.push("");
    setCategories(newCategories);
    generateTable(newCategories);
  };

  const handleRemoveOption = (catIndex, optIndex) => {
    const newCategories = [...categories];
    newCategories[catIndex].options.splice(optIndex, 1);
    setCategories(newCategories);
    generateTable(newCategories);
  };

  const generateTable = (newCategories) => {
    if (!newCategories[0]?.product_category_group_name) return;

    const category1 = newCategories[0];
    const category2 = newCategories[1] || null;
    const rows = [];

    category1.options.forEach((opt1) => {
      if (category2) {
        category2.options.forEach((opt2) => {
          rows.push({
            first_category: opt1,
            second_category: opt2,
            price: "",
            quantity: "",
          });
        });
      } else {
        rows.push({
          first_category: opt1,
          second_category: null,
          price: "",
          quantity: "",
        });
      }
    });

    setTableData(rows);
  };

  const handlePriceChange = (index, value) => {
    const updatedTable = [...tableData];
    updatedTable[index].price = value;
    setTableData(updatedTable);
  };

  const handleQuantityChange = (index, value) => {
    const updatedTable = [...tableData];
    updatedTable[index].quantity = value;
    setTableData(updatedTable);
  };

  const [imagesOption, setImagesOption] = useState({});
  const [imagesOptionPreview, setImagesOptionPreview] = useState({});
  console.log("imagesOption", imagesOption);
  console.log("imagesOptionPreview", imagesOptionPreview);

  const handleImageChange = (event, category) => {
    const file = event.target.files[0];
    if (file) {
      setImagesOptionPreview((prev) => ({
        ...prev,
        [category]: URL.createObjectURL(file),
      }));
      setImagesOption((prev) => ({
        ...prev,
        [category]: file,
      }));
    }
  };

  const handleRemoveImageOption = (category) => {
    setImagesOptionPreview((prev) => {
      const newPreview = { ...prev };
      delete newPreview[category];
      return newPreview;
    });
    setImagesOption((prev) => {
      const newImages = { ...prev };
      delete newImages[category];
      return newImages;
    });
  };
  return (
    <div className="w-full flex flex-col">
      <ContainerModeLayer1>
        <div className="w-full flex flex-col  px-[20px] py-[12px] border-b-[1px] border-dashed ">
          <div className="flex items-center  font-nunito gap-[10px] pb-[10px]">
            <div
              className={`w-[50px] h-[50px] min-w-[50px] flex items-center justify-center rounded-full border-[1px] text-[1.4rem] ${
                isDarkMode ? "text-dark-300" : "text-light-300"
              }`}
            >
              <i className="fa-solid fa-dolly"></i>
            </div>
            <div className="flex flex-col truncate">
              <h1 className="font-bold text-[1.2rem]">Thêm sản phẩm</h1>
              <p
                className={`font-normal text-[0.95rem] ${
                  isDarkMode ? " text-dark-300" : "text-light-300"
                }`}
              >
                Thêm sản phẩm vào kho
              </p>
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col">
          <div className="w-full  flex items-center gap-[10px] px-[20px] py-[20px]">
            <div className="w-2/12 flex items-center font-nunito text-[0.9rem] ">
              <span>Hình ảnh sản phẩm</span>
            </div>
            <div className="w-10/12 ">
              <div className="flex gap-4 mb-3 font-nunito pb-[20px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[0.85rem] ">Hình ảnh tỷ lệ 1x1</span>
                  <input
                    type="radio"
                    name="ratio"
                    value="1x1"
                    checked={ratio === "1x1"}
                    onChange={handleRatioChange}
                    className="hidden"
                  />
                  <div
                    className={`w-[16px] h-[16px] rounded-full border-2 ${
                      ratio === "1x1"
                        ? "bg-dark-500 border-dark-500"
                        : "border-gray-400"
                    }`}
                  />
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[0.85rem] ">Hình ảnh tỷ lệ 3x4</span>
                  <input
                    type="radio"
                    name="ratio"
                    value="3x4"
                    checked={ratio === "3x4"}
                    onChange={handleRatioChange}
                    className="hidden"
                  />
                  <div
                    className={`w-[16px] h-[16px] rounded-full border-2 ${
                      ratio === "3x4"
                        ? "bg-dark-500 border-dark-500"
                        : "border-gray-400"
                    }`}
                  />
                </label>
              </div>

              <div className="flex gap-4 flex-wrap">
                {imagesProductPreview.map((img, index) => (
                  <div
                    key={index}
                    className={`relative border rounded-lg overflow-hidden  group ${
                      ratio === "1x1"
                        ? "w-[100px] h-[100px]"
                        : "w-[75px] h-[100px]"
                    }`}
                  >
                    <img
                      src={img.src}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute group-hover:flex  hidden items-center justify-center top-[5%] right-[5%] px-[8px] py-[8px] rounded-full bg-dark-200 cursor-pointer"
                      onClick={() => handleRemoveImageProduct(img.id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </div>
                  </div>
                ))}

                {imagesProductPreview.length >= 0 &&
                  imagesProductPreview.length < 5 && (
                    <label
                      className={`flex flex-col items-center justify-center border border-dashed rounded-lg cursor-pointer text-gray-600 ${
                        ratio === "1x1"
                          ? "w-[100px] h-[100px]"
                          : "w-[75px] h-[100px]"
                      }`}
                    >
                      <i className="fa-solid fa-image text-2xl"></i>
                      <span className="text-[0.7rem] text-center">
                        Thêm hình ảnh {imagesProduct.length}/5
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImagesProductChange}
                      />
                    </label>
                  )}
              </div>
            </div>
          </div>
          <div className="w-full  flex items-center  gap-[10px]  px-[20px] py-[20px]">
            <div className="w-2/12 flex items-center font-nunito text-[0.9rem] ">
              <span>Thêm Ảnh bìa</span>
            </div>
            <div className="w-10/12 flex items-center gap-4 ">
              {imageThumbnailPreview ? (
                imageThumbnailPreview && (
                  <div className="w-[100px] h-[100px] aspect-square rounded-[5px] relative group">
                    <img
                      src={imageThumbnailPreview}
                      alt="Uploaded"
                      className="w-full  h-full aspect-square rounded-[5px] object-cover"
                    />
                    <div
                      className="absolute group-hover:flex  hidden items-center justify-center top-[5%] right-[5%] px-[8px] py-[8px] rounded-full bg-dark-200 cursor-pointer"
                      onClick={handleRemoveImageThumbnail}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </div>
                  </div>
                )
              ) : (
                <label
                  className={`flex flex-col w-[100px] h-[100px] aspect-square items-center justify-center border border-dashed rounded-lg cursor-pointer text-gray-600`}
                >
                  <i className="fa-solid fa-image text-2xl"></i>
                  <span className="text-[0.7rem] text-center">
                    Thêm hình ảnh
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageThumbnailChange}
                  />
                </label>
              )}

              <div className="font-nunito text-[0.8rem]">
                Tải lên hình ảnh 1:1. Ảnh bìa sẽ được hiển thị tại các trang Kết
                quả tìm kiếm, Gợi ý hôm nay,... Việc sử dụng ảnh bìa đẹp sẽ thu
                hút thêm lượt truy cập vào sản phẩm của bạn
              </div>
            </div>
          </div>
          <div className="w-full  flex items-center  gap-[10px]  px-[20px] py-[20px]">
            <div className="w-2/12 flex items-center font-nunito text-[0.9rem] ">
              <span>Tên sản phẩm</span>
            </div>
            <div className="w-10/12 flex items-center  gap-[10px]   ">
              <div
                className={`w-full h-[42px] flex items-center gap-[5px] pr-[5px] rounded-[5px] ${
                  isDarkMode ? "border-[1px]" : "bg-dark-400 "
                }`}
              >
                <input
                  className="w-full bg-transparent outline-none text-[0.8rem] px-[10px] "
                  type="text"
                  value={infoProduct.name}
                  maxLength={100}
                  name="name"
                  placeholder="Nhập tên sản phẩm"
                  onChange={handleInfoChange}
                />
                <div className="text-[0.8rem] w-[50px] flex justify-end">
                  <span> {infoProduct.name.length}/100</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex gap-[10px] px-[20px] py-[20px]">
            <div className="w-2/12 flex  font-nunito text-[0.9rem] ">
              <span>Mô tả sản phẩm</span>
            </div>
            <div className="w-10/12 flex items-center  gap-[10px] ">
              <div
                className={`w-full h-[122px] flex  gap-[5px] pr-[5px] rounded-[5px] ${
                  isDarkMode ? "border-[1px]" : "bg-dark-400 "
                }`}
              >
                <textarea
                  className="w-full h-full bg-transparent outline-none text-[0.8rem] p-[10px]"
                  type="text"
                  value={infoProduct.description}
                  maxLength={400}
                  name="description"
                  placeholder="Nhập mô tả sản phẩm"
                  onChange={handleInfoChange}
                />
                <div className="text-[0.8rem] w-[50px] flex justify-end py-[10px]">
                  <span> {infoProduct.description.length}/400</span>
                </div>
              </div>
            </div>
          </div>{" "}
          <div className="w-full  flex items-center gap-[10px] px-[20px] py-[20px]">
            <div className="w-2/12 flex items-center font-nunito text-[0.9rem] ">
              <span>Chọn nghành hàng</span>
            </div>
            <div className="w-10/12 flex items-center  ">
              <div
                className={`w-full flex items-center  h-[42px] rounded-[5px] cursor-pointer ${
                  isDarkMode ? "border-[1px]" : "bg-dark-400"
                }`}
                onClick={() => setIsModalOpen(true)}
              >
                <div className="w-full flex px-[10px] font-nunito text-[0.9rem]">
                  {selectedCategory && <p>{selectedCategory.name}</p>}
                </div>
                <div className="flex items-center justify-center text-[0.8rem] w-[50px] cursor-pointer border-l-[1px] h-full">
                  <i className="fa-solid fa-pen-to-square"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <GetCategory
            onCloseModal={() => setIsModalOpen(false)}
            onSelect={handleSelect}
          />
        )}
      </ContainerModeLayer1>
      {subcategoryAttributes.length > 0 && (
        <div className="w-full mt-[20px] ">
          <ContainerModeLayer1>
            <div className="w-full flex px-[20px] pt-[20px] pb-[15px] font-nunito gap-[10px]">
              <h1 className="font-nunito font-bold text-[1.2rem] ">
                Nhập thuộc tính sản phẩm
              </h1>
            </div>
            <div className="w-full flex flex-wrap px-[20px] pt-[20px] pb-[10px]">
              {subcategoryAttributes.length > 0 ? (
                subcategoryAttributes.map((attr) => (
                  <div
                    key={attr.subcategory_attribute_id}
                    className="w-6/12 flex items-center mb-3 pr-[20px]"
                  >
                    <label className="w-3/12 font-nunito text-[0.9rem]">
                      {attr.attribute_value}:
                    </label>
                    <div
                      className={`w-9/12  rounded-[5px] ${
                        isDarkMode ? " border" : "bg-dark-400"
                      }`}
                    >
                      <input
                        type="text"
                        className="w-full  p-2 rounded text-[0.9rem] outline-none bg-transparent"
                        placeholder={`Nhập ${attr.attribute_value}`}
                        onChange={(e) =>
                          handleAttributeChange(
                            attr.subcategory_attribute_id,
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="font-nunito text-[0.9rem]">
                  Không có thuộc tính
                </div>
              )}
            </div>
          </ContainerModeLayer1>
        </div>
      )}
      <div className="w-full mt-[20px]">
        <ContainerModeLayer1>
          <div className="w-full p-4">
            {categories.map((category, catIndex) => (
              <div key={catIndex} className="mb-4 p-4 border rounded-lg">
                <label className="block font-semibold">
                  Phân loại {catIndex + 1}
                </label>
                <input
                  type="text"
                  value={category.product_category_group_name}
                  onChange={(e) =>
                    handleCategoryChange(catIndex, e.target.value)
                  }
                  className="w-full p-2 border rounded-md"
                  maxLength={14}
                />
                <p className="text-sm text-gray-500 text-right">
                  {category.product_category_group_name.length}/14
                </p>
                {category.error && (
                  <p className="text-red-500 text-sm">{category.error}</p>
                )}

                <h3 className="mt-2 font-semibold">Tùy chọn</h3>
                {category.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(catIndex, optIndex, e.target.value)
                      }
                      className={`w-full p-2 border rounded-md ${
                        category.error ? "border-red-500" : ""
                      }`}
                      maxLength={20}
                    />
                    <p className="text-sm text-gray-500">{option.length}/20</p>
                    {category.options.length > 1 && (
                      <button
                        onClick={() => handleRemoveOption(catIndex, optIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ❌
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => handleAddOption(catIndex)}
                  className="mt-2 p-2 bg-blue-500 text-white rounded-md"
                >
                  + Thêm Tùy Chọn
                </button>
              </div>
            ))}

            {categories.length < 2 && (
              <button
                onClick={handleAddCategory}
                className="mt-4 p-2 bg-green-500 text-white rounded-md"
              >
                + Thêm Phân Loại
              </button>
            )}

            {tableData.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Bảng phân loại</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 p-2">
                        {categories[0]?.product_category_group_name ||
                          "Phân loại 1"}
                      </th>
                      {categories.length > 1 && (
                        <th className="border border-gray-300 p-2">
                          {categories[1]?.product_category_group_name ||
                            "Phân loại 2"}
                        </th>
                      )}
                      <th className="border border-gray-300 p-2">Giá</th>
                      <th className="border border-gray-300 p-2">Kho hàng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => {
                      const showCategory1 =
                        index === 0 ||
                        tableData[index - 1].first_category !==
                          row.first_category;

                      return (
                        <tr key={index} className="border border-gray-300">
                          {showCategory1 ? (
                            <td
                              rowSpan={
                                tableData.filter(
                                  (r) => r.first_category === row.first_category
                                ).length
                              }
                              className="border  border-gray-300 p-2 text-center font-medium"
                            >
                              <div className="flex flex-col justify-center items-center">
                                <label className="cursor-pointer relative">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleImageChange(e, row.first_category)
                                    }
                                  />
                                  <div className="w-[50px] h-[50px] border-[1px] rounded-[5px] flex items-center justify-center text-[1.2rem] cursor-pointer">
                                    {imagesOptionPreview[row.first_category] ? (
                                      <>
                                        <img
                                          src={
                                            imagesOptionPreview[
                                              row.first_category
                                            ]
                                          }
                                          alt="preview"
                                          className="w-full h-full object-cover rounded-[5px]"
                                        />
                                        <div
                                          className="absolute top-[-8px] right-[-8px] bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveImageOption(
                                              row.first_category
                                            );
                                          }}
                                        >
                                          ✕
                                        </div>
                                      </>
                                    ) : (
                                      <i className="fa-solid fa-image"></i>
                                    )}
                                  </div>
                                </label>
                              </div>
                            </td>
                          ) : null}
                          {categories.length > 1 && (
                            <td className="border border-gray-300 p-2 text-center">
                              {row.second_category}
                            </td>
                          )}
                          {/* Ô nhập giá */}
                          <td className="border border-gray-300 p-2 text-center">
                            <input
                              type="number"
                              value={row.price}
                              onChange={(e) =>
                                handlePriceChange(index, e.target.value)
                              }
                              className="w-full border rounded-md p-1"
                            />
                          </td>
                          {/* Ô nhập kho hàng */}
                          <td className="border border-gray-300 p-2 text-center">
                            <input
                              type="number"
                              value={row.quantity}
                              onChange={(e) =>
                                handleQuantityChange(index, e.target.value)
                              }
                              className="w-full border rounded-md p-1"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </ContainerModeLayer1>
      </div>
      <div className="w-full mt-[20px]">
        <ContainerModeLayer1>
          {" "}
          <div className="w-full flex justify-end py-[20px] px-[20px]">
            <button
              className={`py-[5px] px-[20px] rounded-[5px] flex items-center gap-2 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary text-light-100"
              }`}
              onClick={handleCreateProduct}
              disabled={loading}
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              )}
              {loading ? "Đang xử lý..." : "Thêm sản phẩm"}
            </button>
          </div>
        </ContainerModeLayer1>
      </div>
    </div>
  );
};

export default AddProduct;
