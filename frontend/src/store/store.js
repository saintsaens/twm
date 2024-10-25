import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from "./features/itemsSlice";
import userReducer from "./features/userSlice";
import authReducer from "./features/authSlice";

const store = configureStore({
  reducer: {
    items: itemsReducer,
    user: userReducer,
    auth: authReducer,
  },
});

export default store;
