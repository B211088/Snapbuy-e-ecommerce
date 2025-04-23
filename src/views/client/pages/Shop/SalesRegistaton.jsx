import LayoutModeBackground from "../../layout/LayoutModeBackground";
import HeaderFlexibleView from "../../../../components/header/HeaderFlexibleView";
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
    <div className="w-full">
      <HeaderFlexibleView title={"Đăng ký trở thành người bán"} />
      <LayoutModeBackground>
        <Outlet />
      </LayoutModeBackground>
    </div>
  );
};

export default SalesRegistaton;
