import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const baseUrl = process.env.REACT_APP_API_URL;

export const createUser = createAsyncThunk('auth/createUser', async ({ username, password }, { rejectWithValue }) => {
    try {
        const response = await fetch(`${baseUrl}/api/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return rejectWithValue(errorData.message || 'Failed to create an account.');
        }

        return await response.json();
    } catch (error) {
        return rejectWithValue('An error occurred while creating your account.');
    }
});

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
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = '';
                state.successMessage = '';
            })
            .addCase(createUser.fulfilled, (state) => {
                state.loading = false;
                state.successMessage = 'Account created successfully! Please log in.';
            })
            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
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
