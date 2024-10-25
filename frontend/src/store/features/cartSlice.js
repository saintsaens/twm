import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (userId) => {
    const response = await fetch(`/api/carts/${userId}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalPrice: 0,
    },
    reducers: {
        addItems(state, action) {
            const {items , totalPrice } = action.payload;
            items.forEach(({ item_id, quantity = 0}) => {
                const existingItem = state.items.find(item => item.item_id === item_id);
                existingItem ? existingItem.quantity += quantity : state.items.push({ item_id, quantity });
            });
            
            state.totalPrice += totalPrice;
        },
        removeItems(state, action) {
            const itemsToRemove = action.payload; // Expecting an array of item_ids
            itemsToRemove.forEach(itemId => {
                state.items = state.items.filter(item => item.item_id !== itemId);
            });
            state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        },
        clearCart(state) {
            state.items = [];
            state.totalPrice = 0;
        },
    },
});

export const { addItems, removeItems, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
