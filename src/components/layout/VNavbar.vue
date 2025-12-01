<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router'
import { isAuthenticated, canViewVehicles, canAccessCouponPages, isSuperadmin } from '@/lib/rbac'
import { useAuthStore } from '@/stores/auth/auth.store'
import VLogoutButton from '../auth/VLogoutButton.vue'
import VButton from '../common/VButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const getLinkClass = (path: string) => router.currentRoute.value.path.startsWith(path)

const getCouponLink = () => {
  return isSuperadmin() ? '/loyalty/manage' : '/loyalty'
}
</script>

<template>
  <nav
    class="bg-white border-b border-gray-200 px-10 py-3 flex justify-between items-center font-sans"
  >
    <RouterLink to="/" class="text-[#1aa546] font-bold text-lg hover:opacity-90 transition">
      Vehicle Rental App
    </RouterLink>

    <div v-if="isAuthenticated()" class="flex space-x-8 ml-10">
      <RouterLink
        v-if="canViewVehicles()"
        to="/vehicles"
        class="font-semibold transition-colors"
        :class="getLinkClass('/vehicles') ? 'text-[#1aa546]' : 'text-gray-600 hover:text-[#147e35]'"
      >
        Vehicles
      </RouterLink>
      <RouterLink
        v-if="canViewVehicles()"
        to="/maintenance"
        class="font-semibold transition-colors"
        :class="
          getLinkClass('/maintenance') ? 'text-[#1aa546]' : 'text-gray-600 hover:text-[#147e35]'
        "
      >
        Maintenance
      </RouterLink>
      <RouterLink
        to="/bookings"
        class="font-semibold transition-colors"
        :class="getLinkClass('/bookings') ? 'text-[#1aa546]' : 'text-gray-600 hover:text-[#147e35]'"
      >
        Bookings
      </RouterLink>
      <RouterLink
        v-if="canAccessCouponPages()"
        :to="getCouponLink()"
        class="font-semibold transition-colors"
        :class="getLinkClass('/loyalty') ? 'text-[#1aa546]' : 'text-gray-600 hover:text-[#147e35]'"
      >
        Coupons
      </RouterLink>
    </div>

    <div class="ml-auto">
      <div v-if="isAuthenticated()" class="flex items-center gap-4">
        <div class="text-sm text-gray-700">
          <span class="font-semibold mr-2">{{ authStore.user?.username }}</span>
          <span class="text-gray-500"
            >({{ authStore.user?.roleName || authStore.user?.role }})</span
          >
        </div>
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