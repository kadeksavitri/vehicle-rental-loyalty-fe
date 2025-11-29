import type { LoginRequest } from '../../interfaces/auth.interface';
import type { CommonResponseInterface } from '@/interfaces/common.response.interface';
import type { CurrentUser } from '@/interfaces/profile.interface';
import { defineStore } from 'pinia';
import apiClient from '@/lib/api';
import { toast } from 'vue-sonner';

import {
  setLocalStorage,
  getAuthToken,
  getCurrentUser
} from '@/lib/auth';

const basePostUrl = import.meta.env.VITE_API_URL + '/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: getCurrentUser(),
    token: getAuthToken(),
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // User login
    async login(payload: LoginRequest) {
      try {
        this.loading = true;
        const response = await apiClient.post<
          CommonResponseInterface<{ token: string } & CurrentUser>
        >(`/auth/login`, payload);

        const respData = response.data.data;

        this.token = respData.token;
        const { token, ...userFields } = respData;
        if (userFields && (userFields as any).role) {
          (userFields as any).roleName = (userFields as any).role;
        }
        this.user = userFields as CurrentUser;

        toast.success(response.data.message || 'Login successful');
        this.error = null;

        localStorage.setItem('token', this.token);
        setLocalStorage('user', this.user);
      } catch (error) {
          const errMsg = error instanceof Error ? error.message : 'Unknown error';
          const axiosError = error as any;
          if (axiosError?.response?.status === 401) {
            this.error = 'Invalid credentials or profile service unavailable';
          } else {
            this.error = errMsg;
          }
          console.error('Login error:', axiosError?.response?.data || error);
          toast.error(`Login failed: ${this.error}`);
      } finally {
          this.loading = false;
      }
    },

    async logout() {
      try {
        this.loading = true;

        // Clear both token and user from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.user = null;
        this.token = null;

        toast.success('Logout successful');
        this.error = null;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Error saat logout: ${this.error}`);
      } finally {
        this.loading = false;
      }
    },

  },
});
