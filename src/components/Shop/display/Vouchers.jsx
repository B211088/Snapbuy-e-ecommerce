import React, { useState, useEffect } from "react";
import OutLetContainer from "../../../views/client/layout/OutLetContainer";
import { useShop } from "../../../contexts/User/ShopContext";
import { useTheme } from "../../../Provider/ThemeProvider";
import { useConfirm } from "../../Notify/ConfirmModal";

const Vouchers = () => {
  const {
    shopState: { shopInfo, vouchers },
    loadShopInfo,
    getVouchersByShop,
    addVoucher,
    updateVoucher,
    deleteVoucher,
  } = useShop();

  const { isDarkMode } = useTheme();
  const { confirm, ConfirmComponent } = useConfirm();
  const [loading, setLoading] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [shopId, setShopId] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    discount_value: "",
    start_date: "",
    end_date: "",
    minimum_order_value: "",
  });

  useEffect(() => {
    setShopId(shopInfo?.id);
  }, []);

  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const response = await loadShopInfo();
        if (response.success) {
          await getVouchersByShop(response.data.id);
        }
      } catch (error) {
        console.error("Failed to load vouchers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVoucher();
  }, [shopId]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.toISOString().split("T")[0]}T${date
      .toTimeString()
      .split(" ")[0]
      .substring(0, 5)}`;
  };

  const handleAddNew = () => {
    setSelectedVoucher(null);
    setFormData({
      description: "",
      discount_value: "",
      start_date: "",
      end_date: "",
      minimum_order_value: "",
    });
    setShowForm(true);
  };

  const handleEdit = (voucher) => {
    setSelectedVoucher(voucher);
    setFormData({
      code: voucher.code || "",
      description: voucher.description || "",
      discount_value: voucher.discount_percent || "",
      start_date: formatDateTime(voucher.start_date),
      end_date: formatDateTime(voucher.end_date),
      minimum_order_value: voucher.minimum_order_value || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (voucherId) => {
    confirm({
      message: "Bạn có thật sự muốn xóa voucher này?",
      onConfirm: async () => {
        try {
          await deleteVoucher(shopInfo?.id, voucherId);
        } catch (error) {
          console.error("Failed to delete voucher:", error);
        }
      },
      onCancel: () => {
        return;
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedVoucher) {
        const updateData = {
          shop_id: shopInfo.id,
          voucher_id: selectedVoucher.id || selectedVoucher._id,
          code: formData.code,
          description: formData.description,
          discount_value: parseFloat(formData.discount_value),
          start_date: formData.start_date,
          end_date: formData.end_date,
          minimum_order_value: parseFloat(formData.minimum_order_value),
        };
        await updateVoucher(updateData);
      } else {
        const newVoucherData = {
          description: formData.description,
          discount_value: parseFloat(formData.discount_value),
          start_date: formData.start_date,
          end_date: formData.end_date,
          minimum_order_value: parseFloat(formData.minimum_order_value),
        };
        await addVoucher(shopInfo?.id, newVoucherData);
      }

      setShowForm(false);
    } catch (error) {
      console.error("Failed to save voucher:", error);
    }
  };

  return (
    <OutLetContainer>
      <ConfirmComponent />
      <div className="rounded-[5px] overflow-hidden">
        <div
          className={`flex justify-between items-center mb-6 px-[20px] py-[10px] ${
            isDarkMode ? " " : "bg-dark-400 text-light-100"
          }`}
        >
          <h2 className="text-2xl font-bold ">Shop Vouchers</h2>
          <button
            className="bg-blue-600 hover:bg-green-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
            onClick={handleAddNew}
          >
            Thêm voucher
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-600">
            Loading vouchers...
          </div>
        ) : vouchers.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            Bạn chưa có voucher, hãy tạo voucher của bạn
          </div>
        ) : (
          <div className="rounded-[5px] overflow-hidden px-[20px] py-[10px">
            <div className="overflow-x-auto  rounded-[5px] ">
              <table className="min-w-full rounded-t-[5px]  border-[1px]">
                <thead
                  className={` border-[1px] rounded-t-[5px] ${
                    isDarkMode ? "" : ""
                  }`}
                >
                  <tr
                    className={` ${
                      isDarkMode ? "" : "bg-dark-400 text-light-100"
                    }`}
                  >
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Mã voucher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Tên voucher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Phần trăm giảm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Ngày bát đầu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Ngày kết thúc
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Giá đơn tối thiếu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vouchers.map((voucher) => (
                    <tr
                      key={voucher.id || voucher._id}
                      className={`${
                        isDarkMode
                          ? "hover:bg-gray-50 "
                          : "hover:bg-dark-300  bg-dark-400 text-light-100"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                        {voucher.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm ">
                        {voucher.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm ">
                        {voucher.discount_percent?.toLocaleString()} %
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm ">
                        {new Date(voucher.start_date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm ">
                        {new Date(voucher.end_date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm ">
                        {voucher.minimum_order_value.toLocaleString()} VND
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline transition duration-300"
                            onClick={() => handleEdit(voucher)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline transition duration-300"
                            onClick={() =>
                              handleDelete(voucher.id || voucher._id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {selectedVoucher ? "Cập nhật Voucher" : "Tạo Voucher"}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Tên voucher
                    </label>
                    <div className="flex border items-center rounded-[5px] px-[5px]">
                      <input
                        id="description"
                        name="description"
                        maxLength={14}
                        value={formData.description}
                        onChange={handleInputChange}
                        className="appearance-none  rounded w-full py-2 px-3 text-gray-700 leading-tight  outline-none "
                        required
                      />
                      <div className="text-dark-100 flex items-center justify-center text-[0.8rem]">
                        <span>{`${formData.description.length}/14 `}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="discount_value"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Phàn trăm giảm giá (%):
                    </label>
                    <input
                      type="number"
                      id="discount_value"
                      name="discount_value"
                      min="0"
                      value={formData.discount_value}
                      onChange={handleInputChange}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="start_date"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Ngày bắt đầu
                    </label>
                    <input
                      type="datetime-local"
                      id="start_date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="end_date"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Ngày hết hạn
                    </label>
                    <input
                      type="datetime-local"
                      id="end_date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="minimum_order_value"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      Đơn hàng tối thiểu (VND)
                    </label>
                    <input
                      type="number"
                      id="minimum_order_value"
                      name="minimum_order_value"
                      min="0"
                      value={formData.minimum_order_value}
                      onChange={handleInputChange}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                      onClick={() => setShowForm(false)}
                    >
                      Thoát
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                    >
                      {selectedVoucher ? "Cập nhật" : "Tạo voucher"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </OutLetContainer>
  );
};

export default Vouchers;
