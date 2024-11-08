import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const baseUrl = process.env.REACT_APP_API_URL;

export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
    const response = await fetch(`${baseUrl}/api/items`);
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
        setQuantity: (state, action) => {
            const { itemId, quantity } = action.payload;
            const item = state.items.find(item => item.id === itemId);
            if (item) {
                item.quantity = Math.max(0, quantity); // Ensure quantity is non-negative
            }
        },
        clearSelection(state) {
            state.items.forEach(item => item.quantity = 0);
            state.totalPrice = 0;
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

export const { setRarityFilter, setTypeFilter, setQuantity, clearSelection } = itemsSlice.actions

export default itemsSlice.reducer
