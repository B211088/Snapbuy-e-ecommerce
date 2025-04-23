import { useState, useEffect } from "react";
import { useTheme } from "../../../Provider/ThemeProvider";
import { useShop } from "../../../contexts/User/ShopContext";
import { useAppData } from "../../../contexts/client/AppDataContext";
import { useConfirm } from "../../Notify/ConfirmModal";
import { useNotify } from "../../Notify/NotifyModal";

const ListAllProduct = () => {
  const { isDarkMode } = useTheme();
  const {
    categoriesState: { categories },
    getProductDetail,
  } = useAppData();
  const {
    shopState: { shopInfo },
    getAllProducts,
  } = useShop();
  const { confirm, ConfirmComponent } = useConfirm();
  const { notifySuccess, notifyWarning } = useNotify();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetail, setProductDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  console.log({ products });

  // Fetch product details when a product is selected
  useEffect(() => {
    if (selectedProduct) {
      fetchProductDetail(selectedProduct);
    }
  }, [selectedProduct]);

  const fetchProducts = async () => {
    if (!shopInfo || !shopInfo.id) return;

    setLoading(true);
    try {
      const result = await getAllProducts(shopInfo.id);
      if (result.success) {
        const transformedProducts = result.data.map((item) => ({
          id: item.product_basic_info.product_id,
          name: item.product_basic_info.name,
          thumbnail: item.product_basic_info.thumbnail?.avatar_url,
          remaining: calculateTotalQuantity(
            item.product_category_responses?.product_category_two_level
          ),
          price: findLowestPrice(
            item.product_category_responses?.product_category_two_level
          ),
          totalSales: 0,
          rating: 0,
          status: "LIVE",
          categoryId:
            item.product_basic_info.subcategory_id?.category_response?.id,
          subcategoryId: item.product_basic_info.subcategory_id?.id,
        }));

        setProducts(transformedProducts);
      } else {
        console.error("Failed to fetch products:", result.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetail = async (productId) => {
    setDetailLoading(true);
    try {
      const result = await getProductDetail(productId);
      if (result.success) {
        setProductDetail(result.data);
      } else {
        console.error("Failed to fetch product detail:", result.message);
      }
    } catch (error) {
      console.error("Error fetching product detail:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDeletedProduct = async (e) => {
    e.stopPropagation();
    confirm({
      message: "Bạn có chắc chắn muốn xóa sản phẩm này không",
      onConfirm: async () => {
        notifySuccess("Xóa sản phẩm thành công");
      },
      onCancel: () => {
        return;
      },
    });
  };

  const calculateTotalQuantity = (productCategories) => {
    if (!productCategories) return 0;

    let total = 0;
    productCategories.forEach((category) => {
      category.child_product_category_responses.forEach((child) => {
        total += child.quantity;
      });
    });

    return total;
  };

  const findLowestPrice = (productCategories) => {
    if (!productCategories) return 0;

    let lowestPrice = Infinity;
    productCategories.forEach((category) => {
      category.child_product_category_responses.forEach((child) => {
        if (child.price < lowestPrice) {
          lowestPrice = child.price;
        }
      });
    });

    return lowestPrice === Infinity ? 0 : lowestPrice;
  };

  // Filter products based on category and search term
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.categoryId.toString() === selectedCategory
      : true;
    const matchesSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
  });

  // Close product detail modal
  const closeModal = () => {
    setSelectedProduct(null);
    setProductDetail(null);
  };

  return (
    <div className="w-full flex flex-col px-[20px]">
      <ConfirmComponent />
      <div className="w-full flex gap-[10px] py-[10px]">
        <div className="w-8/12 flex items-center gap-[10px] text-[0.9rem]">
          <div className="w-3/12 border-[1px] rounded-[5px] px-[5px] py-[5px] ">
            <select
              className="w-full bg-transparent outline-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Nghành hàng</option>
              {categories ? (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option value="">Nghành hàng</option>
              )}
            </select>
          </div>
          <div className="w-3/12 border-[1px] rounded-[5px] px-[5px] py-[5px] ">
            <select
              className="w-full bg-transparent outline-none"
              name=""
              id=""
            >
              <option value="">Loại sản phẩm</option>
            </select>
          </div>
          <div className="w-2/12 flex items-center gap-[5px] font-nunito font-bold text-[0.9rem] truncate">
            <span>{filteredProducts.length}</span> <span>Sản phẩm</span>
          </div>
        </div>

        <div className="w-4/12 border-[1px] rounded-[5px] px-[5px] py-[5px] ">
          <input
            className="flex-1 outline-none border-none bg-transparent text-[0.9rem] "
            type="text"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div
        className={`w-full flex flex-col font-nunito rounded-[5px] ${
          isDarkMode ? "border-[1px]" : " bg-dark-400"
        }`}
      >
        <div
          className={`w-full flex items-center gap-[10px] text-[0.9rem] px-[20px] py-[10px] font-bold rounded-t-[5px] ${
            isDarkMode ? "bg-dark-800 " : "bg-dark-500"
          }`}
        >
          <div className="w-[20px] h-[20px] flex items-center justify-center">
            <input type="checkbox" />
          </div>
          <div className="w-4/12 flex items-center">
            <span>Tên sản phẩm</span>
          </div>
          <div className="w-1/12 flex items-center">
            <span>Doanh số</span>
          </div>
          <div className="w-2/12 flex items-center">
            <span>Giá</span>
          </div>
          <div className="w-2/12 flex items-center">
            <span>Còn lại</span>
          </div>
          <div className="w-2/12 flex items-center">
            <span>Số đánh giá</span>
          </div>
          <div className="w-1/12 flex items-center ">
            <span>Hành động</span>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center">Đang tải...</div>
        ) : (
          <ul
            style={{ height: "calc(100dvh - 350px)" }}
            className="w-full flex flex-col gap-[10px] px-[10px] p-[10px] overflow-y-auto overflow-x-hidden scrollbar-custom"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <li
                  key={item.id}
                  className={`w-full flex items-center gap-[10px] text-[0.8rem] px-[10px] py-[10px] rounded-[5px] cursor-pointer hover:opacity-80 ${
                    isDarkMode ? " border-[1px] " : "bg-dark-300"
                  }`}
                  onClick={() => setSelectedProduct(item.id)}
                >
                  <div className="w-[20px] h-[20px] flex items-center justify-center">
                    <input
                      type="checkbox"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="w-4/12 flex items-center gap-2">
                    {item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                    )}
                    <span className="truncate">{item.name}</span>
                  </div>
                  <div className="w-1/12 flex items-center">
                    <span>{item.totalSales}</span>
                  </div>
                  <div className="w-2/12 flex items-center">
                    <span>{item.price.toLocaleString("vi-VN") + "đ"}</span>
                  </div>
                  <div className="w-2/12 flex items-center">
                    <span>{item.remaining}</span>
                  </div>
                  <div className="w-2/12 flex items-center">
                    <span>{item.rating}</span>
                  </div>
                  <div
                    className="w-1/12 flex items-center justify-end"
                    onClick={handleDeletedProduct}
                  >
                    <div
                      className={`w-full rounded-[5px] font-bold text-green-600 flex items-center justify-center`}
                    >
                      <span>Đang bán</span>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className="py-8 text-center">Không có sản phẩm nào</div>
            )}
          </ul>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-[#0002]  bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-3xl  rounded-[5px]  shadow-xl  ${
              isDarkMode
                ? "bg-light-100 text-dark-100"
                : "bg-dark-400 text-light-100"
            }`}
          >
            {/* Close Button */}
            <div className="w-full flex items-center justify-end py-[10px] px-[10px]">
              <button
                className="w-[30px] h-[30px] flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition z-10"
                onClick={closeModal}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="w-full max-h-[85vh] flex flex-col overflow-auto scrollbar-custom py-[10px] pl-[20px] pr-[10px]">
              {" "}
              {detailLoading ? (
                <div className="w-full h-96 flex items-center justify-center">
                  <div className="text-lg font-medium">Đang tải...</div>
                </div>
              ) : productDetail ? (
                <div className="space-y-6">
                  {/* Product Name */}
                  <h2 className="text-2xl font-bold">
                    {productDetail.product_basic_info.name}
                  </h2>

                  {/* Thumbnail */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Ảnh Bìa:</h3>
                    <div className="w-40 h-40 rounded-lg overflow-hidden border">
                      <img
                        src={
                          productDetail.product_basic_info.thumbnail?.avatar_url
                        }
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>{" "}
                    <div className="w-40 text-dark-100 px-[20px] py-[5px] border-dashed border mt-[5px] rounded-[5px] flex items-center justify-center ">
                      <span> Thay đổi</span>
                    </div>
                  </div>

                  {/* Product Images */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Ảnh sản phẩm:</h3>
                    <div className="flex gap-2 overflow-x-auto py-1">
                      {productDetail.product_images?.map((image, index) => (
                        <div
                          key={index}
                          className="w-24 h-24 rounded-md overflow-hidden border flex-shrink-0"
                        >
                          <img
                            src={image.avatar_url}
                            alt={`Ảnh ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>{" "}
                    <div className="w-40 text-dark-100 px-[20px] py-[5px] border-dashed border mt-[5px] rounded-[5px] flex items-center justify-center ">
                      <span> Thay đổi</span>
                    </div>
                  </div>

                  {/* Danh mục */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Danh mục:</h3>
                    <div className="text-sm text-gray-600">
                      {
                        productDetail.product_basic_info.subcategory_id
                          ?.category_response?.name
                      }
                      {" > "}
                      {productDetail.product_basic_info.subcategory_id?.name}
                    </div>{" "}
                    <div className="w-40 text-dark-100 px-[20px] py-[5px] border-dashed border mt-[5px] rounded-[5px] flex items-center justify-center ">
                      <span> Thay đổi</span>
                    </div>
                  </div>

                  {/* Biến thể chính */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Phân loại chính:</h3>
                    <div className="flex flex-wrap gap-2">
                      {productDetail.product_category_responses?.product_category_two_level?.map(
                        (variant) => (
                          <div
                            key={variant.product_category_response.id}
                            className="px-3 py-2 border rounded-md flex items-center gap-2"
                          >
                            <img
                              src={variant.product_category_response.image_url}
                              alt={variant.product_category_response.name}
                              className="w-5 h-5 rounded-full"
                            />
                            <span>
                              {variant.product_category_response.name}
                            </span>
                          </div>
                        )
                      )}
                    </div>{" "}
                    <div className="w-40 text-dark-100 px-[20px] py-[5px] border-dashed border mt-[5px] rounded-[5px] flex items-center justify-center ">
                      <span> Thay đổi</span>
                    </div>
                  </div>

                  {/* Biến thể phụ */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Phân loại phụ:</h3>
                    <div className="flex flex-wrap gap-2">
                      {productDetail.product_category_responses?.product_category_two_level?.[0]?.child_product_category_responses.map(
                        (storage) => (
                          <div
                            key={storage.id}
                            className="px-3 py-2 border rounded-md text-sm"
                          >
                            <div>{storage.name}</div>
                            <div className="font-semibold text-red-500">
                              {storage.price.toLocaleString("vi-VN")}đ
                            </div>
                          </div>
                        )
                      )}
                    </div>{" "}
                    <div className="w-40 text-dark-100 px-[20px] py-[5px] border-dashed border mt-[5px] rounded-[5px] flex items-center justify-center ">
                      <span> Thay đổi</span>
                    </div>
                  </div>

                  {/* Thông số kỹ thuật */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Thuộc tính sản phẩm</h3>
                    <div className="space-y-1 text-sm flex flex-col gap-[10px]">
                      {productDetail.product_attribute_value_responses?.map(
                        (attr) => (
                          <div
                            key={attr.product_attribute_value_id}
                            className="flex gap-2"
                          >
                            <div className="w-1/3 font-medium">
                              {attr.attribute_name}:
                            </div>
                            <div className="w-2/3">{attr.value}</div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Phương thức vận chuyển */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">
                      Phương thức vận chuyển:
                    </h3>
                    <div className="space-y-2 text-sm">
                      {productDetail.product_shipping_type_responses?.map(
                        (shipping) => (
                          <div
                            key={shipping.id}
                            className="flex justify-between border-b pb-1"
                          >
                            <div>
                              <div className="font-medium">{shipping.name}</div>
                              <div className="text-gray-500">
                                {shipping.description}
                              </div>
                            </div>
                            <div className="font-semibold text-red-500">
                              {shipping.price.toLocaleString("vi-VN")}đ
                            </div>
                          </div>
                        )
                      )}
                    </div>{" "}
                    <div className="w-40 text-dark-100 px-[20px] py-[5px] border-dashed border mt-[5px] rounded-[5px] flex items-center justify-center ">
                      <span> Thay đổi</span>
                    </div>
                  </div>

                  {/* Mô tả sản phẩm */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Mô tả sản phẩm:</h3>
                    <div className="whitespace-pre-line text-sm leading-relaxed">
                      {productDetail.product_basic_info.description}
                    </div>{" "}
                    <div className="w-40 text-dark-100 px-[20px] py-[5px] border-dashed border mt-[5px] rounded-[5px] flex items-center justify-center ">
                      <span> Thay đổi</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-96 flex items-center justify-center">
                  <div className="text-lg">
                    Không tìm thấy thông tin sản phẩm
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListAllProduct;
