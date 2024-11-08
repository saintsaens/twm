import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const baseUrl = process.env.REACT_APP_API_URL;

export const loginUser = createAsyncThunk('auth/loginUser', async (formData) => {
    const response = await fetch(`${baseUrl}/api/login/password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    }
    return await response.json();
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        error: '',
        loading: false,
    },
    reducers: {
        clearError: (state) => {
            state.error = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
