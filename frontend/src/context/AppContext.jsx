import React, { createContext, useReducer } from "react";

const initialState = {
  token: localStorage.getItem("token") || "",
  role: localStorage.getItem("role") || "",
  name: localStorage.getItem("name") || "",
  username: localStorage.getItem("username") || "",
  phone: localStorage.getItem("phone") || "",
  email: localStorage.getItem("email") || "",
  profile_pic: localStorage.getItem("profile_pic") || null,
  subscription: localStorage.getItem("subscription") || null,
  request_available: localStorage.getItem("request_available") || null,
};

const AppContext = createContext(initialState);

const appReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", action.payload.role);
      localStorage.setItem("name", action.payload.name);
      localStorage.setItem("username", action.payload.username);
      localStorage.setItem("phone", action.payload.phone);
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("profile_pic", action.payload.profile_pic);
      localStorage.setItem("subscription", action.payload.subscription);
      localStorage.setItem(
        "request_available",
        action.payload.request_available
      );
      return {
        ...state,
        token: action.payload.token,
        role: action.payload.role,
        name: action.payload.name,
        username: action.payload.username,
        phone: action.payload.phone,
        email: action.payload.email,
        profile_pic: action.payload.profile_pic,
        subscription: action.payload.subscription,
        request_available: action.payload.request_available,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("phone");
      localStorage.removeItem("email");
      localStorage.removeItem("profile_pic");
      localStorage.removeItem("subscription");
      localStorage.removeItem("request_available");
      return {
        ...state,
        token: "",
        role: "",
        name: "",
        username: "",
        phone: "",
        email: "",
        profile_pic: null,
        subscription: null,
        request_available: 0,
      };
    default:
      return state;
  }
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AppContext.Provider value={{ ...state, dispatch, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
