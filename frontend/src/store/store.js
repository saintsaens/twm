import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from "./features/itemsSlice";
import userReducer from "./features/userSlice";
import authReducer from "./features/authSlice";
import cartReducer from "./features/cartSlice";
import ordersReducer from "./features/ordersSlice";
import orderReducer from "./features/orderSlice";

const store = configureStore({
  reducer: {
    items: itemsReducer,
    user: userReducer,
    auth: authReducer,
    cart: cartReducer,
    orders: ordersReducer,
    order: orderReducer,
  },
});

export default store;
