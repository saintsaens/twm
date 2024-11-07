import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
    const response = await fetch('/api/user/profile', { credentials: 'include' });
    if (response.ok) {
        const data = await response.json();
        return ({
            userId: data.id,
            username: data.username,
        });
    }
    throw new Error('Not logged in');
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userId: '',
        username: '',
        status: 'idle',
        error: null
    },
    reducers: {
        clearUser: (state) => {
            state.username = '';
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.username = action.payload.username;
                state.userId = action.payload.userId;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { clearUser } = userSlice.actions;

export default userSlice.reducer;
