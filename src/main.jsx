import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./Provider/ThemeProvider.jsx";
import { AuthContextProvider } from "./contexts/User/AuthContext.jsx";
import { ShopContextProvider } from "./contexts/User/ShopContext.jsx";
import { AppDataProvider } from "./contexts/client/AppDataContext.jsx";
import router from "./routes/index.jsx";
import { AddressProvider } from "./contexts/User/AddressContext.jsx";
import { NotifyProvider } from "./components/Notify/NotifyModal.jsx";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <NotifyProvider>
      <AppDataProvider>
        <ShopContextProvider>
          <AddressProvider>
            <ThemeProvider>
              <RouterProvider router={router} />
            </ThemeProvider>
          </AddressProvider>
        </ShopContextProvider>
      </AppDataProvider>
    </NotifyProvider>
  </AuthContextProvider>
);
