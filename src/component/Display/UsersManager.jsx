import React, { useState, useEffect } from "react";
import { useTheme } from "../../Provider/ThemeProvider";
import { useNotify } from "../Notify/NotifyModal";
import { useConfirm } from "../Notify/ConfirmModal";
import ContainerModeLayer1 from "../Container/ContainerModeLayer1";

// Tạo dữ liệu giả
const generateFakeUsers = (count) => {
  const userTypes = ["Khách hàng", "Nhà bán hàng", "Nhà cung cấp"];
  const statuses = ["Hoạt động", "Bị chặn"];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Người dùng ${i + 1}`,
    email: `user${i + 1}@example.com`,
    phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
    type: userTypes[Math.floor(Math.random() * userTypes.length)],
    status: statuses[Math.random() > 0.2 ? 0 : 1], // 80% hoạt động, 20% bị chặn
    registeredDate: new Date(
      Date.now() - Math.floor(Math.random() * 31536000000)
    )
      .toISOString()
      .split("T")[0], // ngày đăng ký trong 1 năm qua
    lastActive: new Date(Date.now() - Math.floor(Math.random() * 2592000000))
      .toISOString()
      .split("T")[0], // hoạt động gần đây trong 1 tháng qua
  }));
};

const UserRow = ({ user, onBlock, onUnblock }) => {
  const { isDarkMode } = useTheme();

  return (
    <tr
      className={`border-b text-[0.8rem]  ${
        isDarkMode ? "border-gray-200" : "border-gray-700"
      }`}
    >
      <td className="py-3 px-4">{user.id}</td>
      <td className="py-3 px-4">{user.name}</td>
      <td className="py-3 px-4">{user.email}</td>
      <td className="py-3 px-4">{user.phone}</td>
      <td className="py-3 px-4">{user.type}</td>
      <td className="py-3 px-4">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            user.status === "Hoạt động"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {user.status}
        </span>
      </td>
      <td className="py-3 px-4">{user.registeredDate}</td>
      <td className="py-3 px-4">{user.lastActive}</td>
      <td className="py-3 px-4">
        {user.status === "Hoạt động" ? (
          <button
            onClick={() => onBlock(user)}
            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors"
          >
            Chặn
          </button>
        ) : (
          <button
            onClick={() => onUnblock(user)}
            className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition-colors"
          >
            Mở khóa
          </button>
        )}
      </td>
    </tr>
  );
};

const UsersManager = () => {
  const { confirm, ConfirmComponent } = useConfirm();
  const { notifySuccess, notifyWarning } = useNotify();
  const { isDarkMode } = useTheme();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    search: "",
    type: "all",
    status: "all",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
  });

  useEffect(() => {
    // Giả lập tải dữ liệu
    setTimeout(() => {
      const fakeUsers = generateFakeUsers(48);
      setUsers(fakeUsers);
      setPagination({
        ...pagination,
        totalPages: Math.ceil(fakeUsers.length / pagination.itemsPerPage),
      });
      setLoading(false);
    }, 800);
  }, []);

  // Xử lý chặn tài khoản
  const handleBlockUser = (user) => {
    confirm({
      message: `Bạn có chắc muốn chặn tài khoản "${user.name}" (${user.email})?`,
      onConfirm: async () => {
        try {
          // Giả lập API call
          setTimeout(() => {
            setUsers(
              users.map((u) =>
                u.id === user.id ? { ...u, status: "Bị chặn" } : u
              )
            );
            notifySuccess(`Đã chặn tài khoản ${user.name} thành công`, 3000);
          }, 500);
        } catch (error) {
          console.log("Lỗi chặn tài khoản", error);
          notifyWarning("Đã xảy ra lỗi khi chặn tài khoản", 3000);
        }
      },
      onCancel: () => {
        return;
      },
    });
  };

  // Xử lý mở khóa tài khoản
  const handleUnblockUser = (user) => {
    confirm({
      message: `Bạn có chắc muốn mở khóa tài khoản "${user.name}" (${user.email})?`,
      onConfirm: async () => {
        try {
          // Giả lập API call
          setTimeout(() => {
            setUsers(
              users.map((u) =>
                u.id === user.id ? { ...u, status: "Hoạt động" } : u
              )
            );
            notifySuccess(`Đã mở khóa tài khoản ${user.name} thành công`, 3000);
          }, 500);
        } catch (error) {
          console.log("Lỗi mở khóa tài khoản", error);
          notifyWarning("Đã xảy ra lỗi khi mở khóa tài khoản", 3000);
        }
      },
      onCancel: () => {
        return;
      },
    });
  };

  // Xử lý lọc dữ liệu
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
    setPagination({
      ...pagination,
      currentPage: 1,
    });
  };

  // Lọc danh sách người dùng
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.search.toLowerCase()) ||
      user.phone.includes(filter.search);
    const matchType = filter.type === "all" || user.type === filter.type;
    const matchStatus =
      filter.status === "all" || user.status === filter.status;

    return matchSearch && matchType && matchStatus;
  });

  // Tính toán phân trang
  const indexOfLastItem = pagination.currentPage * pagination.itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - pagination.itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / pagination.itemsPerPage);

  // Xử lý thay đổi trang
  const handlePageChange = (pageNumber) => {
    setPagination({
      ...pagination,
      currentPage: pageNumber,
    });
  };

  return (
    <ContainerModeLayer1>
      <h2 className="text-2xl font-nunito font-bold mb-6 px-[20px] py-[10px]">
        Quản lý tài khoản người dùng
      </h2>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 px-[20px]">
          <label className="block text-sm font-medium mb-1">Tìm kiếm</label>
          <input
            type="text"
            name="search"
            value={filter.search}
            onChange={handleFilterChange}
            placeholder="Tên, Email, Số điện thoại..."
            className={`w-full p-2 rounded-md border outline-none ${
              isDarkMode
                ? "border-gray-300 bg-white"
                : "border-gray-600 bg-dark-300"
            }`}
          />
        </div>
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium mb-1">
            Loại tài khoản
          </label>
          <select
            name="type"
            value={filter.type}
            onChange={handleFilterChange}
            className={`w-full p-2 rounded-md border outline-none ${
              isDarkMode
                ? "border-gray-300 bg-white"
                : "border-gray-600 bg-dark-300"
            }`}
          >
            <option value="all">Tất cả</option>
            <option value="Khách hàng">Khách hàng</option>
            <option value="Nhà bán hàng">Nhà bán hàng</option>
            <option value="Nhà cung cấp">Nhà cung cấp</option>
          </select>
        </div>
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium mb-1">Trạng thái</label>
          <select
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
            className={`w-full p-2 rounded-md border outline-none ${
              isDarkMode
                ? "border-gray-300 bg-white"
                : "border-gray-600 bg-dark-300"
            }`}
          >
            <option value="all">Tất cả</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Bị chặn">Bị chặn</option>
          </select>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 px-[20px]">
        <div
          className={`p-4 rounded-lg ${
            isDarkMode ? "bg-blue-50" : "bg-blue-900"
          }`}
        >
          <p
            className={`text-sm ${
              isDarkMode ? "text-blue-600" : "text-blue-300"
            }`}
          >
            Tổng số người dùng
          </p>
          <p
            className={`text-2xl font-bold ${
              isDarkMode ? "text-blue-700" : "text-blue-100"
            }`}
          >
            {users.length}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg ${
            isDarkMode ? "bg-green-50" : "bg-green-900"
          }`}
        >
          <p
            className={`text-sm ${
              isDarkMode ? "text-green-600" : "text-green-300"
            }`}
          >
            Đang hoạt động
          </p>
          <p
            className={`text-2xl font-bold ${
              isDarkMode ? "text-green-700" : "text-green-100"
            }`}
          >
            {users.filter((u) => u.status === "Hoạt động").length}
          </p>
        </div>
        <div
          className={`p-4 rounded-lg ${
            isDarkMode ? "bg-red-50" : "bg-red-900"
          }`}
        >
          <p
            className={`text-sm ${
              isDarkMode ? "text-red-600" : "text-red-300"
            }`}
          >
            Bị chặn
          </p>
          <p
            className={`text-2xl font-bold ${
              isDarkMode ? "text-red-700" : "text-red-100"
            }`}
          >
            {users.filter((u) => u.status === "Bị chặn").length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto mx-[20px] border rounded-[5px]">
        <table
          className={`min-w-full ${
            isDarkMode ? "text-gray-800" : "text-gray-200"
          }`}
        >
          <thead
            className={`text-[0.8rem] $ ${
              isDarkMode ? "bg-gray-100" : "bg-dark-300"
            }`}
          >
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Tên</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Số điện thoại</th>
              <th className="py-3 px-4 text-left">Loại</th>
              <th className="py-3 px-4 text-left">Trạng thái</th>
              <th className="py-3 px-4 text-left">Ngày đăng ký</th>
              <th className="py-3 px-4 text-left">Hoạt động gần đây</th>
              <th className="py-3 px-4 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="py-4 text-center">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onBlock={handleBlockUser}
                  onUnblock={handleUnblockUser}
                />
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-4 text-center">
                  Không tìm thấy tài khoản nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <div>
            <p className="text-sm">
              Hiển thị {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredUsers.length)}
              trong tổng số {filteredUsers.length} tài khoản
            </p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() =>
                handlePageChange(Math.max(1, pagination.currentPage - 1))
              }
              disabled={pagination.currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                pagination.currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : isDarkMode
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Trước
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Hiển thị tối đa 5 nút trang
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= pagination.currentPage - 1 &&
                  pageNum <= pagination.currentPage + 1)
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md ${
                      pagination.currentPage === pageNum
                        ? isDarkMode
                          ? "bg-blue-600 text-white"
                          : "bg-blue-700 text-white"
                        : isDarkMode
                        ? "bg-gray-200 hover:bg-gray-300"
                        : "bg-dark-300 hover:bg-dark-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                (pageNum === pagination.currentPage - 2 &&
                  pagination.currentPage > 3) ||
                (pageNum === pagination.currentPage + 2 &&
                  pagination.currentPage < totalPages - 2)
              ) {
                return (
                  <span key={i} className="px-1">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={() =>
                handlePageChange(
                  Math.min(totalPages, pagination.currentPage + 1)
                )
              }
              disabled={pagination.currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                pagination.currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed"
                  : isDarkMode
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* ConfirmComponent */}
      <ConfirmComponent />
    </ContainerModeLayer1>
  );
};

export default UsersManager;
