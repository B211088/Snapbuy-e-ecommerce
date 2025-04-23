import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";

// Component loading hiển thị khi chờ tải component chính
import Loading from "../views/client/pages/Loading";

// Middleware và Route Guards (nên để trực tiếp vì không cần lazy)
import ErrorPage from "../components/Middleware/ErrorPage";
import ProtectedRoute from "./ProtectedRoute";
import ProtectedUser from "./ProtectedUser";
import ProtectedRouteShop from "./ProtectedRouteShop";
import Vouchers from "../components/Shop/display/Vouchers";
import ListOrderPackeging from "../components/Shop/display/ListOrderPackeging";
import ShopInfo from "../components/Shop/display/ShopInfo";
import ShopDiscount from "../components/Shop/display/ShopDiscount";
import Finance from "../components/Shop/display/Finance";

// Tất cả các component bên dưới đều dùng lazy
const Home = lazy(() => import("../views/client/pages/Home"));
const Login = lazy(() => import("../views/client/auth/Login"));
const Register = lazy(() => import("../views/client/auth/Register"));
const Cart = lazy(() => import("../views/client/pages/User/Cart"));
const UserInfo = lazy(() => import("../views/client/pages/User/UserInfo"));
const ProductDetail = lazy(() => import("../views/client/pages/ProductDetail"));
const Order = lazy(() => import("../components/User/Order"));
const Profile = lazy(() => import("../components/User/Profile"));
const Payment = lazy(() => import("../components/User/Payment"));
const Address = lazy(() => import("../components/User/Address"));
const Voucher = lazy(() => import("../components/User/Voucher"));
const SendCodeToMail = lazy(() =>
  import("../views/client/auth/SendCodeToMail")
);
const ConFirmEmailCode = lazy(() =>
  import("../views/client/auth/ConfirmEmailCode")
);
const SalesRegistaton = lazy(() =>
  import("../views/client/pages/Shop/SalesRegistaton")
);
const FormRegisterShop = lazy(() =>
  import("../components/SallerShop/FormRegisterShop")
);
const RegisterSuccess = lazy(() =>
  import("../components/SallerShop/RegisterSuccess")
);
const ShopDashBoard = lazy(() =>
  import("../views/client/pages/Shop/ShopDashBoard")
);
const Email = lazy(() => import("../components/User/Email"));
const ShopHome = lazy(() => import("../components/Shop/display/ShopHome"));
const ShopProductsManager = lazy(() =>
  import("../components/Shop/display/ShopProductsManager")
);
const ListAllProduct = lazy(() =>
  import("../components/Shop/display/ListAllProduct")
);
const ListLiveProduct = lazy(() =>
  import("../components/Shop/display/ListLiveProduct")
);
const ListBannedProducts = lazy(() =>
  import("../components/Shop/display/ListBannedProducts")
);
const ListReviewing = lazy(() =>
  import("../components/Shop/display/ListReviewing")
);
const ListUnpublistProducts = lazy(() =>
  import("../components/Shop/display/ListUnpublistProducts")
);
const AddProduct = lazy(() => import("../components/Shop/display/AddProduct"));
const ShopOrderManager = lazy(() =>
  import("../components/Shop/display/ShopOrderManager")
);

const SearchProductByKeyWord = lazy(() =>
  import("../views/client/pages/SearchProductByKeyWord")
);
const CheckoutOrder = lazy(() => import("../views/client/pages/CheckoutOrder"));

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
    path: "/sendcode",
    element: (
      <ProtectedUser>
        <Suspense fallback={<Loading />}>
          <SendCodeToMail />
        </Suspense>
      </ProtectedUser>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        {" "}
        <Suspense fallback={<Loading />}>
          <Cart />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loading />}>
          <CheckoutOrder />
        </Suspense>
      </ProtectedRoute>
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
    path: "/search",
    element: (
      <Suspense fallback={<Loading />}>
        <SearchProductByKeyWord />
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
        path: "orders/shipping",
        element: (
          <ProtectedRouteShop>
            <Suspense fallback={<Loading />}>
              <ListOrderPackeging />
            </Suspense>
          </ProtectedRouteShop>
        ),
      },
      {
        path: "marketing/vouchers",
        element: (
          <ProtectedRouteShop>
            <Suspense fallback={<Loading />}>
              <Vouchers />
            </Suspense>
          </ProtectedRouteShop>
        ),
      },
      {
        path: "marketing/discount",
        element: (
          <ProtectedRouteShop>
            <Suspense fallback={<Loading />}>
              <ShopDiscount />
            </Suspense>
          </ProtectedRouteShop>
        ),
      },
      {
        path: "shopinfo",
        element: (
          <ProtectedRouteShop>
            <Suspense fallback={<Loading />}>
              <ShopInfo />
            </Suspense>
          </ProtectedRouteShop>
        ),
      },
      {
        path: "finance",
        element: (
          <ProtectedRouteShop>
            <Suspense fallback={<Loading />}>
              <Finance />
            </Suspense>
          </ProtectedRouteShop>
        ),
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

export default router;
