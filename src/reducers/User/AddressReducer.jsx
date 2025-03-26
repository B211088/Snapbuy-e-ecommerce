import {
  SET_ADDRESSES,
  SET_DISTRICTS,
  SET_PROVINCES,
  ADD_ADDRESS,
  SET_VILLAGES,
  UPDATE_ADDRESS,
  DELETE_ADDRESS,
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

    case SET_ADDRESSES:
      return { ...state, addresses: payload };

    case ADD_ADDRESS:
      return { ...state, addresses: [...state.addresses, payload] };

    case UPDATE_ADDRESS:
      return {
        ...state,
        addresses: state.addresses.map((address) =>
          address.address_id === payload.address_id
            ? { ...address, ...payload }
            : address
        ),
      };

    case DELETE_ADDRESS:
      return {
        ...state,
        addresses: state.addresses.filter(
          (address) => address.address_id !== payload
        ),
      };

    default:
      return state;
  }
};
