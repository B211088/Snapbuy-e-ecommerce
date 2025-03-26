import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./Provider/ThemeProvider.jsx";
import { RouterProvider } from "react-router-dom";
import router from "./routers/index.jsx";
import { AuthContextProvider } from "./contexts/AuthContext.jsx";
import { CategoriesContextProvider } from "./contexts/CategoriesContext.jsx";
import { NotifyProvider } from "./component/Notify/NotifyModal.jsx";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <ThemeProvider>
      <CategoriesContextProvider>
        <NotifyProvider>
          <RouterProvider router={router} />
        </NotifyProvider>
      </CategoriesContextProvider>
    </ThemeProvider>
  </AuthContextProvider>
);
