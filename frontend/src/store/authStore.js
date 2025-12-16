import { create } from 'zustand';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
const API_URL = `${BASE_URL}/api/auth`;

export const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    // Load user from token on startup
    loadUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ isLoading: false });
            return;
        }

        try {
            const res = await axios.get(`${API_URL}/me`, {
                headers: { 'x-auth-token': token }
            });
            set({ user: res.data, isAuthenticated: true, isLoading: false });
        } catch (err) {
            console.error(err);
            localStorage.removeItem('token');
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    login: async (email, password) => {
        try {
            set({ error: null });
            const res = await axios.post(`${API_URL}/login`, { email, password });

            localStorage.setItem('token', res.data.token);
            set({ user: res.data.user, isAuthenticated: true });
            return true;
        } catch (err) {
            set({ error: err.response?.data?.msg || 'Login failed' });
            return false;
        }
    },

    register: async (username, email, password) => {
        try {
            set({ error: null });
            const res = await axios.post(`${API_URL}/register`, { username, email, password });

            localStorage.setItem('token', res.data.token);
            // After register we might verify token or just log them in
            // For now, let's load user to get full profile
            await get().loadUser();
            return true;
        } catch (err) {
            set({ error: err.response?.data?.msg || 'Registration failed' });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
    },

    updateBudget: async (newLimit) => {
        try {
            // Optimistic update
            set((state) => ({
                user: { ...state.user, budgetLimit: newLimit }
            }));

            const token = localStorage.getItem('token');
            // Assuming the user routes are under /api/user, based on server.js
            await axios.put(`${BASE_URL}/api/user/settings`,
                { budgetLimit: newLimit },
                { headers: { 'x-auth-token': token } }
            );
            return true;
        } catch (err) {
            console.error('Failed to update budget settings:', err);
            return false;
        }
    }
}));

