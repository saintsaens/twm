import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { parseMoney } from "../../utils/money";

export const fetchCart = createAsyncThunk('cart/fetchCart', async (userId) => {
    const response = await fetch(`/api/carts/${userId}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
});

export const deleteCart = createAsyncThunk('cart/deleteCart', async (userId) => {
    const response = await fetch(`/api/carts/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ userId, items }) => {
    const validItems = items.filter(item => item.quantity >= 1);
    const response = await fetch(`/api/carts/add/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: validItems }),
    });
    if (!response.ok) {
        throw new Error('Failed to update cart');
    }
    return await response.json();
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({ userId, itemId }) => {
    const response = await fetch(`/api/carts/remove/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId }),
    });
    if (!response.ok) {
        throw new Error('Failed to update cart');
    }
    return await response.json();
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalPrice: 0,
        loading: false,
        error: null,
    },
    reducers: {
        addItems(state, action) {
            const { items, totalPrice } = action.payload;
            items.forEach(({ item_id, quantity = 0 }) => {
                const existingItem = state.items.find(item => item.item_id === item_id);
                existingItem ? existingItem.quantity += quantity : state.items.push({ item_id, quantity });
            });
            state.totalPrice += totalPrice;
        },
        removeItem(state, action) {
            const { itemId } = action.payload;
            state.items = state.items.filter(item => item.item_id !== itemId);
            state.totalPrice = state.items.reduce((total, item) => total + (parseMoney(item.price) * item.quantity), 0);
        },
        clearCart(state) {
            state.items = [];
            state.totalPrice = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null; // Reset error on new request
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.totalPrice = action.payload.reduce((total, item) => total + (parseMoney(item.price) * item.quantity), 0);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Store the error message
            })
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null; // Reset error on new request
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.totalPrice = action.payload.reduce((total, item) => total + (parseMoney(item.price) * item.quantity), 0);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Store the error message
            });
    },
});

export const { addItems, removeItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
