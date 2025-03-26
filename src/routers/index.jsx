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
import CategoriesManager from "../component/Display/CategoriesManager";
import ProductsManager from "../component/Display/ProductsManager";

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
      },
      {
        path: "categoriesmanagement",
        element: (
          <ProtectedAuth>
            <Suspense>
              <CategoriesManager />
            </Suspense>
          </ProtectedAuth>
        ),
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
      },
    ],
  },
]);

export default router;
