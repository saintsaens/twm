import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from "./features/itemsSlice";
import userReducer from "./features/userSlice";

const store = configureStore({
  reducer: {
    items: itemsReducer,
    user: userReducer,
  },
});

export default store;
