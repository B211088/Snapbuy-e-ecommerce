import React, { useState, useEffect } from "react";
import ContainerModeLayer1 from "../Container/ContainerModeLayer1";
import { useTheme } from "../../Provider/ThemeProvider";
import { useConfirm } from "../Notify/ConfirmModal";
import { useNotify } from "../Notify/NotifyModal";

const ShippingManager = () => {
  const { isDarkMode } = useTheme();
  const { confirm, ConfirmComponent } = useConfirm();
  const { notifySuccess, notifyWarning } = useNotify();

  // State for shipping units and pending registrations
  const [shippingUnits, setShippingUnits] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("pending"); // 'pending' or 'approved'

  // Mock data - replace with actual API calls in production
  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      setPendingRegistrations([
        {
          id: 1,
          name: "Fast Delivery Co.",
          email: "contact@fastdelivery.com",
          phone: "0123456789",
          address: "123 Delivery St.",
          createdAt: "2025-04-15",
        },
        {
          id: 2,
          name: "Quick Ship Inc.",
          email: "info@quickship.com",
          phone: "0987654321",
          address: "456 Shipping Ave.",
          createdAt: "2025-04-16",
        },
        {
          id: 3,
          name: "Express Logistics",
          email: "support@expresslogistics.com",
          phone: "0369852147",
          address: "789 Logistics Blvd.",
          createdAt: "2025-04-17",
        },
      ]);

      setShippingUnits([
        {
          id: 101,
          name: "Global Shipping",
          email: "service@globalshipping.com",
          phone: "0123456789",
          address: "101 Global St.",
          status: "active",
          approvedAt: "2025-04-10",
        },
        {
          id: 102,
          name: "Local Delivery",
          email: "contact@localdelivery.com",
          phone: "0987654321",
          address: "202 Local Ave.",
          status: "active",
          approvedAt: "2025-04-12",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle approve shipping unit registration
  const handleApprove = (registration) => {
    confirm({
      title: "Xác nhận phê duyệt",
      message: `Bạn có chắc chắn muốn phê duyệt đơn vị vận chuyển "${registration.name}"?`,
      onConfirm: () => {
        // In production, make an API call to approve
        setIsLoading(true);

        // Simulate API call delay
        setTimeout(() => {
          // Remove from pending list
          setPendingRegistrations(
            pendingRegistrations.filter((item) => item.id !== registration.id)
          );

          // Add to approved list
          const newShippingUnit = {
            id: registration.id,
            name: registration.name,
            email: registration.email,
            phone: registration.phone,
            address: registration.address,
            status: "active",
            approvedAt: new Date().toISOString().split("T")[0],
          };

          setShippingUnits([...shippingUnits, newShippingUnit]);
          setIsLoading(false);
          notifySuccess("Đã phê duyệt đơn vị vận chuyển thành công!");
        }, 800);
      },
    });
  };

  // Handle reject shipping unit registration
  const handleReject = (registration) => {
    confirm({
      title: "Xác nhận từ chối",
      message: `Bạn có chắc chắn muốn từ chối đơn vị vận chuyển "${registration.name}"?`,
      onConfirm: () => {
        // In production, make an API call to reject
        setIsLoading(true);

        // Simulate API call delay
        setTimeout(() => {
          // Remove from pending list
          setPendingRegistrations(
            pendingRegistrations.filter((item) => item.id !== registration.id)
          );
          setIsLoading(false);
          notifyWarning("Đã từ chối đơn vị vận chuyển!");
        }, 800);
      },
    });
  };

  // Handle deactivate approved shipping unit
  const handleDeactivate = (unit) => {
    confirm({
      title: "Xác nhận vô hiệu hóa",
      message: `Bạn có chắc chắn muốn vô hiệu hóa đơn vị vận chuyển "${unit.name}"?`,
      onConfirm: () => {
        // In production, make an API call to deactivate
        setIsLoading(true);

        // Simulate API call delay
        setTimeout(() => {
          const updatedUnits = shippingUnits.map((item) => {
            if (item.id === unit.id) {
              return { ...item, status: "inactive" };
            }
            return item;
          });

          setShippingUnits(updatedUnits);
          setIsLoading(false);
          notifyWarning("Đã vô hiệu hóa đơn vị vận chuyển!");
        }, 800);
      },
    });
  };

  // Handle activate shipping unit
  const handleActivate = (unit) => {
    confirm({
      title: "Xác nhận kích hoạt",
      message: `Bạn có chắc chắn muốn kích hoạt đơn vị vận chuyển "${unit.name}"?`,
      onConfirm: () => {
        // In production, make an API call to activate
        setIsLoading(true);

        // Simulate API call delay
        setTimeout(() => {
          const updatedUnits = shippingUnits.map((item) => {
            if (item.id === unit.id) {
              return { ...item, status: "active" };
            }
            return item;
          });

          setShippingUnits(updatedUnits);
          setIsLoading(false);
          notifySuccess("Đã kích hoạt đơn vị vận chuyển thành công!");
        }, 800);
      },
    });
  };

  // Render pending registrations tab
  const renderPendingRegistrations = () => {
    if (pendingRegistrations.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">
            Không có đơn đăng ký nào đang chờ duyệt
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto border rounded-[5px]">
        <table className="w-full text-sm text-left">
          <thead
            className={`text-xs uppercase ${
              isDarkMode
                ? "bg-dark-900 text-dark-200"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <tr>
              <th className="px-6 py-3">Tên đơn vị</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Số điện thoại</th>
              <th className="px-6 py-3">Địa chỉ</th>
              <th className="px-6 py-3">Ngày đăng ký</th>
              <th className="px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {pendingRegistrations.map((registration) => (
              <tr
                key={registration.id}
                className={`border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <td className="px-6 py-4 font-medium">{registration.name}</td>
                <td className="px-6 py-4">{registration.email}</td>
                <td className="px-6 py-4">{registration.phone}</td>
                <td className="px-6 py-4">{registration.address}</td>
                <td className="px-6 py-4">{registration.createdAt}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleApprove(registration)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Phê duyệt
                  </button>
                  <button
                    onClick={() => handleReject(registration)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Từ chối
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render approved shipping units tab
  const renderApprovedShippingUnits = () => {
    if (shippingUnits.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Không có đơn vị vận chuyển nào</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto rounded-[5px] border">
        <table className="w-full text-sm text-left">
          <thead
            className={`text-xs uppercase ${
              isDarkMode
                ? "bg-dark-900 text-dark-200"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <tr>
              <th className="px-6 py-3">Tên đơn vị</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Số điện thoại</th>
              <th className="px-6 py-3">Địa chỉ</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3">Ngày phê duyệt</th>
              <th className="px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {shippingUnits.map((unit) => (
              <tr
                key={unit.id}
                className={`border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <td className="px-6 py-4 font-medium">{unit.name}</td>
                <td className="px-6 py-4">{unit.email}</td>
                <td className="px-6 py-4">{unit.phone}</td>
                <td className="px-6 py-4">{unit.address}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      unit.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {unit.status === "active" ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </td>
                <td className="px-6 py-4">{unit.approvedAt}</td>
                <td className="px-6 py-4">
                  {unit.status === "active" ? (
                    <button
                      onClick={() => handleDeactivate(unit)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Vô hiệu hóa
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivate(unit)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Kích hoạt
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <ContainerModeLayer1>
      <div className="p-6">
        <h1
          className={`text-2xl font-bold mb-6 ${
            isDarkMode ? "text-dark-100" : "text-light-100"
          }`}
        >
          Quản lý đơn vị vận chuyển
        </h1>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              selectedTab === "pending"
                ? `border-b-2 border-blue-500 ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`
                : `${isDarkMode ? "text-dark-300" : "text-gray-600"}`
            }`}
            onClick={() => setSelectedTab("pending")}
          >
            Đơn đăng ký ({pendingRegistrations.length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              selectedTab === "approved"
                ? `border-b-2 border-blue-500 ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`
                : `${isDarkMode ? "text-gray-400" : "text-gray-600"}`
            }`}
            onClick={() => setSelectedTab("approved")}
          >
            Đơn vị vận chuyển ({shippingUnits.length})
          </button>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Content based on selected tab */}
        {!isLoading && (
          <>
            {selectedTab === "pending" && renderPendingRegistrations()}
            {selectedTab === "approved" && renderApprovedShippingUnits()}
          </>
        )}
      </div>

      {/* Confirm modal component */}
      <ConfirmComponent />
    </ContainerModeLayer1>
  );
};

export default ShippingManager;
