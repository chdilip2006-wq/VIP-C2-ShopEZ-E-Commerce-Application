import { createSlice } from "@reduxjs/toolkit";

const initialItems = JSON.parse(localStorage.getItem("shopezCart") || "[]");

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: initialItems },
  reducers: {
    addToCart(state, { payload }) {
      const existing = state.items.find((item) => item._id === payload._id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + (payload.quantity || 1), payload.stockCount);
      } else {
        state.items.push({ ...payload, quantity: payload.quantity || 1 });
      }
    },
    updateQuantity(state, { payload }) {
      const item = state.items.find((entry) => entry._id === payload.id);
      if (item) item.quantity = Math.max(1, Math.min(payload.quantity, item.stockCount));
    },
    removeFromCart(state, { payload }) {
      state.items = state.items.filter((item) => item._id !== payload);
    },
    clearCart(state) {
      state.items = [];
    }
  }
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
