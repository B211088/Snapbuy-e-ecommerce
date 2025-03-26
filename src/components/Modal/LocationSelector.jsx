import React, { useEffect, useState } from "react";
import { useAddress } from "../../contexts/User/AddressContext";
import { useTheme } from "../../Provider/ThemeProvider";

const LocationSelector = ({ localAddress, onChange }) => {
  const { isDarkMode } = useTheme();
  const {
    fetchDistricts,
    fetchVillages,
    addressState: { provinces, districts, villages },
  } = useAddress();

  const { province, district, village } = localAddress;

  const [localDistricts, setLocalDistricts] = useState([]);
  const [localVillages, setLocalVillages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (province) {
        const response = await fetchDistricts(province);
        if (response) {
          setLocalDistricts(response);
        }
      } else {
        setLocalDistricts([]);
      }
    };
    fetchData();
  }, [province]);

  useEffect(() => {
    const fetchData = async () => {
      if (district) {
        const response = await fetchVillages(district);
        if (response) {
          setLocalVillages(response);
        }
      } else {
        setLocalVillages([]);
      }
    };
    fetchData();
  }, [district]);

  const handleChange = (field, value) => {
    onChange({ ...localAddress, [field]: value });
  };

  return (
    <div className="w-full flex flex-col gap-[10px]">
      <select
        className={`w-full outline-none py-[8px] px-[5px] rounded-[5px] cursor-pointer text-[0.9rem] ${
          isDarkMode
            ? "bg-transparent border-[1px]"
            : "bg-dark-400 text-light-100"
        }`}
        onChange={(e) => handleChange("province", e.target.value)}
        value={province || ""}
      >
        <option value="">Chọn tỉnh</option>
        {provinces.map((province) => (
          <option key={province.id} value={province.id}>
            {province.name}
          </option>
        ))}
      </select>

      {/* Chọn Huyện */}
      <select
        className={`w-full outline-none py-[8px] px-[5px] rounded-[5px] cursor-pointer text-[0.9rem] ${
          isDarkMode
            ? "bg-transparent border-[1px]"
            : "bg-dark-400 text-light-100"
        }`}
        onChange={(e) => handleChange("district", e.target.value)}
        value={localAddress.district || ""}
        disabled={!localDistricts.length}
      >
        <option value="">Chọn huyện</option>
        {localDistricts.map((district) => (
          <option key={district.id} value={district.id}>
            {district.name}
          </option>
        ))}
      </select>

      {/* Chọn Xã */}
      <select
        className={`w-full outline-none py-[8px] px-[5px] rounded-[5px] cursor-pointer text-[0.9rem] ${
          isDarkMode
            ? "bg-transparent border-[1px]"
            : "bg-dark-400 text-light-100"
        }`}
        onChange={(e) => handleChange("village", e.target.value)}
        value={localAddress.village || ""}
        disabled={!localVillages.length}
      >
        <option value="">Chọn xã/phường</option>
        {localVillages.map((village) => (
          <option key={village.id} value={village.id}>
            {village.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector;
