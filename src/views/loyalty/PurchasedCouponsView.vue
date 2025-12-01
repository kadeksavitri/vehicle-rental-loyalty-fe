<script setup lang="ts">
import { onMounted } from 'vue'
import { useLoyaltyStore } from '@/stores/loyalty/loyalty.store'
import { useAuthStore } from '@/stores/auth/auth.store'
import VDataTable from '@/components/common/VDataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'

const store = useLoyaltyStore()
const auth = useAuthStore()
const customerId = auth.user?.id ?? ''

onMounted(() => store.fetchPurchasedCoupons(customerId))

const columns: ColumnDef<any>[] = [
  { header: 'Code', accessorKey: 'code' },
  { header: 'Coupon ID', accessorKey: 'couponId' },
  { header: 'Purchased Date', accessorKey: 'purchasedDate' },
  { header: 'Used Date', accessorKey: 'usedDate' }
]
</script>

<template>
  <main class="pt-24 px-4">
    <h2 class="text-xl font-bold text-[#1aa546] mb-6">My Purchased Coupons</h2>
    <VDataTable :data="store.purchasedCoupons" :columns="columns" />
  </main>
</template>