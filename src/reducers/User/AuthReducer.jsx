import {
  ADD_ADDRESS,
  ADD_PRODUCT_TO_CART,
  CANCLE_ORDER,
  DELETE_ADDRESS,
  SET_ADDRESSES,
  SET_ALL_CART,
  SET_ALL_ORDERS,
  SET_AUTH,
  SET_AUTH_LOADING,
  SET_AVATAR,
  SET_ROLE,
  UPDATE_ADDRESS,
  UPDATE_AUTH,
} from "../../contexts/contants";

export const authReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_AUTH:
      return {
        ...state,
        authLoading: false,
        isAuthenticated: payload.isAuthenticated,
        user: payload.user,
      };
    case UPDATE_AUTH:
      return {
        ...state,
        user: {
          ...state.user,
          ...payload,
        },
      };
    case SET_ROLE:
      return {
        ...state,
        roles: payload,
      };
    case SET_AVATAR:
      return {
        ...state,
        user: {
          ...state.user,
          avatar_url: payload,
        },
      };

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

    case SET_AUTH_LOADING:
      return {
        ...state,
        authLoading: payload,
      };

    default:
      return state;
  }
};

export const cartReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_ALL_CART:
      return {
        ...state,
        authLoading: false,
        carts: payload,
      };

    case ADD_PRODUCT_TO_CART:
      return {
        ...state,
        carts: [...state.carts, payload],
      };
  }
};

export const ordersReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_ALL_ORDERS:
      return {
        ...state,
        authLoading: false,
        orders: payload,
      };

    case CANCLE_ORDER: {
      const updatedOrders = state.orders.map((order) => {
        if (order.id === payload.orderId) {
          return {
            ...order,
            status: "cancelled",
          };
        }
        return order;
      });

      return {
        ...state,
        orders: updatedOrders,
      };
    }
  }
};
