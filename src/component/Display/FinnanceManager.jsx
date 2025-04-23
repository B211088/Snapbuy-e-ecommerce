import React, { useState, useEffect } from "react";
import ContainerModeLayer1 from "../Container/ContainerModeLayer1";
import { useTheme } from "../../Provider/ThemeProvider";
import { useConfirm } from "../Notify/ConfirmModal";
import { useNotify } from "../Notify/NotifyModal";

// Dữ liệu giả cho thống kê
const fakeStatistics = {
  totalRevenue: 12568900000,
  totalOrders: 56789,
  totalUsers: 23456,
  totalSellers: 1250,
  totalShippingPartners: 42,
  monthlySales: [
    { month: "T1", revenue: 890000000 },
    { month: "T2", revenue: 950000000 },
    { month: "T3", revenue: 1050000000 },
    { month: "T4", revenue: 980000000 },
    { month: "T5", revenue: 1100000000 },
    { month: "T6", revenue: 1250000000 },
    { month: "T7", revenue: 1180000000 },
    { month: "T8", revenue: 1220000000 },
    { month: "T9", revenue: 1300000000 },
    { month: "T10", revenue: 1420000000 },
    { month: "T11", revenue: 1080000000 },
    { month: "T12", revenue: 1150000000 },
  ],
  categorySales: [
    { category: "Điện tử", revenue: 3890000000 },
    { category: "Thời trang", revenue: 2650000000 },
    { category: "Đồ gia dụng", revenue: 1980000000 },
    { category: "Mỹ phẩm", revenue: 1450000000 },
    { category: "Thực phẩm", revenue: 1350000000 },
    { category: "Khác", revenue: 1248900000 },
  ],
};

// Dữ liệu giả cho báo cáo
const generateFakeReports = () => {
  const reportTypes = ["Người dùng", "Người bán", "Đơn hàng", "Vận chuyển"];
  const timeRanges = ["Hôm nay", "Tuần này", "Tháng này", "Quý này", "Năm nay"];
  const statuses = ["Đã tạo", "Đang xử lý", "Hoàn thành"];

  return Array.from({ length: 15 }, (_, i) => ({
    id: `REP${100000 + i}`,
    type: reportTypes[Math.floor(Math.random() * reportTypes.length)],
    name: `Báo cáo ${reportTypes[
      Math.floor(Math.random() * reportTypes.length)
    ].toLowerCase()} ${timeRanges[
      Math.floor(Math.random() * timeRanges.length)
    ].toLowerCase()}`,
    timeRange: timeRanges[Math.floor(Math.random() * timeRanges.length)],
    createdDate: new Date(Date.now() - Math.floor(Math.random() * 7776000000))
      .toISOString()
      .split("T")[0], // 90 ngày trước đến hiện tại
    status: statuses[Math.floor(Math.random() * statuses.length)],
    totalAmount: Math.floor(10000000 + Math.random() * 990000000),
  }));
};

// Hàm format tiền VND
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const StatisticsCard = ({ title, value, icon, color }) => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`p-4 rounded-lg ${
        isDarkMode ? `bg-${color}-50` : `bg-${color}-900`
      }`}
    >
      <div className="flex justify-between">
        <div>
          <p
            className={`text-sm ${
              isDarkMode ? `text-${color}-600` : `text-${color}-300`
            }`}
          >
            {title}
          </p>
          <p
            className={`text-2xl font-bold ${
              isDarkMode ? `text-${color}-700` : `text-${color}-100`
            }`}
          >
            {typeof value === "number" && value > 1000000
              ? formatCurrency(value)
              : value.toLocaleString()}
          </p>
        </div>
        <div
          className={`text-2xl ${
            isDarkMode ? `text-${color}-500` : `text-${color}-200`
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const ReportForm = ({ onClose, onSubmit }) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    type: "",
    timeRange: "",
    startDate: "",
    endDate: "",
    includeDetails: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div
      className={`p-4 rounded-lg mb-6 border ${
        isDarkMode ? "border-gray-300" : "border-gray-700"
      }`}
    >
      <h3 className="text-lg font-semibold mb-4">Tạo báo cáo mới</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Loại báo cáo
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className={`w-full p-2 rounded-md border outline-none ${
                isDarkMode
                  ? "border-gray-300 bg-white"
                  : "border-gray-600 bg-dark-300"
              }`}
            >
              <option value="">-- Chọn loại báo cáo --</option>
              <option value="Người dùng">Người dùng</option>
              <option value="Người bán">Người bán</option>
              <option value="Đơn hàng">Đơn hàng</option>
              <option value="Vận chuyển">Vận chuyển</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Khoảng thời gian
            </label>
            <select
              name="timeRange"
              value={formData.timeRange}
              onChange={handleChange}
              required
              className={`w-full p-2 rounded-md border outline-none ${
                isDarkMode
                  ? "border-gray-300 bg-white"
                  : "border-gray-600 bg-dark-300"
              }`}
            >
              <option value="">-- Chọn khoảng thời gian --</option>
              <option value="Hôm nay">Hôm nay</option>
              <option value="Tuần này">Tuần này</option>
              <option value="Tháng này">Tháng này</option>
              <option value="Quý này">Quý này</option>
              <option value="Năm nay">Năm nay</option>
              <option value="Tùy chỉnh">Tùy chỉnh</option>
            </select>
          </div>
        </div>

        {formData.timeRange === "Tùy chỉnh" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Từ ngày</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className={`w-full p-2 rounded-md border outline-none ${
                  isDarkMode
                    ? "border-gray-300 bg-white"
                    : "border-gray-600 bg-dark-300"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Đến ngày</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className={`w-full p-2 rounded-md border outline-none ${
                  isDarkMode
                    ? "border-gray-300 bg-white"
                    : "border-gray-600 bg-dark-300"
                }`}
              />
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="includeDetails"
              checked={formData.includeDetails}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">Bao gồm chi tiết giao dịch</span>
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Tạo báo cáo
          </button>
        </div>
      </form>
    </div>
  );
};

const FinnanceManager = () => {
  const { isDarkMode } = useTheme();
  const { confirm, ConfirmComponent } = useConfirm();
  const { notifySuccess, notifyWarning } = useNotify();

  const [showReportForm, setShowReportForm] = useState(false);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    search: "",
    type: "all",
    status: "all",
    timeRange: "all",
  });

  // Load dữ liệu báo cáo giả lập
  useEffect(() => {
    setTimeout(() => {
      setReports(generateFakeReports());
      setLoading(false);
    }, 800);
  }, []);

  const handleCreateReport = (formData) => {
    // Giả lập API tạo báo cáo
    setLoading(true);
    setTimeout(() => {
      const newReport = {
        id: `REP${100000 + Math.floor(Math.random() * 900000)}`,
        type: formData.type,
        name: `Báo cáo ${formData.type.toLowerCase()} ${formData.timeRange.toLowerCase()}`,
        timeRange: formData.timeRange,
        createdDate: new Date().toISOString().split("T")[0],
        status: "Đang xử lý",
        totalAmount: Math.floor(10000000 + Math.random() * 990000000),
      };

      setReports([newReport, ...reports]);
      setShowReportForm(false);
      setLoading(false);
      notifySuccess("Đã tạo báo cáo mới thành công!", 3000);
    }, 1000);
  };

  const handleDeleteReport = (report) => {
    confirm({
      message: `Bạn có chắc muốn xóa báo cáo "${report.name}"?`,
      onConfirm: () => {
        setLoading(true);
        // Giả lập API xóa báo cáo
        setTimeout(() => {
          setReports(reports.filter((r) => r.id !== report.id));
          setLoading(false);
          notifySuccess("Đã xóa báo cáo thành công!", 3000);
        }, 500);
      },
      onCancel: () => {
        return;
      },
    });
  };

  const handleDownloadReport = (report) => {
    // Giả lập tải về báo cáo
    notifySuccess("Đang tải xuống báo cáo...", 3000);
    setTimeout(() => {
      notifySuccess("Đã tải xuống báo cáo thành công!", 3000);
    }, 1500);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  // Lọc báo cáo
  const filteredReports = reports.filter((report) => {
    const matchSearch =
      report.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      report.id.toLowerCase().includes(filter.search.toLowerCase());
    const matchType = filter.type === "all" || report.type === filter.type;
    const matchStatus =
      filter.status === "all" || report.status === filter.status;
    const matchTimeRange =
      filter.timeRange === "all" || report.timeRange === filter.timeRange;

    return matchSearch && matchType && matchStatus && matchTimeRange;
  });

  return (
    <ContainerModeLayer1>
      <h2 className="text-2xl font-nunito font-bold mb-6 px-[20px] py-[10px]">
        Quản lý tài chính
      </h2>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-[20px]">
        <StatisticsCard
          title="Tổng doanh thu"
          value={fakeStatistics.totalRevenue}
          icon="₫"
          color="blue"
        />
        <StatisticsCard
          title="Tổng đơn hàng"
          value={fakeStatistics.totalOrders}
          icon="📦"
          color="green"
        />
        <StatisticsCard
          title="Người bán"
          value={fakeStatistics.totalSellers}
          icon="🏪"
          color="purple"
        />
        <StatisticsCard
          title="Đối tác vận chuyển"
          value={fakeStatistics.totalShippingPartners}
          icon="🚚"
          color="orange"
        />
      </div>

      {/* Tùy chọn báo cáo */}
      <div className="flex justify-between items-center mb-6 px-[20px]">
        <h3 className="text-xl font-semibold">Báo cáo tài chính</h3>
        <button
          onClick={() => setShowReportForm(!showReportForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          {showReportForm ? "Hủy" : "Tạo báo cáo mới"}
        </button>
      </div>

      {/* Form tạo báo cáo */}
      {showReportForm && (
        <ReportForm
          onClose={() => setShowReportForm(false)}
          onSubmit={handleCreateReport}
        />
      )}

      {/* Bộ lọc báo cáo */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 px-[20px]">
        <div>
          <label className="block text-sm font-medium mb-1">Tìm kiếm</label>
          <input
            type="text"
            name="search"
            value={filter.search}
            onChange={handleFilterChange}
            placeholder="Tên báo cáo, ID..."
            className={`w-full p-2 rounded-md border outline-none ${
              isDarkMode
                ? "border-gray-300 bg-white"
                : "border-gray-600 bg-dark-300"
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Loại báo cáo</label>
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
            <option value="Người dùng">Người dùng</option>
            <option value="Người bán">Người bán</option>
            <option value="Đơn hàng">Đơn hàng</option>
            <option value="Vận chuyển">Vận chuyển</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Khoảng thời gian
          </label>
          <select
            name="timeRange"
            value={filter.timeRange}
            onChange={handleFilterChange}
            className={`w-full p-2 rounded-md border outline-none ${
              isDarkMode
                ? "border-gray-300 bg-white"
                : "border-gray-600 bg-dark-300"
            }`}
          >
            <option value="all">Tất cả</option>
            <option value="Hôm nay">Hôm nay</option>
            <option value="Tuần này">Tuần này</option>
            <option value="Tháng này">Tháng này</option>
            <option value="Quý này">Quý này</option>
            <option value="Năm nay">Năm nay</option>
          </select>
        </div>
        <div>
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
            <option value="Đã tạo">Đã tạo</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Hoàn thành">Hoàn thành</option>
          </select>
        </div>
      </div>

      {/* Bảng báo cáo */}
      <div className="overflow-x-auto mx-[20px] border rounded-[5px]">
        <table
          className={`min-w-full ${
            isDarkMode ? "text-gray-800" : "text-gray-200"
          }`}
        >
          <thead
            className={` text-[0.8rem] ${
              isDarkMode ? "bg-gray-100" : "bg-dark-300"
            }`}
          >
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Tên báo cáo</th>
              <th className="py-3 px-4 text-left">Loại</th>
              <th className="py-3 px-4 text-left">Khoảng thời gian</th>
              <th className="py-3 px-4 text-left">Ngày tạo</th>
              <th className="py-3 px-4 text-left">Trạng thái</th>
              <th className="py-3 px-4 text-left">Tổng tiền</th>
              <th className="py-3 px-4 text-left">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="py-4 text-center">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className={`border-b text-[0.8rem] ${
                    isDarkMode ? "border-gray-200" : "border-gray-700"
                  }`}
                >
                  <td className="py-3 px-4">{report.id}</td>
                  <td className="py-3 px-4">{report.name}</td>
                  <td className="py-3 px-4">{report.type}</td>
                  <td className="py-3 px-4">{report.timeRange}</td>
                  <td className="py-3 px-4">{report.createdDate}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        report.status === "Hoàn thành"
                          ? "bg-green-100 text-green-800"
                          : report.status === "Đang xử lý"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {formatCurrency(report.totalAmount)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDownloadReport(report)}
                        disabled={report.status !== "Hoàn thành"}
                        className={`px-2 py-1 rounded-md text-xs ${
                          report.status === "Hoàn thành"
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Tải xuống
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report)}
                        className="bg-red-500 text-white px-2 py-1 rounded-md text-xs hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-4 text-center">
                  Không tìm thấy báo cáo nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Biểu đồ thống kê */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className={`p-4 rounded-lg ${
            isDarkMode ? "bg-white" : "bg-dark-300"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h3>
          <div className="h-64 flex items-end space-x-2">
            {fakeStatistics.monthlySales.map((item, index) => {
              const height = (item.revenue / 1500000000) * 100;
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-full rounded-t-md ${
                      isDarkMode ? "bg-blue-500" : "bg-blue-600"
                    }`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs mt-1">{item.month}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`p-4 rounded-lg ${
            isDarkMode ? "bg-white" : "bg-dark-300"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4">
            Doanh thu theo danh mục
          </h3>
          <div className="space-y-3">
            {fakeStatistics.categorySales.map((item, index) => {
              const percentage =
                (item.revenue / fakeStatistics.totalRevenue) * 100;
              return (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span>{item.category}</span>
                    <span>{formatCurrency(item.revenue)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        index % 5 === 0
                          ? "bg-blue-500"
                          : index % 5 === 1
                          ? "bg-green-500"
                          : index % 5 === 2
                          ? "bg-purple-500"
                          : index % 5 === 3
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ConfirmComponent */}
      <ConfirmComponent />
    </ContainerModeLayer1>
  );
};

export default FinnanceManager;
