import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const baseUrl = process.env.REACT_APP_API_URL;

// Create an order
export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async ({ userId, totalPrice, items, nickname }) => {
        const response = await fetch(`${baseUrl}/api/orders/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, totalPrice, items, nickname }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    }
);

// Fetch all orders for a user
export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (userId) => {
        const response = await fetch(`${baseUrl}/api/orders?user=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle createOrder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders.push(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle fetchOrders
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload; // Replace orders with fetched orders
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default orderSlice.reducer;
