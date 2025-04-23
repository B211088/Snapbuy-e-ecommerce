import React from "react";
import { useShippingProvider } from "../../../../contexts/User/ShippingContext";
import { useTheme } from "../../../../Provider/ThemeProvider";
import { useAuth } from "../../../../contexts/User/AuthContext";

const ShippingProvider = () => {
  const {
    authState: { user },
  } = useAuth();
  const { isDarkMode } = useTheme();
  const {
    shippingState: { orders },
    getOrdersByStatus,
  } = useShippingProvider();
  return <div>ShippingProvider</div>;
};

export default ShippingProvider;
