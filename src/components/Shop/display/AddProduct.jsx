import { useCallback, useEffect } from "react";
import { useTheme } from "../../../Provider/ThemeProvider";
import ContainerModeLayer1 from "../../Container/ContainerModeLayer1";
import { useState } from "react";
import { useNotify } from "../../Notify/NotifyModal";
import GetCategory from "../Modal/GetCategory";
import { useAppData } from "../../../contexts/client/AppDataContext";
import { useShop } from "../../../contexts/User/ShopContext";
import { debounce } from "lodash";

const AddProduct = () => {
  const { isDarkMode } = useTheme();
  const {
    shopState: { shopInfo },
    createProduct,
    addMultipleAttributes,
    addInfoProductsSellerLv1,
    addInfoProductsSellerLv2,
    getShipingType,
    caculateShipingFee,
    addProductShippingInfo,
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
  const [imagesOption, setImagesOption] = useState({});
  const [imagesOptionPreview, setImagesOptionPreview] = useState({});
  const [shippingType, setShippingType] = useState([]);
  const [shippingFee, setShippingFee] = useState();
  const [toggleButtonShiping, setToggleButtonShiping] = useState({});
  const [categories, setCategories] = useState([
    { product_category_group_name: "", options: [""], error: "" },
  ]);

  const [tableData, setTableData] = useState([]);
  const [infoProduct, setInfoProduct] = useState({
    name: "",
    description: "",
    subcategoryId: "",
  });

  const [shippingWeigth, setShippingWeigth] = useState("");
  const [shippingSize, setShipingSize] = useState({
    width: "",
    height: "",
    high: "",
  });

  const [shipingTypeId, setShippingTypeId] = useState([]);

  const toggleButtonShippingChange = (type) => {
    if (loading) {
      return;
    }
    setToggleButtonShiping((prev) => ({
      ...prev,
      [type.id]: !prev[type.id],
    }));
    setShippingTypeId((prev) => {
      if (prev.includes(type.id)) {
        return prev.filter((id) => id !== type.id);
      } else {
        return [...prev, type.id];
      }
    });
  };

  useEffect(() => {
    if (shopInfo?.id) {
      setShopId(shopInfo.id);
    }
  }, [shopInfo]);

  const handleChangeShippingWeigth = (e) => {
    const { value } = e.target;

    // Chỉ cho phép nhập số hoặc để trống
    if (/^\d*$/.test(value)) {
      setShippingWeigth(value); // Lưu dưới dạng chuỗi
    }
  };

  const handleChangeShippingSize = (e) => {
    const { name, value } = e.target;

    // Chỉ cho phép nhập số hoặc để trống
    if (/^\d*$/.test(value)) {
      setShipingSize((prev) => ({
        ...prev,
        [name]: value, // Lưu dưới dạng chuỗi
      }));
    }
  };

  useEffect(() => {
    const fetchShipingType = async () => {
      try {
        const response = await getShipingType();
        if (response.success) {
          const shipingWithDefault = response.data.map((type) => ({
            ...type,
            priceAfterCaculate: 0,
          }));
          setShippingType(shipingWithDefault);
          return;
        }

        return;
      } catch (error) {
        notifyError("Lỗi khi lấy phân loại vận chuyển" + error.message);
      }
    };

    fetchShipingType();
  }, []);

  const fecthcaculateShipingFee = async () => {
    try {
      const formData = {
        weight: Number(shippingWeigth / 1000),
        height: Number(shippingSize.height),
        width: Number(shippingSize.width),
        high: Number(shippingSize.high),
      };
      const response = await caculateShipingFee(formData);
      if (response.success) {
        setShippingFee(response.data);
      }
    } catch (error) {
      notifyError("Không thể tính toán phí vận chuyển:" + error.message);
    }
  };

  const debouncedFetchShippingFee = useCallback(
    debounce(() => {
      fecthcaculateShipingFee();
    }, 1000),
    [shippingSize, shippingWeigth]
  );

  useEffect(() => {
    if (
      Number(shippingWeigth) > 0 &&
      Number(shippingSize.width) > 0 &&
      Number(shippingSize.height) > 0 &&
      Number(shippingSize.high) > 0
    ) {
      debouncedFetchShippingFee();
    } else if (
      Number(shippingWeigth) > 0 ||
      (Number(shippingSize.width) > 0 &&
        Number(shippingSize.height) > 0 &&
        Number(shippingSize.high) > 0)
    ) {
      const resetShipingType = shippingType.map((type) => ({
        ...type,
        priceAfterCaculate: 0,
      }));
      setShippingType(resetShipingType);
    }
  }, [
    shippingWeigth,
    shippingSize.width,
    shippingSize.height,
    shippingSize.high,
  ]);

  useEffect(() => {
    if (Array.isArray(shippingFee) && shippingFee.length > 0) {
      const newShipingType = shippingFee.map((item) => {
        const { shipping_type_response, price } = item;
        return {
          id: shipping_type_response.id,
          name: shipping_type_response.name,
          description: shipping_type_response.description,
          price: shipping_type_response.price,
          priceAfterCaculate: Math.round(price),
          estimated_time: shipping_type_response.estimated_time,
        };
      });
      setShippingType(newShipingType);
    }
  }, [shippingFee]);

  const handleAddProductShippingInfo = async (productId) => {
    try {
      const formData = {
        shop_id: shopId,
        product_id: productId,
        weight: Number(shippingWeigth) / 1000,
        height: Number(shippingSize.height),
        width: Number(shippingSize.width),
        high: Number(shippingSize.high),
        shipping_type_ids: shipingTypeId,
      };

      const response = await addProductShippingInfo(formData);

      if (response.success) {
        setShippingWeigth("");
        setShipingSize({
          width: "",
          height: "",
          high: "",
        });
        setShippingFee([]);
        setShippingType((prev) =>
          prev.map((type) => ({
            ...type,
            priceAfterCaculate: 0,
          }))
        );
        setShippingTypeId([]);
        setToggleButtonShiping({});

        return { success: true };
      }

      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

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

  const cropImage = async (imageFile, ratioConfig) => {
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

        if (ratioConfig === "1x1") {
          const size = Math.min(imgW, imgH);
          cropX = (imgW - size) / 2;
          cropY = (imgH - size) / 2;
          cropWidth = size;
          cropHeight = size;
          canvas.width = size;
          canvas.height = size;
        } else if (ratioConfig === "3x4") {
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
        return { success: true };
      } else {
        notifyError("Thêm thuộc tính thất bại!");
      }
    } catch (error) {
      notifyError(error.message);
    }
  };

  const handleSelect = (item) => {
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

  const handleAddInfoProductsSellerLv1 = async (productId) => {
    const form = new FormData();

    const productCategoryRequestLv1 = {
      product_category_group_name:
        categories[0]?.product_category_group_name || "",
      product_categories: tableData.map(
        ({ first_category, quantity, price }) => ({
          value: first_category,
          price: parseInt(price),
          quantity: Number(quantity),
        })
      ),
    };

    form.append(
      "productCategoryRequest",
      new Blob([JSON.stringify(productCategoryRequestLv1)], {
        type: "application/json",
      })
    );

    const filesArray = Object.values(imagesOption);

    for (let i = 0; i < filesArray.length; i++) {
      form.append("files", filesArray[i].file, `option_${i + 1}.jpg`);
    }

    try {
      const response = await addInfoProductsSellerLv1(productId, shopId, form);

      if (response.success) {
        return { success: true };
      }

      notifyWarning("Thêm thông tin bán hàng không thành công");
      return { success: false };
    } catch (error) {
      notifyError("Lỗi khi thêm thông tin bán hàng: " + error.message);
    }
  };

  const handleAddInfoProductsSellerLv2 = async (productId) => {
    const form = new FormData();
    const productCategoryRequestLv2 = {
      product_category_group:
        categories[0]?.product_category_group_name?.toLowerCase() || "",
      sub_product_category_group:
        categories[1]?.product_category_group_name?.toLowerCase() || "",
      product_category_two_level: categories[0]?.options
        .map((option) => {
          const rows = tableData.filter((row) => row.first_category === option);

          if (rows.length === 0) return null;

          return {
            parent_product_category: option,
            child_product_categories: rows.map((row) => ({
              name: row.second_category,
              quantity: Number(row.quantity),
              price: parseInt(row.price),
            })),
          };
        })
        .filter(Boolean),
    };

    form.append(
      "multipleProductCategoryDTO",
      new Blob([JSON.stringify(productCategoryRequestLv2)], {
        type: "application/json",
      })
    );

    const filesArray = Object.values(imagesOption);

    for (let i = 0; i < filesArray.length; i++) {
      const croppedImageOption = await cropImage(filesArray[i].file, "1x1");
      form.append("files", croppedImageOption, `option_${i + 1}.jpg`);
    }

    try {
      const response = await addInfoProductsSellerLv2(productId, shopId, form);
      if (response.success) {
        return { success: true };
      }
      notifyWarning("Thêm thông tin bán hàng không thành công");
      return { success: false };
    } catch (error) {
      notifyError("Lỗi khi thêm thông tin bán hàng: " + error.message);
    }
  };

  const handleCreateProduct = async () => {
    // Validation checks
    const validationErrors = [];

    if (!infoProduct.name.trim()) {
      validationErrors.push("Tên sản phẩm không được để trống");
    }

    if (!infoProduct.description.trim()) {
      validationErrors.push("Mô tả sản phẩm không được để trống");
    }

    if (!infoProduct.subcategoryId) {
      validationErrors.push("Bạn chưa chọn ngành hàng");
    }

    // Image validation
    if (!imageThumbnail) {
      validationErrors.push("Vui lòng chọn ảnh bìa sản phẩm");
    }

    if (imagesProduct.length === 0) {
      validationErrors.push("Vui lòng chọn ít nhất một ảnh sản phẩm");
    }

    // Category and options validation
    if (categories.length === 0 || !categories[0].product_category_group_name) {
      validationErrors.push("Vui lòng nhập tên phân loại");
    }

    const hasCategoryError = categories.some((cat) => cat.error);
    if (hasCategoryError) {
      validationErrors.push("Vui lòng sửa lỗi trong phân loại hàng");
    }

    // Table data validation
    if (tableData.length > 0) {
      const isInvalid = tableData.some(
        ({ price, quantity }) =>
          !price ||
          !quantity ||
          isNaN(Number(price)) ||
          isNaN(Number(quantity)) ||
          Number(price) <= 0 ||
          Number(quantity) <= 0
      );

      if (isInvalid) {
        validationErrors.push(
          "Vui lòng nhập đầy đủ giá và số lượng hợp lệ cho tất cả danh mục"
        );
      }
    } else if (
      categories.some((cat) => cat.options.some((opt) => opt.trim() !== ""))
    ) {
      validationErrors.push("Bảng phân loại sản phẩm chưa được tạo");
    }

    // Shipping validation
    if (!shippingWeigth || Number(shippingWeigth) <= 0) {
      validationErrors.push("Vui lòng nhập cân nặng sản phẩm");
    }

    if (
      !shippingSize.width ||
      !shippingSize.height ||
      !shippingSize.high ||
      Number(shippingSize.width) <= 0 ||
      Number(shippingSize.height) <= 0 ||
      Number(shippingSize.high) <= 0
    ) {
      validationErrors.push("Vui lòng nhập đầy đủ kích thước đóng gói");
    }

    if (shipingTypeId.length === 0) {
      validationErrors.push("Vui lòng chọn ít nhất một loại vận chuyển");
    }

    // Display validation errors if any
    if (validationErrors.length > 0) {
      notifyWarning(validationErrors[0]); // Show first error
      return;
    }

    // Set loading state to disable form
    setLoading(true);

    // Create product
    const formData = new FormData();
    Object.keys(infoProduct).forEach((key) => {
      formData.append(key, infoProduct[key]);
    });

    try {
      // Process images
      const croppedThumbnail = await cropImage(imageThumbnail, ratio);
      formData.append("thumbnail", croppedThumbnail, "thumbnail.jpg");

      for (let i = 0; i < imagesProduct.length; i++) {
        const croppedImage = await cropImage(imagesProduct[i].file, ratio);
        formData.append("productImages", croppedImage, `product_${i + 1}.jpg`);
      }

      // Create product
      const response = await createProduct(shopId, formData);
      if (!response.success) {
        notifyError("Tạo sản phẩm thất bại: " + response.message);
        setLoading(false);
        return;
      }

      const productId = response.data.product_id;

      // Add attributes
      await handleAddAttribute(productId);

      // Add sales information based on category count
      let salesInfoSuccess = false;
      if (categories.length === 1) {
        const responseInfoSeller = await handleAddInfoProductsSellerLv1(
          productId
        );
        salesInfoSuccess = responseInfoSeller.success;
      } else {
        const responseInfoSeller = await handleAddInfoProductsSellerLv2(
          productId
        );
        salesInfoSuccess = responseInfoSeller.success;
      }

      if (salesInfoSuccess) {
        notifySuccess("Thêm thông tin bán hàng thành công");
      } else {
        notifyWarning("Thêm thông tin bán hàng không thành công");
      }

      // Add shipping information
      const responseInfoShiping = await handleAddProductShippingInfo(productId);
      if (responseInfoShiping.success) {
        notifySuccess("Thêm thông tin vận chuyển thành công");
      } else {
        notifyWarning("Thêm thông tin vận chuyển không thành công");
      }

      // Final success notification
      notifySuccess("Tạo sản phẩm thành công!");

      // Reset form data
      resetFormData();
    } catch (error) {
      notifyError(error.message || "Đã xảy ra lỗi khi tạo sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  // Add a reset form function to clean up after successful product creation
  const resetFormData = () => {
    setInfoProduct({ name: "", description: "", subcategoryId: "" });
    setImagesProduct([]);
    setImagesProductPreview([]);
    setImageThumbnail(null);
    setImageThumbnailPreview(null);
    setSelectedCategory(null);
    setSubcategoryAttributes([]);
    setAttributeProduct([]);
    setCategories([
      { product_category_group_name: "", options: [""], error: "" },
    ]);
    setTableData([]);
    setImagesOption({});
    setImagesOptionPreview({});
    setShippingWeigth("");
    setShipingSize({
      width: "",
      height: "",
      high: "",
    });
    setShippingFee([]);
    setShippingType((prev) =>
      prev.map((type) => ({
        ...type,
        priceAfterCaculate: 0,
      }))
    );
    setShippingTypeId([]);
    setToggleButtonShiping({});
  };

  const handleCategoryChange = (index, value) => {
    setCategories((prevCategories) => {
      const newCategories = [...prevCategories];
      newCategories[index].product_category_group_name = value;

      const duplicate = newCategories.some(
        (cat, i) =>
          cat.product_category_group_name === value &&
          i !== index &&
          value !== ""
      );

      newCategories[index].error = duplicate
        ? "Các phân loại hàng phải khác nhau"
        : "";

      return newCategories;
    });

    generateTable();
  };

  const handleAddCategory = () => {
    setCategories((prevCategories) => {
      if (prevCategories.length < 2) {
        return [
          ...prevCategories,
          { product_category_group_name: "", options: [""], error: "" },
        ];
      }
      return prevCategories;
    });

    generateTable();
  };

  const handleOptionChange = (catIndex, optIndex, value) => {
    setCategories((prevCategories) => {
      const newCategories = [...prevCategories];
      const options = newCategories[catIndex].options;

      const isDuplicate = options.some(
        (opt, i) => opt === value && i !== optIndex && value !== ""
      );

      if (isDuplicate) {
        newCategories[catIndex].error = "Tùy chọn không được trùng!";
      } else {
        newCategories[catIndex].error = "";
        newCategories[catIndex].options[optIndex] = value;
      }

      return newCategories;
    });

    generateTable();
  };
  const handleAddOption = (catIndex) => {
    setCategories((prevCategories) => {
      const newCategories = [...prevCategories];
      newCategories[catIndex].options = [
        ...newCategories[catIndex].options,
        "",
      ];
      return newCategories;
    });

    generateTable();
  };

  const handleRemoveOption = (catIndex, optIndex) => {
    setCategories((prevCategories) => {
      const newCategories = [...prevCategories];

      if (newCategories[catIndex].options.length > 1) {
        newCategories[catIndex].options = newCategories[
          catIndex
        ].options.filter((_, i) => i !== optIndex);
      }

      return newCategories;
    });

    generateTable();
  };
  const generateTable = () => {
    setCategories((newCategories) => {
      if (!newCategories[0]?.product_category_group_name) return newCategories;

      const category1 = newCategories[0];
      const category2 = newCategories[1] || null;

      const category1Options = category1.options.filter(
        (opt) => opt.trim() !== ""
      );
      const category2Options = category2
        ? category2.options.filter((opt) => opt.trim() !== "")
        : [];

      if (category1Options.length === 0) {
        setTableData([]);
        return newCategories;
      }

      const rows = [];

      category1Options.forEach((opt1) => {
        if (category2 && category2Options.length > 0) {
          category2Options.forEach((opt2) => {
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
      return newCategories;
    });
  };

  const handlePriceChange = (index, value) => {
    const numericValue = Number(value.replace(/\./g, ""));
    setTableData((prevTable) => {
      const updatedTable = [...prevTable];
      updatedTable[index].price = numericValue;
      return updatedTable;
    });
  };

  const handleQuantityChange = (index, value) => {
    setTableData((prevTable) => {
      const updatedTable = [...prevTable];
      updatedTable[index].quantity = value;
      return updatedTable;
    });
  };

  const handleImageChange = (event, category) => {
    if (loading) return;
    const file = event.target.files[0];
    if (!file) return;

    const newImage = {
      id: crypto.randomUUID(),
      file,
      src: URL.createObjectURL(file),
    };

    setImagesOptionPreview((prev) => ({
      ...prev,
      [category]: newImage.src,
    }));

    setImagesOption((prev) => ({
      ...prev,
      [category]: newImage,
    }));
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

  const handleRemoveCategory = (catIndex) => {
    setCategories((prevCategories) => {
      const newCategories = prevCategories.filter(
        (_, index) => index !== catIndex
      );

      if (newCategories.length < 2) {
        setTableData([]);
      }

      return newCategories;
    });
  };

  useEffect(() => {
    if (categories.length > 0) {
      generateTable(categories);
    }
  }, [categories]);
  return (
    <div className="w-full flex flex-col">
      <ContainerModeLayer1>
        <div className="w-full flex flex-col  px-[20px] py-[12px] border-b-[1px] border-dashed ">
          <div className="flex items-center  font-nunito gap-[10px] pb-[10px]">
            <div
              className={`w-[50px] h-[50px] min-w-[50px] flex items-center justify-center rounded-full border-[1px] text-[1.4rem] z-10 ${
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
          <div className="w-full  flex mb:flex-col items-center gap-[10px] px-[20px] py-[20px]">
            <div className="pc:w-2/12 w-full flex items-center font-nunito text-[0.9rem] ">
              <span>Hình ảnh sản phẩm</span>
            </div>
            <div className="pc:w-10/12  w-full ">
              <div className="flex gap-4 mb-3 font-nunito pb-[20px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-[0.85rem] ">Hình ảnh tỷ lệ 1x1</span>
                  <input
                    disabled={loading}
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
                    disabled={loading}
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
                    <button
                      disabled={loading}
                      className={`absolute group-hover:flex  hidden items-center justify-center top-[5%] right-[5%] px-[8px] py-[8px] rounded-full cursor-pointer ${
                        isDarkMode
                          ? "bg-light-200 text-dark-100"
                          : "bg-dark-400 text-light-100"
                      }`}
                      onClick={() => handleRemoveImageProduct(img.id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
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
                        disabled={loading}
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
          <div className="w-full  flex mb:flex-col items-center  gap-[10px]  px-[20px] py-[20px]">
            <div className="pc:w-2/12 w-full flex items-center font-nunito text-[0.9rem] ">
              <span>Thêm Ảnh bìa</span>
            </div>
            <div className="pc:w-10/12  w-full flex mb:flex-col items-center gap-4 ">
              {imageThumbnailPreview ? (
                imageThumbnailPreview && (
                  <div className="w-[100px] h-[100px] aspect-square rounded-[5px] relative group">
                    <img
                      src={imageThumbnailPreview}
                      alt="Uploaded"
                      className="w-full  h-full aspect-square rounded-[5px] object-cover"
                    />
                    <buton
                      disabled={loading}
                      className={`absolute group-hover:flex  hidden items-center justify-center top-[5%] right-[5%] px-[8px] py-[8px] rounded-full cursor-pointer ${
                        isDarkMode
                          ? "bg-light-200 text-dark-100"
                          : "bg-dark-400 text-light-100"
                      }`}
                      onClick={handleRemoveImageThumbnail}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </buton>
                  </div>
                )
              ) : (
                <div className="w-full">
                  <label
                    className={`flex flex-col w-[100px] h-[100px] aspect-square items-center justify-center border border-dashed rounded-lg cursor-pointer text-gray-600`}
                  >
                    <i className="fa-solid fa-image text-2xl"></i>
                    <span className="text-[0.7rem] text-center">
                      Thêm hình ảnh
                    </span>
                    <input
                      disabled={loading}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageThumbnailChange}
                    />
                  </label>
                </div>
              )}

              <div className="font-nunito text-[0.8rem]">
                Tải lên hình ảnh 1:1. Ảnh bìa sẽ được hiển thị tại các trang Kết
                quả tìm kiếm, Gợi ý hôm nay,... Việc sử dụng ảnh bìa đẹp sẽ thu
                hút thêm lượt truy cập vào sản phẩm của bạn
              </div>
            </div>
          </div>
          <div className="w-full  flex mb:flex-col items-center  gap-[10px]  px-[20px] py-[20px]">
            <div className="pc:w-2/12  w-full  flex items-center font-nunito text-[0.9rem] ">
              <span>Tên sản phẩm</span>
            </div>
            <div className="pc:w-10/12  w-full  flex items-center  gap-[10px]   ">
              <div
                className={`w-full h-[42px] flex items-center gap-[5px] pr-[5px] rounded-[5px] ${
                  isDarkMode ? "border-[1px]" : "bg-dark-400 "
                }`}
              >
                <input
                  className="w-full bg-transparent outline-none text-[0.8rem] px-[10px] "
                  type="text"
                  disabled={loading}
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
          <div className="w-full flex mb:flex-col gap-[10px] px-[20px] py-[20px]">
            <div className="pc:w-2/12  w-full flex  font-nunito text-[0.9rem] ">
              <span>Mô tả sản phẩm</span>
            </div>
            <div className="pc:w-10/12 w-full flex items-center  gap-[10px] ">
              <div
                className={`w-full h-[290px] flex  gap-[5px] pr-[5px] rounded-[5px] ${
                  isDarkMode ? "border-[1px]" : "bg-dark-400 "
                }`}
              >
                <textarea
                  disabled={loading}
                  className="w-full h-full min-h-full max-h-full  bg-transparent outline-none text-[0.8rem] p-[10px]"
                  type="text"
                  value={infoProduct.description}
                  maxLength={2000}
                  name="description"
                  placeholder="Nhập mô tả sản phẩm"
                  onChange={handleInfoChange}
                />
                <div className="text-[0.8rem] w-[50px] flex justify-end py-[10px]">
                  <span> {infoProduct.description.length}/2000</span>
                </div>
              </div>
            </div>
          </div>
          <button
            disabled={loading}
            className="w-full  flex  mb:flex-col items-center gap-[10px] px-[20px] py-[20px]"
          >
            <div className="pc:w-2/12 w-full flex items-center font-nunito text-[0.9rem] ">
              <span>Chọn nghành hàng</span>
            </div>
            <div className="pc:w-10/12  w-full  flex items-center  ">
              <div
                className={`w-full flex items-center  h-[42px] rounded-[5px] cursor-pointer ${
                  isDarkMode ? "border-[1px]" : "bg-dark-400"
                }`}
                onClick={() => setIsModalOpen(true)}
              >
                <div className="w-full flex px-[10px] font-nunito text-[0.9rem] truncate">
                  {selectedCategory && <p>{selectedCategory.name}</p>}
                </div>
                <div className="flex items-center justify-center text-[0.8rem] w-[50px] cursor-pointer border-l-[1px] h-full">
                  <i className="fa-solid fa-pen-to-square"></i>
                </div>
              </div>
            </div>
          </button>
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
                        disabled={loading}
                        className="w-full  py-[8px] px-[8px]  rounded text-[0.85rem] outline-none bg-transparent"
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
          <div className="w-full px-[20px] pt-[20px] pb-[10px] font-nunito text-[1.2rem] font-bold">
            <h1>Thông tin bán hàng</h1>
          </div>
          <div className="w-full p-4">
            {categories.map((category, catIndex) => (
              <div
                key={catIndex}
                className={`mb-4 p-4  rounded-[5px] ${
                  isDarkMode ? "border-[1px]" : "bg-dark-300"
                }`}
              >
                <div className="w-full flex items-center justify-between">
                  <label className="block font-nunito font-semibold text-[0.9rem]">
                    Phân loại {catIndex + 1}
                  </label>
                </div>
                <div className="w-full flex items-center">
                  <div
                    className={`w-full flex items-center  rounded-[5px]  px-[10px] ${
                      isDarkMode ? "border-[1px]" : "bg-dark-400"
                    }  `}
                  >
                    <input
                      type="text"
                      disabled={loading}
                      value={category.product_category_group_name}
                      placeholder={`Nhập phân loại ${catIndex + 1}`}
                      onChange={(e) =>
                        handleCategoryChange(catIndex, e.target.value)
                      }
                      className="w-full py-[10px] px-[5px] bg-transparent outline-none text-[0.85rem]"
                      maxLength={14}
                    />
                    <p className="text-sm text-gray-500 text-right">
                      {category.product_category_group_name.length}/14
                    </p>
                  </div>
                  {categories.length > 1 && (
                    <button
                      disabled={loading}
                      onClick={() => handleRemoveCategory(catIndex)}
                      className="ml-2 p-1 text-red-500 hover:text-red-700"
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  )}
                </div>
                {category.error && (
                  <p className="text-red-500 text-[0.8rem]">{category.error}</p>
                )}
                <div className="w-full flex items-center justify-between py-[10px]">
                  <h3 className=" font-nunito font-semibold text-[0.9rem]">
                    Tùy chọn
                  </h3>
                </div>
                <div className="w-full flex flex-wrap ">
                  {category.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className="w-6/12 flex items-center gap-2 pr-[10px] mt-[10px]"
                    >
                      <div
                        className={`w-full flex items-center  rounded-[5px]  px-[10px] ${
                          isDarkMode ? "border-[1px]" : "bg-dark-400"
                        }  ${category.error ? "border-red-500" : ""}`}
                      >
                        <input
                          type="text"
                          disabled={loading}
                          value={option}
                          placeholder={`Nhập tùy chọn ${optIndex + 1}`}
                          onChange={(e) =>
                            handleOptionChange(
                              catIndex,
                              optIndex,
                              e.target.value
                            )
                          }
                          className={`w-full py-[8px]  text-[0.9rem] outline-none bg-transparent`}
                          maxLength={20}
                        />
                        <p
                          className={`text-[0.8rem]  ${
                            isDarkMode ? " text-dark-300" : "text-dark-600"
                          }`}
                        >
                          {option.length}/20
                        </p>
                      </div>
                      {category.options.length > 1 && (
                        <button
                          disabled={loading}
                          onClick={() => handleRemoveOption(catIndex, optIndex)}
                          className=" text-red-500 flex items-center justify-center p-[5px] hover:text-red-700 cursor-pointer"
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="w-full flex items-center mt-[20px]">
                    <button
                      disabled={loading}
                      onClick={() => handleAddOption(catIndex)}
                      className={`px-[20px]  py-[5px] rounded-[5px] flex items-center justify-center   ${
                        isDarkMode ? "border-[1px]" : "bg-dark-200"
                      }`}
                    >
                      <div className="flex items-center gap-[10px] ">
                        <span className="text-[0.9rem] font-nunito">
                          Thêm tùy chọn
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {categories.length < 2 && (
              <button
                disabled={loading}
                onClick={handleAddCategory}
                className=" px-[10px] py-[5px] font-nunito text-[0.9rem] bg-blue-600 text-white rounded-md cursor-pointer"
              >
                Thêm Phân Loại
              </button>
            )}

            {tableData.length > 0 && (
              <div className="mt-6 ">
                <h3 className="text-lg font-semibold mb-2">Bảng phân loại</h3>
                <table className="w-full border-collapse border rounded-[5px] border-gray-300 ">
                  <thead>
                    <tr
                      className={` ${
                        isDarkMode ? "bg-dark-900" : "bg-dark-400 "
                      }`}
                    >
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
                              <div className="flex flex-col justify-center items-center relative">
                                <label className="cursor-pointer relative z-10">
                                  <input
                                    disabled={loading}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleImageChange(e, row.first_category)
                                    }
                                  />
                                  <div className="w-[60px] h-[60px] border-[1px] rounded-[5px] flex items-center justify-center text-[1.2rem] cursor-pointer">
                                    {imagesOptionPreview[row.first_category] ? (
                                      <img
                                        src={
                                          imagesOptionPreview[
                                            row.first_category
                                          ]
                                        }
                                        alt="preview"
                                        className="w-full h-full object-cover rounded-[5px]"
                                      />
                                    ) : (
                                      <i className="fa-solid fa-image"></i>
                                    )}
                                  </div>
                                </label>

                                {imagesOptionPreview[row.first_category] && (
                                  <button
                                    disabled={loading}
                                    className="absolute top-0 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center z-20 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveImageOption(
                                        row.first_category
                                      );
                                    }}
                                  >
                                    ✕
                                  </button>
                                )}

                                <p className="font-nunito font-normal text-[0.85rem] py-[2px]">
                                  {row.first_category}
                                </p>
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
                            <div
                              className={`w-full flex rounded-[5px] ${
                                isDarkMode ? "border-[1px] " : "bg-dark-400"
                              }`}
                            >
                              <input
                                disabled={loading}
                                type="number"
                                min="0"
                                value={row.price}
                                placeholder="Nhập giá của tùy chọn này"
                                onChange={(e) =>
                                  handlePriceChange(index, e.target.value)
                                }
                                className="w-full px-[5px] py-[5px] text-[0.9rem] bg-transparent outline-none"
                              />
                            </div>
                          </td>
                          {/* Ô nhập kho hàng */}
                          <td className="border border-gray-300 p-2 text-center">
                            <div
                              className={`w-full flex rounded-[5px] ${
                                isDarkMode ? "border-[1px] " : "bg-dark-400"
                              }`}
                            >
                              <input
                                disabled={loading}
                                type="number"
                                min="0"
                                value={row.quantity}
                                placeholder="Nhập số lượng hàng tùy chọn này có"
                                onChange={(e) =>
                                  handleQuantityChange(index, e.target.value)
                                }
                                className="w-full px-[5px] py-[5px] text-[0.9rem] bg-transparent outline-none"
                              />
                            </div>
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
          <div className="w-full flex flex-col justify-end py-[20px] px-[20px]">
            <div className="w-full text-[1.2rem] font-nunito font-bold pb-[10px]">
              <h1>Thông tin vận chuyển</h1>
            </div>
            <div className="w-full flex flex-col py-[20px] font-nunito">
              <div className="font-bold pb-[10px]">
                <span>Cân nặng ( sau khi đóng gói )</span>
              </div>
              <div className="pc:w-4/12 w-full pr-[10px]">
                <div
                  className={`w-full flex items-center gap-[5px]   rounded-[5px] ${
                    isDarkMode ? "border-[1px]" : "bg-dark-400"
                  }`}
                >
                  <input
                    className="w-full border-none outline-none bg-transparent pl-[10px] py-[8px] text-[0.8rem]"
                    type="text"
                    inputMode="numeric"
                    placeholder="Cân nặng"
                    value={shippingWeigth}
                    disabled={loading}
                    onChange={handleChangeShippingWeigth}
                  />
                  <div className="flex items-center justify-center border-l-[1px] px-[15px] ">
                    <span>g</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col py-[20px] mb-[20px] font-nunito">
              <div className="font-bold pb-[10px]">
                <span>
                  Kích thước đóng gói (Phí vận chuyển thực tế sẽ thay đổi nếu
                  bạn nhập sai kích thước)
                </span>
              </div>
              <div className="w-full flex items-center flex-wrap ">
                <div className="pc:w-3/12 w-full min-w-[300px] mr-[10px] mt-[10px]">
                  <div
                    className={`w-full flex items-center gap-[5px]   rounded-[5px] ${
                      isDarkMode ? "border-[1px]" : "bg-dark-400"
                    }`}
                  >
                    <input
                      className="w-full border-none outline-none bg-transparent pl-[10px] py-[8px] text-[0.8rem]"
                      type="text"
                      inputMode="numeric"
                      value={shippingSize.width}
                      disabled={loading}
                      name="width"
                      placeholder="Chiều rộng"
                      onChange={handleChangeShippingSize}
                    />
                    <div className="flex items-center justify-center border-l-[1px] px-[15px] ">
                      <span>cm</span>
                    </div>
                  </div>
                </div>
                <div className="w-[20px] h-[20px] flex items-center justify-center mt-[10px] pr-[10px]">
                  <i className="fa-solid fa-xmark"></i>
                </div>
                <div className="pc:w-3/12 w-full min-w-[300px] mr-[10px] mt-[10px]">
                  <div
                    className={`w-full flex items-center gap-[5px]   rounded-[5px] ${
                      isDarkMode ? "border-[1px]" : "bg-dark-400"
                    }`}
                  >
                    <input
                      className="w-full border-none outline-none bg-transparent pl-[10px] py-[8px] text-[0.8rem]"
                      type="text"
                      inputMode="numeric"
                      disabled={loading}
                      value={shippingSize.height}
                      name="height"
                      placeholder="Chiều dài"
                      onChange={handleChangeShippingSize}
                    />
                    <div className="flex items-center justify-center border-l-[1px] px-[15px] ">
                      <span>cm</span>
                    </div>
                  </div>
                </div>
                <div className="w-[20px] h-[20px] flex items-center justify-center mt-[10px] pr-[10px]">
                  <i className="fa-solid fa-xmark"></i>
                </div>
                <div className="pc:w-3/12 w-full min-w-[300px]  mr-[10px] mt-[10px]">
                  <div
                    className={`w-full flex items-center gap-[5px]   rounded-[5px] ${
                      isDarkMode ? "border-[1px]" : "bg-dark-400"
                    }`}
                  >
                    <input
                      disabled={loading}
                      className="w-full border-none outline-none bg-transparent pl-[10px] py-[8px] text-[0.8rem]"
                      type="number"
                      min={0}
                      value={shippingSize.high}
                      name="high"
                      placeholder="Chiều cao"
                      onChange={handleChangeShippingSize}
                    />
                    <div className="flex items-center justify-center border-l-[1px] px-[15px] ">
                      <span>cm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-[10px]">
              <div className="w-full font-bold ">
                <h1>Phí vận chuyển</h1>
              </div>
              {shippingType?.map((type) => {
                const isToggled = toggleButtonShiping[type.id];
                return (
                  <div
                    key={type.id}
                    className={`w-full flex mb:flex-col items-center gap-[5px] px-[10px] py-[10px] font-nunito  rounded-[5px] ${
                      isDarkMode ? "border-[1px]" : "bg-dark-400"
                    }`}
                  >
                    <div className="w-full flex mb:flex-col  gap-[10px] text-[0.9rem] px-[10px]">
                      <div className="w-2/12 mb:w-full font-bold truncate">
                        {type.name}
                      </div>
                      <div className="w-10/12 mb:w-full text-dark-800 truncate">
                        {type.description}
                      </div>
                    </div>
                    <div className="w-full flex">
                      <div className="px-[10px] font-bold text-red-500 truncate">
                        {type.priceAfterCaculate.toLocaleString("vi-VN")}đ
                      </div>
                      <div
                        onClick={() => toggleButtonShippingChange(type)}
                        className={`w-[38px] h-[22px] min-w-[38px] flex items-center  rounded-full px-[4px] py-[2px] cursor-pointer transition-all relative  ${
                          isToggled
                            ? "bg-green-500 text-white"
                            : "bg-dark-700 text-dark-900"
                        } shadow-md transition-all duration-300 ease}`}
                      >
                        <div
                          className={`w-[16px] h-[16px]  text-[0.6rem]  rounded-full flex items-center justify-center shadow-md absolute transition-transform duration-300 ${
                            isToggled
                              ? "bg-green-200 translate-x-[16px]"
                              : "bg-dark-200 translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ContainerModeLayer1>
      </div>
      <div className="w-full mt-[20px]">
        <ContainerModeLayer1>
          <div className="w-full flex justify-end py-[20px] px-[20px]">
            <button
              disabled={loading}
              className={`py-[5px] px-[20px] rounded-[5px] flex items-center gap-2 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary text-light-100"
              }`}
              onClick={handleCreateProduct}
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
