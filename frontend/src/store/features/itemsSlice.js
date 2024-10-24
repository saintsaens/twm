import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
    const response = await fetch('/api/items/');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
});


export const itemsSlice = createSlice({
    name: 'items',
    initialState: {
        items: [],
        filter: "All",
    },
    reducers: {
        setFilter: (state, action) => {
            state.filter = action.payload;
        },
        increment: (state, action) => {
            const item = state.items.find(item => item.id === action.payload.itemId);
            if (item) {
                item.quantity = (item.quantity || 0) + 1;
            }
        },
        decrement: (state, action) => {
            const item = state.items.find(item => item.id === action.payload.itemId);
            if (item) {
                item.quantity = Math.max(0, (item.quantity || 0) - 1); // Prevent negative quantities
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                console.error('Fetch items failed:', action.error.message);
            });
    },
})

// Action creators are generated for each case reducer function
export const { setFilter, increment, decrement } = itemsSlice.actions

export default itemsSlice.reducer
