import { create } from 'zustand';
import axios from 'axios';
const API_URL = `https://backend-rho-sable.vercel.app/api/auth`;
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  // signup fnc
  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      console.log(res.data);
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error Signing up',
        isLoading: false,
      });
      throw error;
    }
  },

  // verify-email fnc
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      console.log(response.data);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error Verifying Email',
        isLoading: false,
      });
      throw error;
    }
  },

  // fetch user data fnc and check
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: null, isAuthenticated: false, isCheckingAuth: false });
      throw error;
    }
  },
  // login fnc
  login: async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      console.log(res.data);
      set({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error Signing up',
        isLoading: false,
      });
      throw error;
    }
  },
  // logout fnc
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      // console.log(error);
      set({ error: 'Error logging out', isLoading: false });
      throw error;
    }
  },
  // forget password fnc
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data?.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          'Error sending reset password email ',
      });
      throw error;
    }
  },
  // reset password fnc
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ isLoading: false, message: response?.data?.message });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Error resetting password',
      });
      throw error;
    }
  },
}));
