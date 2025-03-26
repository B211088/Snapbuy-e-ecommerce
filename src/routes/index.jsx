import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loading from "../views/client/pages/Loading";
import ErrorPage from "../components/Middleware/ErrorPage";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedUser from "./ProtectedUser";
import SalesRegistaton from "../views/client/pages/Shop/SalesRegistaton";
import FormRegisterShop from "../components/SallerShop/FormRegisterShop";
import RegisterSuccess from "../components/SallerShop/RegisterSuccess";
import ShopDashBoard from "../views/client/pages/Shop/ShopDashBoard";
import ProtectedRouteShop from "./ProtectedRouteShop";
import Email from "../components/User/Email";
import ShopProductsManager from "../components/Shop/display/ShopProductsManager";
import ShopHome from "../components/Shop/display/ShopHome";
import ConFirmEmailCode from "../views/client/auth/ConFirmEmailCode";
import ListAllProduct from "../components/Shop/display/ListAllProduct";
import ListLiveProduct from "../components/Shop/display/ListLiveProduct";
import ListBannedProducts from "../components/Shop/display/ListBannedProducts";
import ListReviewing from "../components/Shop/display/ListReviewing";
import ListUnpublistProducts from "../components/Shop/display/ListUnpublistProducts";
import AddProduct from "../components/Shop/display/AddProduct";
import ShopOrderManager from "../components/Shop/display/ShopOrderManager";
import ListOrdersPending from "../components/Shop/display/ListOrdersPending";

const Home = lazy(() => import("../views/client/pages/Home"));
const Login = lazy(() => import("../views/client/auth/Login"));
const Register = lazy(() => import("../views/client/auth/Register"));
const Cart = lazy(() => import("../views/client/pages/User/Cart"));
const UserInfo = lazy(() => import("../views/client/pages/User/UserInfo"));
const ProductDetail = lazy(() =>
  import("../views/client/pages/User/ProductDetail")
);
const Order = lazy(() => import("../components/User/Order"));
const Profile = lazy(() => import("../components/User/Profile"));
const Payment = lazy(() => import("../components/User/Payment"));
const Address = lazy(() => import("../components/User/Address"));
const Voucher = lazy(() => import("../components/User/Voucher"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <Home />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },

  {
    path: "/login",
    element: (
      <ProtectedUser>
        <Suspense fallback={<Loading />}>
          <Login />
        </Suspense>
      </ProtectedUser>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: (
      <ProtectedUser>
        <Suspense fallback={<Loading />}>
          <Register />
        </Suspense>
      </ProtectedUser>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/confirmcode",
    element: (
      <ProtectedUser>
        <Suspense fallback={<Loading />}>
          <ConFirmEmailCode />
        </Suspense>
      </ProtectedUser>
    ),
    errorElement: <ErrorPage />,
  },

  {
    path: "/cart",
    element: (
      <Suspense fallback={<Loading />}>
        <Cart />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/userinfo",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loading />}>
          <UserInfo />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "order",
        element: (
          <Suspense fallback={<Loading />}>
            <Order />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "voucher",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <Voucher />
            </Suspense>
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "account/profile",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "account/email",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <Email />
            </Suspense>
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "account/payment",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <Payment />
            </Suspense>
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "account/address",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <Address />
            </Suspense>
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: "/product/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <ProductDetail />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/salesregistation",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loading />}>
          <SalesRegistaton />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "formregister",
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <FormRegisterShop />
            </Suspense>
          </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "registersuccess/:userId",
        element: (
          <Suspense fallback={<Loading />}>
            <RegisterSuccess />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
    ],
  },
  {
    path: "/shopdashboard",
    element: (
      <ProtectedRouteShop>
        <Suspense fallback={<Loading />}>
          <ShopDashBoard />
        </Suspense>
      </ProtectedRouteShop>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Loading />}>
            <ShopHome />
          </Suspense>
        ),
      },
      {
        path: "products",
        element: (
          <Suspense fallback={<Loading />}>
            <ShopProductsManager />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <ListAllProduct />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: "list/all",
            element: (
              <Suspense fallback={<Loading />}>
                <ListAllProduct />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: "list/live",
            element: (
              <Suspense fallback={<Loading />}>
                <ListLiveProduct />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: "list/reviewing",
            element: (
              <Suspense fallback={<Loading />}>
                <ListReviewing />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: "list/unpublic",
            element: (
              <Suspense fallback={<Loading />}>
                <ListUnpublistProducts />
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
        ],
      },
      {
        path: "products/addproduct",
        element: (
          <ProtectedRouteShop>
            <Suspense fallback={<Loading />}>
              <AddProduct />
            </Suspense>
          </ProtectedRouteShop>
        ),
      },
      {
        path: "products/violation",
        element: (
          <Suspense fallback={<Loading />}>
            <ListBannedProducts />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "orders",
        element: (
          <ProtectedRouteShop>
            <Suspense fallback={<Loading />}>
              <ShopOrderManager />
            </Suspense>
          </ProtectedRouteShop>
        ),
      },
      {
        path: "orders/pending",
        element: (
          <ProtectedRouteShop>
            <Suspense fallback={<Loading />}>
              <ListOrdersPending />
            </Suspense>
          </ProtectedRouteShop>
        ),
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

export default router;
