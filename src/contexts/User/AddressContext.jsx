import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import {
  ADD_ADDRESS,
  apiUrl,
  LOCAL_STORAGE_TOKEN_NAME,
  SET_ADDRESSES,
  SET_DISTRICTS,
  SET_PROVINCES,
  SET_VILLAGES,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
} from "../contants";
import { addressReducer } from "../../reducers/User/AddressReducer";

export const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [addressState, dispatch] = useReducer(addressReducer, {
    provinces: [],
    districts: [],
    villages: [],
  });

  const {
    authState: { roles, user, isAuthenticated },
  } = useContext(AuthContext);

  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);

  const fetchProvinces = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/user_village/get_all_provinces`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        dispatch({ type: SET_PROVINCES, payload: response.data });
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tỉnh:", error);
    }
  };

  const fetchDistricts = async (provinceId) => {
    if (roles?.includes("admin")) return;

    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/user_village/get_all_districts/${provinceId}`
      );
      if (response.status >= 200 && response.status < 300) {
        dispatch({ type: SET_DISTRICTS, payload: response.data });
      }
      return response.data;
    } catch (error) {
      return { success: false, error: error };
    }
  };

  const fetchVillages = async (districtsId) => {
    if (roles?.includes("admin")) return;

    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/user_village/get_all_villages/${districtsId}`
      );
      if (response.status >= 200 && response.status < 300) {
        dispatch({ type: SET_VILLAGES, payload: response.data });
        return response.data;
      }
    } catch (error) {
      return { success: false, error: error };
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  const addAddressReceiver = async (addressData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/user_village/add_user_address`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        dispatch({ type: ADD_ADDRESS, payload: response.data });
        return { success: true, data: response.data };
      }
      return response;
    } catch (error) {
      return { success: false, error: error };
    }
  };

  const updateAddressReceiver = async (userVillageId, addressData) => {
    try {
      if (!token) throw new Error("Token không tồn tại");

      const response = await axios.put(
        `${apiUrl}/api/v1/user_village/update_user_address/${userVillageId}`,
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        dispatch({ type: UPDATE_ADDRESS, payload: response.data });
        return { success: true, data: response.data };
      }

      return response;
    } catch (error) {
      return { success: false, error: error };
    }
  };

  const deleteAddressReceiver = async (addressId, userId) => {
    console.log("addressId", addressId);
    try {
      const response = await axios.delete(
        `${apiUrl}/api/v1/user_village?userAddressId=${addressId}&userId=${userId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status >= 200 && response.status < 300) {
        dispatch({ type: DELETE_ADDRESS, payload: addressId });
        return { success: true, message: response };
      }
      return response;
    } catch (error) {
      return { success: false, error: error };
    }
  };

  return (
    <AddressContext.Provider
      value={{
        addressState,
        fetchVillages,
        fetchProvinces,
        fetchDistricts,
        addAddressReceiver,

        updateAddressReceiver,
        deleteAddressReceiver,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

// Hook tiện ích để dùng AddressContext
export const useAddress = () => useContext(AddressContext);
