<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/auth.store';
import type { LoginRequest } from '@/interfaces/auth.interface';

const router = useRouter();
const authStore = useAuthStore();

const loginData = ref<LoginRequest>({
  username: '',
  password: '',
});

const handleLogin = async () => {
  await authStore.login(loginData.value);
  
  if (!authStore.error) {
    router.push('/');
  }
};
</script>

<template>
  <main class="w-full min-h-screen bg pt-24 py-10 px-4 overflow-y-auto">
    <div class="mx-auto w-full max-w-md bg-white shadow-lg ring-1 ring-gray-200/70 rounded-2xl p-6 md:p-8 flex flex-col gap-4"
    >
      <h1 class="text-[#1aa546] font-bold text-2xl text-center">Login</h1>
      
      <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            id="username"
            v-model="loginData.username"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#147c35]"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            v-model="loginData.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#147c35]"
          />
        </div>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full bg-[#1aa546] text-white py-2 px-4 rounded-lg hover:bg-[#147c35] focus:outline-none focus:ring-2 focus:ring-[#147c35] disabled:opacity-50 font-medium"
        >
          {{ authStore.loading ? 'Logging in...' : 'Login' }}
        </button>

        <p class="text-center text-sm text-gray-600">
          Don't have an account? 
          <RouterLink to="/register" class="text-[#1aa546] hover:text-[#147c35] font-medium">
            Register
          </RouterLink>
        </p>
      </form>
    </div>
  </main>
</template>
