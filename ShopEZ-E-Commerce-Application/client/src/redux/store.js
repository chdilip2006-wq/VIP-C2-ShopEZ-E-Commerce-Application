import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: { auth: authReducer, cart: cartReducer }
});

store.subscribe(() => {
  localStorage.setItem("shopezCart", JSON.stringify(store.getState().cart.items));
  const auth = store.getState().auth;
  if (auth.token) {
    localStorage.setItem("shopezAuth", JSON.stringify({ token: auth.token, user: auth.user }));
  } else {
    localStorage.removeItem("shopezAuth");
  }
});
