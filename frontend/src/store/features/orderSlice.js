// store/features/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const baseUrl = process.env.REACT_APP_API_URL;

export const fetchOrder = createAsyncThunk(
    'orders/fetchOrder',
    async (orderId) => {
        const response = await fetch(`${baseUrl}/api/orders/${orderId}`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        return data;
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        order: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
            })
            .addCase(fetchOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default orderSlice.reducer;
