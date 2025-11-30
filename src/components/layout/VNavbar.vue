<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router'
import { isAuthenticated } from '@/lib/rbac'
import { getCurrentUser } from '@/lib/auth'
import VLogoutButton from '../auth/VLogoutButton.vue'
import VButton from '../common/VButton.vue'


const router = useRouter()
const userId = getCurrentUser()?.id

const getLinkClass = (path: string) => router.currentRoute.value.path.startsWith(path)
</script>

<template>
  <nav class="bg-white border-b border-gray-200 px-10 py-3 flex justify-between items-center font-sans">
    <RouterLink to="/" class="text-[#1aa546] font-bold text-lg hover:opacity-90 transition">
      Vehicle Rental App
    </RouterLink>

    <div v-if="isAuthenticated()" class="flex space-x-8">
      <RouterLink to="/vehicles" class="font-semibold transition-colors":class="getLinkClass('/vehicles') ? 'text-[#1aa546]' : 'text-gray-600 hover:text-[#147e35]'" > 
        Vehicles 
      </RouterLink>
      <RouterLink to="/bookings" class="font-semibold transition-colors" :class="getLinkClass('/bookings') ? 'text-[#1aa546]' : 'text-gray-600 hover:text-[#147e35]'">
        Bookings
      </RouterLink>
      <RouterLink to="/" class="font-semibold transition-colors" :class="getLinkClass('/bookings') ? 'text-[#1aa546]' : 'text-gray-600 hover:text-[#147e35]'">
        Coupons
      </RouterLink>
    </div>

    <div class="ml-auto">
      <div v-if="isAuthenticated()">
        <VLogoutButton />
      </div>
        <RouterLink v-else to="/login" :class="getLinkClass('/login')">
          <VButton class="bg-[#1aa546] hover:bg-[#147e35] text-white px-4 py-2 rounded-xs">
            Login
          </VButton>
        </RouterLink>
    </div>
  </nav>
</template>
