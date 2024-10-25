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
        rarityFilter: "All",
        typeFilter: "All",
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null
    },
    reducers: {
        setTypeFilter: (state, action) => {
            state.typeFilter = action.payload;
        },
        setRarityFilter: (state, action) => {
            state.rarityFilter = action.payload;
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
            .addCase(fetchItems.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
})

export const { setRarityFilter, setTypeFilter, increment, decrement } = itemsSlice.actions

export default itemsSlice.reducer
