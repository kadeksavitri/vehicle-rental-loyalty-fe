<script setup lang="ts">
import { onMounted } from 'vue'
import { useLoyaltyStore } from '@/stores/loyalty/loyalty.store'
import VButton from '@/components/common/VButton.vue'
import VDataTable from '@/components/common/VDataTable.vue'
import { useAuthStore } from '@/stores/auth/auth.store'
import { isSuperadmin, isCustomer } from '@/lib/rbac'
import type { ColumnDef } from '@tanstack/vue-table'

const store = useLoyaltyStore()
const auth = useAuthStore()
const customerId = auth.user?.id ?? ''

onMounted(() => {
  if (isCustomer()) {
    store.fetchPoints(customerId)
    store.fetchPurchasedCoupons(customerId)
  }
})

const columns: ColumnDef<any>[] = [
  { header: 'Code', accessorKey: 'code' },
  { header: 'Coupon ID', accessorKey: 'couponId' },
  { header: 'Purchased Date', accessorKey: 'purchasedDate' },
  { header: 'Used Date', accessorKey: 'usedDate' },
]
</script>

<template>
  <main class="pt-24 pb-20 px-4 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold text-[#1aa546]">Loyalty Dashboard</h1>

    <div v-if="isCustomer()" class="mt-6 p-5 rounded-xl bg-white shadow">
      <p class="text-lg font-semibold">Your Loyalty Points:</p>
      <p class="text-3xl font-bold mt-2 text-[#1aa546]">{{ store.points }}</p>
    </div>

    <!-- Customer View -->
    <div v-if="isCustomer()" class="mt-8">
      <router-link to="/loyalty/available">
        <VButton class="bg-[#1aa546] text-white">Available Coupons</VButton>
      </router-link>

      <div class="mt-8">
        <h2 class="text-xl font-bold text-[#1aa546] mb-6">My Purchased Coupons</h2>
        <VDataTable :data="store.purchasedCoupons" :columns="columns" />
      </div>
    </div>
  </main>
</template>