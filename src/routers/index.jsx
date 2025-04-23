import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import AdminDashBoard from "../views/pages/AdminDashBoard";
import Loading from "../middleware/Loading";
import ErrorPage from "../middleware/ErrorPage";
import ProtectedAuth from "./Protected/ProtectedAuth";
import Login from "../views/auth/Login";
import ProtectedRoute from "./Protected/ProtectedRoute";
import UsersManager from "../component/Display/UsersManager";
import Home from "../component/Display/Home";
import SelllersManager from "../component/Display/SellersManager";

import ProductsManager from "../component/Display/ProductsManager";
import IndustryManager from "../component/Display/IndustryManager";
import Category from "../component/Display/Category";
import AttributeManager from "../component/Display/AttributeManager";
import FinnanceManager from "../component/Display/FinnanceManager";
import ShippingManager from "../component/Display/ShippingManager";

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <ProtectedRoute>
        <Suspense>
          <Login fallback={<Loading />} />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedAuth>
        <Suspense>
          <AdminDashBoard fallback={<Loading />} />
        </Suspense>
      </ProtectedAuth>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: (
          <ProtectedAuth>
            <Suspense>
              <Home />
            </Suspense>
          </ProtectedAuth>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "usersmanagement",
        element: (
          <ProtectedAuth>
            <Suspense>
              <UsersManager />
            </Suspense>
          </ProtectedAuth>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "sellersmanagement",
        element: (
          <ProtectedAuth>
            <Suspense>
              <SelllersManager />
            </Suspense>
          </ProtectedAuth>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "industrysmanagement",
        element: (
          <ProtectedAuth>
            <Suspense>
              <IndustryManager />
            </Suspense>
          </ProtectedAuth>
        ),
        children: [
          {
            path: "categories",
            element: (
              <ProtectedAuth>
                <Suspense>
                  <Category />
                </Suspense>
              </ProtectedAuth>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: "attributes",
            element: (
              <ProtectedAuth>
                <Suspense>
                  <AttributeManager />
                </Suspense>
              </ProtectedAuth>
            ),
            errorElement: <ErrorPage />,
          },
        ],
        errorElement: <ErrorPage />,
      },
      {
        path: "produtsmanagement",
        element: (
          <ProtectedAuth>
            <Suspense>
              <ProductsManager />
            </Suspense>
          </ProtectedAuth>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/financemanagement/sellers",
        element: (
          <ProtectedAuth>
            <Suspense>
              <FinnanceManager />
            </Suspense>
          </ProtectedAuth>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/shippingmanagement",
        element: (
          <ProtectedAuth>
            <Suspense>
              <ShippingManager />
            </Suspense>
          </ProtectedAuth>
        ),
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

export default router;
