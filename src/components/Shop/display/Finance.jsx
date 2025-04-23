import React, { useState, useEffect } from "react";
import OutLetContainer from "../../../views/client/layout/OutLetContainer";
import { useTheme } from "../../../Provider/ThemeProvider";

const Finance = () => {
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState("revenue");
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState(
    Math.floor(new Date().getMonth() / 3) + 1
  );
  const [reportData, setReportData] = useState(null);

  // Mock financial data
  const generateMockData = () => {
    setIsLoading(true);

    // Generate some random data based on selected report type and period
    setTimeout(() => {
      let data;

      if (selectedReport === "revenue") {
        if (selectedPeriod === "monthly") {
          // Daily revenue for a month
          const daysInMonth = new Date(
            selectedYear,
            selectedMonth + 1,
            0
          ).getDate();
          data = {
            labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
            values: Array.from(
              { length: daysInMonth },
              () => Math.floor(Math.random() * 50000000) + 10000000
            ),
            summary: {
              total: 0,
              average: 0,
              highest: 0,
              lowest: Infinity,
              highestDay: 0,
              lowestDay: 0,
            },
          };

          data.values.forEach((value, index) => {
            data.summary.total += value;
            if (value > data.summary.highest) {
              data.summary.highest = value;
              data.summary.highestDay = index + 1;
            }
            if (value < data.summary.lowest) {
              data.summary.lowest = value;
              data.summary.lowestDay = index + 1;
            }
          });

          data.summary.average = Math.floor(data.summary.total / daysInMonth);
        } else if (selectedPeriod === "quarterly") {
          // Monthly revenue for a quarter
          const months = [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
          ];
          const startMonth = (selectedQuarter - 1) * 3;

          data = {
            labels: months.slice(startMonth, startMonth + 3),
            values: Array.from(
              { length: 3 },
              () => Math.floor(Math.random() * 500000000) + 100000000
            ),
            summary: {
              total: 0,
              average: 0,
              highest: 0,
              lowest: Infinity,
              highestMonth: "",
              lowestMonth: "",
            },
          };

          data.values.forEach((value, index) => {
            data.summary.total += value;
            if (value > data.summary.highest) {
              data.summary.highest = value;
              data.summary.highestMonth = data.labels[index];
            }
            if (value < data.summary.lowest) {
              data.summary.lowest = value;
              data.summary.lowestMonth = data.labels[index];
            }
          });

          data.summary.average = Math.floor(data.summary.total / 3);
        } else {
          // yearly
          // Quarterly revenue for a year
          data = {
            labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
            values: Array.from(
              { length: 4 },
              () => Math.floor(Math.random() * 1500000000) + 500000000
            ),
            summary: {
              total: 0,
              average: 0,
              highest: 0,
              lowest: Infinity,
              highestQuarter: "",
              lowestQuarter: "",
            },
          };

          data.values.forEach((value, index) => {
            data.summary.total += value;
            if (value > data.summary.highest) {
              data.summary.highest = value;
              data.summary.highestQuarter = data.labels[index];
            }
            if (value < data.summary.lowest) {
              data.summary.lowest = value;
              data.summary.lowestQuarter = data.labels[index];
            }
          });

          data.summary.average = Math.floor(data.summary.total / 4);
        }
      } else if (selectedReport === "profit") {
        // Generate profit data (with expenses calculated as 60-80% of revenue)
        if (selectedPeriod === "monthly") {
          const daysInMonth = new Date(
            selectedYear,
            selectedMonth + 1,
            0
          ).getDate();
          const revenues = Array.from(
            { length: daysInMonth },
            () => Math.floor(Math.random() * 50000000) + 10000000
          );
          const expenses = revenues.map((rev) =>
            Math.floor(rev * (Math.random() * 0.2 + 0.6))
          );
          const profits = revenues.map((rev, i) => rev - expenses[i]);

          data = {
            labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
            revenue: revenues,
            expenses: expenses,
            profits: profits,
            summary: {
              totalRevenue: revenues.reduce((sum, val) => sum + val, 0),
              totalExpenses: expenses.reduce((sum, val) => sum + val, 0),
              totalProfit: profits.reduce((sum, val) => sum + val, 0),
              profitMargin: 0,
            },
          };

          data.summary.profitMargin =
            (data.summary.totalProfit / data.summary.totalRevenue) * 100;
        } else if (selectedPeriod === "quarterly") {
          const months = [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
          ];
          const startMonth = (selectedQuarter - 1) * 3;

          const revenues = Array.from(
            { length: 3 },
            () => Math.floor(Math.random() * 500000000) + 100000000
          );
          const expenses = revenues.map((rev) =>
            Math.floor(rev * (Math.random() * 0.2 + 0.6))
          );
          const profits = revenues.map((rev, i) => rev - expenses[i]);

          data = {
            labels: months.slice(startMonth, startMonth + 3),
            revenue: revenues,
            expenses: expenses,
            profits: profits,
            summary: {
              totalRevenue: revenues.reduce((sum, val) => sum + val, 0),
              totalExpenses: expenses.reduce((sum, val) => sum + val, 0),
              totalProfit: profits.reduce((sum, val) => sum + val, 0),
              profitMargin: 0,
            },
          };

          data.summary.profitMargin =
            (data.summary.totalProfit / data.summary.totalRevenue) * 100;
        } else {
          // yearly
          const revenues = Array.from(
            { length: 4 },
            () => Math.floor(Math.random() * 1500000000) + 500000000
          );
          const expenses = revenues.map((rev) =>
            Math.floor(rev * (Math.random() * 0.2 + 0.6))
          );
          const profits = revenues.map((rev, i) => rev - expenses[i]);

          data = {
            labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
            revenue: revenues,
            expenses: expenses,
            profits: profits,
            summary: {
              totalRevenue: revenues.reduce((sum, val) => sum + val, 0),
              totalExpenses: expenses.reduce((sum, val) => sum + val, 0),
              totalProfit: profits.reduce((sum, val) => sum + val, 0),
              profitMargin: 0,
            },
          };

          data.summary.profitMargin =
            (data.summary.totalProfit / data.summary.totalRevenue) * 100;
        }
      } else if (selectedReport === "products") {
        // Top selling products
        const products = [
          "Áo thun nam",
          "Quần jean nữ",
          "Giày thể thao",
          "Túi xách thời trang",
          "Đầm dự tiệc",
          "Áo sơ mi",
          "Đồng hồ thông minh",
          "Mắt kính râm",
          "Ví da cao cấp",
          "Set đồ thể thao",
        ];

        data = {
          products: products.map((name, index) => ({
            id: index + 1,
            name,
            quantity: Math.floor(Math.random() * 500) + 100,
            revenue: Math.floor(Math.random() * 150000000) + 50000000,
            profit: Math.floor(Math.random() * 70000000) + 20000000,
          })),
        };

        // Sort by revenue
        data.products.sort((a, b) => b.revenue - a.revenue);

        data.summary = {
          totalQuantity: data.products.reduce(
            (sum, product) => sum + product.quantity,
            0
          ),
          totalRevenue: data.products.reduce(
            (sum, product) => sum + product.revenue,
            0
          ),
          totalProfit: data.products.reduce(
            (sum, product) => sum + product.profit,
            0
          ),
          topProduct: data.products[0].name,
        };
      } else if (selectedReport === "orders") {
        // Order statistics
        if (selectedPeriod === "monthly") {
          const daysInMonth = new Date(
            selectedYear,
            selectedMonth + 1,
            0
          ).getDate();
          const orderCounts = Array.from(
            { length: daysInMonth },
            () => Math.floor(Math.random() * 100) + 20
          );
          const completedOrders = orderCounts.map((count) =>
            Math.floor(count * (Math.random() * 0.2 + 0.7))
          );
          const cancelledOrders = orderCounts.map(
            (count, i) => count - completedOrders[i]
          );

          data = {
            labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
            total: orderCounts,
            completed: completedOrders,
            cancelled: cancelledOrders,
            summary: {
              totalOrders: orderCounts.reduce((sum, val) => sum + val, 0),
              completedOrders: completedOrders.reduce(
                (sum, val) => sum + val,
                0
              ),
              cancelledOrders: cancelledOrders.reduce(
                (sum, val) => sum + val,
                0
              ),
              completionRate: 0,
            },
          };

          data.summary.completionRate =
            (data.summary.completedOrders / data.summary.totalOrders) * 100;
        } else if (selectedPeriod === "quarterly") {
          const months = [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
          ];
          const startMonth = (selectedQuarter - 1) * 3;

          const orderCounts = Array.from(
            { length: 3 },
            () => Math.floor(Math.random() * 3000) + 1000
          );
          const completedOrders = orderCounts.map((count) =>
            Math.floor(count * (Math.random() * 0.2 + 0.7))
          );
          const cancelledOrders = orderCounts.map(
            (count, i) => count - completedOrders[i]
          );

          data = {
            labels: months.slice(startMonth, startMonth + 3),
            total: orderCounts,
            completed: completedOrders,
            cancelled: cancelledOrders,
            summary: {
              totalOrders: orderCounts.reduce((sum, val) => sum + val, 0),
              completedOrders: completedOrders.reduce(
                (sum, val) => sum + val,
                0
              ),
              cancelledOrders: cancelledOrders.reduce(
                (sum, val) => sum + val,
                0
              ),
              completionRate: 0,
            },
          };

          data.summary.completionRate =
            (data.summary.completedOrders / data.summary.totalOrders) * 100;
        } else {
          // yearly
          const orderCounts = Array.from(
            { length: 4 },
            () => Math.floor(Math.random() * 9000) + 3000
          );
          const completedOrders = orderCounts.map((count) =>
            Math.floor(count * (Math.random() * 0.2 + 0.7))
          );
          const cancelledOrders = orderCounts.map(
            (count, i) => count - completedOrders[i]
          );

          data = {
            labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
            total: orderCounts,
            completed: completedOrders,
            cancelled: cancelledOrders,
            summary: {
              totalOrders: orderCounts.reduce((sum, val) => sum + val, 0),
              completedOrders: completedOrders.reduce(
                (sum, val) => sum + val,
                0
              ),
              cancelledOrders: cancelledOrders.reduce(
                (sum, val) => sum + val,
                0
              ),
              completionRate: 0,
            },
          };

          data.summary.completionRate =
            (data.summary.completedOrders / data.summary.totalOrders) * 100;
        }
      }

      setReportData(data);
      setIsLoading(false);
    }, 800);
  };

  // Format number to currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Generate report on filter change
  useEffect(() => {
    generateMockData();
  }, [
    selectedReport,
    selectedPeriod,
    selectedMonth,
    selectedYear,
    selectedQuarter,
  ]);

  // Available months for selection
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  // Render revenue report
  const renderRevenueReport = () => {
    if (!reportData) return null;

    return (
      <div className="mt-6 overflow-auto h-[400px] ">
        <h2
          className={`text-xl font-semibold mb-4 ${
            !isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Báo cáo doanh thu
        </h2>

        {/* Chart placeholder */}
        <div
          className={`w-full h-64 mb-6 flex items-center justify-center ${
            !isDarkMode ? "bg-gray-800" : "bg-gray-100"
          } rounded-lg`}
        >
          <p className="text-gray-500">
            Biểu đồ doanh thu sẽ được hiển thị ở đây
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className={`p-4 rounded-lg ${
              !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                !isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Tổng doanh thu
            </p>
            <p
              className={`text-xl font-bold ${
                !isDarkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              {formatCurrency(reportData.summary.total)}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                !isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Doanh thu trung bình
            </p>
            <p
              className={`text-xl font-bold ${
                !isDarkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {formatCurrency(reportData.summary.average)}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                !isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {selectedPeriod === "monthly"
                ? "Doanh thu cao nhất"
                : selectedPeriod === "quarterly"
                ? `${reportData.summary.highestMonth}`
                : `${reportData.summary.highestQuarter}`}
            </p>
            <p
              className={`text-xl font-bold ${
                !isDarkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              {formatCurrency(reportData.summary.highest)}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                !isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {selectedPeriod === "monthly"
                ? "Doanh thu thấp nhất"
                : selectedPeriod === "quarterly"
                ? `${reportData.summary.lowestMonth}`
                : `${reportData.summary.lowestQuarter}`}
            </p>
            <p
              className={`text-xl font-bold ${
                !isDarkMode ? "text-red-400" : "text-red-600"
              }`}
            >
              {formatCurrency(reportData.summary.lowest)}
            </p>
          </div>
        </div>

        {/* Data table */}
        <div
          className={`rounded-lg overflow-hidden ${
            !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
          }`}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${!isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    !isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  {selectedPeriod === "monthly"
                    ? "Ngày"
                    : selectedPeriod === "quarterly"
                    ? "Tháng"
                    : "Quý"}
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-right text-xs font-medium ${
                    !isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Doanh thu
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                !isDarkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {reportData.labels.map((label, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? !isDarkMode
                        ? "bg-gray-800"
                        : "bg-white"
                      : !isDarkMode
                      ? "bg-gray-750"
                      : "bg-gray-50"
                  }
                >
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      !isDarkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {selectedPeriod === "monthly" ? `Ngày ${label}` : label}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      !isDarkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {formatCurrency(reportData.values[index])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render profit report
  const renderProfitReport = () => {
    if (!reportData) return null;

    return (
      <div className="mt-6">
        <h2
          className={`text-xl font-semibold mb-4 ${
            !isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Báo cáo lợi nhuận
        </h2>

        {/* Chart placeholder */}
        <div
          className={`w-full h-64 mb-6 flex items-center justify-center ${
            !isDarkMode ? "bg-gray-800" : "bg-gray-100"
          } rounded-lg`}
        >
          <p className="text-gray-500">
            Biểu đồ lợi nhuận sẽ được hiển thị ở đây
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className={`p-4 rounded-lg ${
              !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                !isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Tổng doanh thu
            </p>
            <p
              className={`text-xl font-bold ${
                !isDarkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              {formatCurrency(reportData.summary.totalRevenue)}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                !isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Tổng chi phí
            </p>
            <p
              className={`text-xl font-bold ${
                !isDarkMode ? "text-red-400" : "text-red-600"
              }`}
            >
              {formatCurrency(reportData.summary.totalExpenses)}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                !isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Tổng lợi nhuận
            </p>
            <p
              className={`text-xl font-bold ${
                !isDarkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {formatCurrency(reportData.summary.totalProfit)}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                !isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Tỷ suất lợi nhuận
            </p>
            <p
              className={`text-xl font-bold ${
                !isDarkMode ? "text-purple-400" : "text-purple-600"
              }`}
            >
              {reportData.summary.profitMargin.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Data table */}
        <div
          className={`rounded-lg overflow-hidden ${
            !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
          }`}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${!isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    !isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  {selectedPeriod === "monthly"
                    ? "Ngày"
                    : selectedPeriod === "quarterly"
                    ? "Tháng"
                    : "Quý"}
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-right text-xs font-medium ${
                    !isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Doanh thu
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-right text-xs font-medium ${
                    !isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Chi phí
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-right text-xs font-medium ${
                    !isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Lợi nhuận
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                !isDarkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {reportData.labels.map((label, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? !isDarkMode
                        ? "bg-gray-800"
                        : "bg-white"
                      : !isDarkMode
                      ? "bg-gray-750"
                      : "bg-gray-50"
                  }
                >
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      !isDarkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {selectedPeriod === "monthly" ? `Ngày ${label}` : label}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      !isDarkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {formatCurrency(reportData.revenue[index])}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      !isDarkMode ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(reportData.expenses[index])}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      !isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {formatCurrency(reportData.profits[index])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render products report
  const renderProductsReport = () => {
    if (!reportData) return null;

    return (
      <div className="mt-6">
        <h2
          className={`text-xl font-semibold mb-4 ${
            !isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Báo cáo sản phẩm bán chạy
        </h2>

        {/* Chart placeholder */}
        <div
          className={`w-full h-64 mb-6 flex items-center justify-center ${
            !isDarkMode ? "bg-gray-800" : "bg-gray-100"
          } rounded-lg`}
        >
          <p className="text-gray-500">
            Biểu đồ sản phẩm sẽ được hiển thị ở đây
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className={`p-4 rounded-lg ${
              !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                !isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Tổng số lượng bán
            </p>
            <p
              className={`text-xl font-bold ${
                !isDarkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {reportData.summary.totalQuantity.toLocaleString()} sản phẩm
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                !isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Tổng doanh thu
            </p>
            <p
              className={`text-xl font-bold ${
                !isDarkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              {formatCurrency(reportData.summary.totalRevenue)}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                !isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Tổng lợi nhuận
            </p>
            <p
              className={`text-xl font-bold ${
                !isDarkMode ? "text-purple-400" : "text-purple-600"
              }`}
            >
              {formatCurrency(reportData.summary.totalProfit)}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                !isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Sản phẩm bán chạy nhất
            </p>
            <p
              className={`text-xl font-bold ${
                !isDarkMode ? "text-yellow-400" : "text-yellow-600"
              }`}
            >
              {reportData.summary.topProduct}
            </p>
          </div>
        </div>

        {/* Data table */}
        <div
          className={`rounded-lg overflow-hidden ${
            !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
          }`}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${!isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    !isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Tên sản phẩm
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-right text-xs font-medium ${
                    !isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Số lượng bán
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-right text-xs font-medium ${
                    !isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Doanh thu
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-right text-xs font-medium ${
                    !isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Lợi nhuận
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                !isDarkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {reportData.products.map((product, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? !isDarkMode
                        ? "bg-gray-800"
                        : "bg-white"
                      : !isDarkMode
                      ? "bg-gray-750"
                      : "bg-gray-50"
                  }
                >
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      !isDarkMode ? "text-gray-300" : "text-gray-800"
                    }`}
                  >
                    {product.name}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      !isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {product.quantity.toLocaleString()}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      !isDarkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {formatCurrency(product.revenue)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      !isDarkMode ? "text-purple-400" : "text-purple-600"
                    }`}
                  >
                    {formatCurrency(product.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render orders report
  const renderOrdersReport = () => {
    if (!reportData) return null;

    return (
      <div className="mt-6">
        <h2
          className={`text-xl font-semibold mb-4 ${
            !isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Báo cáo đơn hàng
        </h2>

        {/* Chart placeholder */}
        <div
          className={`w-full h-64 mb-6 flex items-center justify-center ${
            !isDarkMode ? "bg-gray-800" : "bg-gray-100"
          } rounded-lg`}
        >
          <p className="text-gray-500">
            Biểu đồ đơn hàng sẽ được hiển thị ở đây
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className={`p-4 rounded-lg ${
              !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                !isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Tổng đơn hàng
            </p>
            <p
              className={`text-xl font-bold ${
                !isDarkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {reportData.summary.totalOrders.toLocaleString()}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                !isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Đơn hàng thành công
            </p>
            <p
              className={`text-xl font-bold ${
                !isDarkMode ? "text-green-400" : "text-green-600"
              }`}
            >
              {reportData.summary.completedOrders.toLocaleString()}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                !isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Đơn hàng hủy
            </p>
            <p
              className={`text-xl font-bold ${
                !isDarkMode ? "text-red-400" : "text-red-600"
              }`}
            >
              {reportData.summary.cancelledOrders.toLocaleString()}
            </p>
          </div>

          <div
            className={`p-4 rounded-lg ${
              !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <p
              className={`text-sm ${
                !isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Tỷ lệ thành công
            </p>
            <p
              className={`text-xl font-bold ${
                !isDarkMode ? "text-purple-400" : "text-purple-600"
              }`}
            >
              {reportData.summary.completionRate.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Data table */}
        <div
          className={`rounded-lg overflow-hidden ${
            !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
          }`}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${!isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium ${
                    !isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  {selectedPeriod === "monthly"
                    ? "Ngày"
                    : selectedPeriod === "quarterly"
                    ? "Tháng"
                    : "Quý"}
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-right text-xs font-medium ${
                    !isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Tổng đơn
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-right text-xs font-medium ${
                    !isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Thành công
                </th>
                <th
                  scope="col"
                  className={`px-6 py-3 text-right text-xs font-medium ${
                    !isDarkMode ? "text-gray-300" : "text-gray-500"
                  } uppercase tracking-wider`}
                >
                  Hủy
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                !isDarkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              {reportData.labels.map((label, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? !isDarkMode
                        ? "bg-gray-800"
                        : "bg-white"
                      : !isDarkMode
                      ? "bg-gray-750"
                      : "bg-gray-50"
                  }
                >
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      !isDarkMode ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {selectedPeriod === "monthly" ? `Ngày ${label}` : label}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      !isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {reportData.total[index].toLocaleString()}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      !isDarkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    {reportData.completed[index].toLocaleString()}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                      !isDarkMode ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    {reportData.cancelled[index].toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <OutLetContainer>
      <div
        className={`p-6 ${
          !isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
        }`}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Báo cáo tài chính</h1>
            <p
              className={`mt-1 ${
                !isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Quản lý và phân tích dữ liệu tài chính của cửa hàng
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div
          className={`p-4 rounded-lg mb-6 ${
            !isDarkMode ? "bg-gray-800" : "bg-white border border-gray-200"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Report type filter */}
            <div>
              <label
                htmlFor="reportType"
                className={`block text-sm font-medium mb-1 ${
                  !isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Loại báo cáo
              </label>
              <select
                id="reportType"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                  ${
                    !isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900"
                  }`}
              >
                <option value="revenue">Doanh thu</option>
                <option value="profit">Lợi nhuận</option>
                <option value="products">Sản phẩm bán chạy</option>
                <option value="orders">Đơn hàng</option>
              </select>
            </div>

            {/* Period filter */}
            {selectedReport !== "products" && (
              <div>
                <label
                  htmlFor="periodType"
                  className={`block text-sm font-medium mb-1 ${
                    !isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Thời gian
                </label>
                <select
                  id="periodType"
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                    ${
                      !isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-900"
                    }`}
                >
                  <option value="monthly">Tháng</option>
                  <option value="quarterly">Quý</option>
                  <option value="yearly">Năm</option>
                </select>
              </div>
            )}

            {/* Month filter - show only for monthly period */}
            {selectedPeriod === "monthly" && selectedReport !== "products" && (
              <div>
                <label
                  htmlFor="monthSelect"
                  className={`block text-sm font-medium mb-1 ${
                    !isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Tháng
                </label>
                <select
                  id="monthSelect"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                    ${
                      !isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-900"
                    }`}
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quarter filter - show only for quarterly period */}
            {selectedPeriod === "quarterly" &&
              selectedReport !== "products" && (
                <div>
                  <label
                    htmlFor="quarterSelect"
                    className={`block text-sm font-medium mb-1 ${
                      !!isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Quý
                  </label>
                  <select
                    id="quarterSelect"
                    value={selectedQuarter}
                    onChange={(e) =>
                      setSelectedQuarter(parseInt(e.target.value))
                    }
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                    ${
                      !isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-900"
                    }`}
                  >
                    <option value={1}>Quý 1</option>
                    <option value={2}>Quý 2</option>
                    <option value={3}>Quý 3</option>
                    <option value={4}>Quý 4</option>
                  </select>
                </div>
              )}

            {/* Year filter */}
            {selectedReport !== "products" && (
              <div>
                <label
                  htmlFor="yearSelect"
                  className={`block text-sm font-medium mb-1 ${
                    !!isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Năm
                </label>
                <select
                  id="yearSelect"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                    ${
                      !isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-900"
                    }`}
                >
                  {[2023, 2024, 2025].map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                !isDarkMode ? "border-blue-400" : "border-blue-600"
              }`}
            ></div>
          </div>
        ) : (
          // Render appropriate report based on selection
          <>
            {selectedReport === "revenue" && renderRevenueReport()}
            {selectedReport === "profit" && renderProfitReport()}
            {selectedReport === "products" && renderProductsReport()}
            {selectedReport === "orders" && renderOrdersReport()}
          </>
        )}
      </div>
    </OutLetContainer>
  );
};

export default Finance;
