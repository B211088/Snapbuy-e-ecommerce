import {
  SET_AUTH,
  SET_AUTH_LOADING,
  SET_AVATAR,
  SET_ROLE,
  UPDATE_AUTH,
} from "../contexts/contants";

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

    case SET_AUTH_LOADING:
      return {
        ...state,
        authLoading: payload,
      };

    default:
      return state;
  }
};
