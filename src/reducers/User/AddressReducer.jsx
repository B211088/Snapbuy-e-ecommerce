import {
  SET_DISTRICTS,
  SET_PROVINCES,
  SET_VILLAGES,
} from "../../contexts/contants";

export const addressReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_PROVINCES:
      return { ...state, provinces: payload };

    case SET_DISTRICTS:
      return { ...state, districts: payload };

    case SET_VILLAGES:
      return { ...state, villages: payload };

    default:
      return state;
  }
};
