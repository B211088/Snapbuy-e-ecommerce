import LayoutModeBackground from "../../layout/LayoutModeBackground";
import HeaderFlexibleView from "../../../../components/Header/HeaderFlexibleView";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../../../contexts/User/AuthContext";

const SalesRegistaton = () => {
  const navigate = useNavigate();
  const {
    authState: { roles },
  } = useAuth();

  useEffect(() => {
    if (roles?.includes("shop")) {
      navigate("/shopdashboard");
    }
  });
  return (
    <LayoutModeBackground>
      <HeaderFlexibleView title={"Đăng ký trở thành người bán"} />
      <Outlet />
    </LayoutModeBackground>
  );
};

export default SalesRegistaton;
