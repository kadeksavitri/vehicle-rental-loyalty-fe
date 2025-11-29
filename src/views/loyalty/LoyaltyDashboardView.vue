<script setup lang="ts">
import { onMounted } from 'vue'
import { useLoyaltyStore } from '@/stores/loyalty/loyalty.store'
import VButton from '@/components/common/VButton.vue'
import { useAuthStore } from '@/stores/auth/auth.store'

const store = useLoyaltyStore()
const auth = useAuthStore()
const customerId = auth.user?.id ?? ''

onMounted(() => {
  store.fetchPoints(customerId)
})
</script>

<template>
  <main class="pt-24 pb-20 px-4 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold text-[#1aa546]">Loyalty Dashboard</h1>

    <div class="mt-6 p-5 rounded-xl bg-white shadow">
      <p class="text-lg font-semibold">
        Your Loyalty Points:
      </p>
      <p class="text-3xl font-bold mt-2 text-[#1aa546]">{{ store.points }}</p>
    </div>

    <div class="mt-8 grid grid-cols-2 gap-4">
      <router-link to="/loyalty/available">
        <VButton class="bg-[#1aa546] text-white">Available Coupons</VButton>
      </router-link>
      <router-link to="/loyalty/purchased">
        <VButton class="bg-[#1aa546] text-white">My Coupons</VButton>
      </router-link>
    </div>
  </main>
</template>
