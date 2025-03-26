import axios from "axios";
import { createContext, useReducer, useEffect, useContext } from "react";
import { authReducer } from "../../reducers/User/AuthReducer";
import setAuthToken from "../../utils/User/setAuthToken";
import {
  apiUrl,
  LOCAL_STORAGE_TOKEN_NAME,
  LOCAL_STORAGE_USER,
  SET_AUTH,
  SET_AUTH_LOADING,
  SET_AVATAR,
  SET_ROLE,
  UPDATE_AUTH,
} from "../../contexts/contants";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    authLoading: true,
    isAuthenticated: false,
    user: null,
    roles: null,
  });

  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);

  const loadUser = async () => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);

    if (!token) {
      dispatch({
        type: SET_AUTH,
        payload: { isAuthenticated: false, user: null },
      });
      return;
    }

    setAuthToken(token);

    try {
      const userId = localStorage.getItem(LOCAL_STORAGE_USER);
      const response = await axios.get(
        `${apiUrl}/api/v1/user/get_user_info/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        const userData = response.data;
        dispatch({
          type: SET_AUTH,
          payload: { isAuthenticated: true, user: userData },
        });
        dispatch({
          type: SET_ROLE,
          payload: userData.roles,
        });
        return;
      } else {
        throw new Error("Unauthorized");
      }
    } catch (error) {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);

      setAuthToken(null);
      dispatch({
        type: SET_AUTH,
        payload: { isAuthenticated: false, user: null },
      });
    }
  };

  const loginUser = async (userForm) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/user/login`,
        userForm
      );

      if (response.status >= 200 && response.status < 300) {
        const userData = response.data;
        localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.token);
        localStorage.setItem(LOCAL_STORAGE_USER, response.data.user.id);
        setAuthToken(response.data.token);
        dispatch({
          type: SET_AUTH,
          payload: { isAuthenticated: true, user: userData },
        });
        dispatch({
          type: SET_ROLE,
          payload: userData.roles,
        });
        dispatch({ type: SET_AUTH_LOADING, payload: false });
        await loadUser();
        return response;
      }
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const registerUser = async (userForm) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/user/register`,
        userForm
      );

      if (response.status >= 200 && response.status < 300) {
        return { success: true, message: response.data };
      }
      return { success: false, message: response };
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
    localStorage.removeItem("user");
    setAuthToken(null);
    dispatch({
      type: SET_AUTH,
      payload: { isAuthenticated: false, user: null },
    });
    dispatch({ type: SET_ROLE, payload: null });
  };

  const updateUserInfo = async (userId, updatedData) => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
    try {
      if (!token) return { success: false, message: "Bạn chưa đăng nhập" };

      const response = await axios.put(
        `${apiUrl}/api/v1/user/update_user_info/${userId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        const updatedUser = response.data;

        dispatch({ type: UPDATE_AUTH, payload: updatedUser });
        return {
          success: true,
          message: "Cập nhật thông tin người dùng thành công",
        };
      } else {
        throw new Error("Cập nhật thông tin thất bại");
      }
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  };

  const registerShop = async (userId, formRegisterData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/shop/register/${userId}`,
        formRegisterData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        dispatch({ type: SET_ROLE, payload: ["user", "shop"] });
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  };

  const sendCodeToEmail = async (userId, email) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/user_code/send_code?userId=${userId}&email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        return { success: true, message: response };
      }
      return response;
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  };

  const confirmEmail = async (userId, payload) => {
    if (!payload) {
      console.log("Không có code");
      return { success: false, message: "Không có code" };
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/user_code/user/confirm_code/${userId}`,
        payload
      );

      if (response.status >= 200 && response.status < 300) {
        return { success: true, message: response };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  };

  const uploadAvatar = async (userId, imageFile) => {
    if (!imageFile) return { success: false, message: "Chưa chọn ảnh" };

    console.log("Uploading avatar:", imageFile);

    try {
      dispatch({ type: SET_AUTH_LOADING, payload: true });

      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await axios.post(
        `${apiUrl}/api/v1/user/update_avatar/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        dispatch({ type: SET_AVATAR, payload: response.data.avatar_url });
        return { success: true, data: response.data };
      } else {
        throw new Error("Cập nhật ảnh đại diện thất bại");
      }
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      return error.response?.data || { success: false, message: error.message };
    } finally {
      dispatch({ type: SET_AUTH_LOADING, payload: false });
    }
  };

  const sendMailForRegister = async (email) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/user_code/send_code?email=${email}`
      );
      if (response.status >= 200 && response.status < 300) {
        return { success: true, message: response.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  };

  const confirmCodeMailForRegister = async (formData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/user_code/confirm_code`,
        formData
      );
      if (response.status >= 200 && response.status < 300) {
        return { success: true, message: response.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return error.response?.data || { success: false, message: error.message };
    }
  };

  const authContextData = {
    loadUser,
    loginUser,
    registerUser,
    logoutUser,
    updateUserInfo,
    authState,
    registerShop,
    sendCodeToEmail,
    confirmEmail,
    uploadAvatar,
    sendMailForRegister,
    confirmCodeMailForRegister,
  };

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
