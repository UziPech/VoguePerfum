import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: string;
    email: string;
    role: 'admin' | 'customer';
    name?: string;
    avatar_url?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const storedUser = localStorage.getItem('user');
const initialState: AuthState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User; token: string }>
        ) => {
            const { user, token } = action.payload;
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
