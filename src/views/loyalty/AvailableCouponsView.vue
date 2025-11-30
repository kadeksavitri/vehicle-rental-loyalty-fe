<!-- <script setup lang="ts">
import { onMounted } from 'vue'
import { useLoyaltyStore } from '@/stores/loyalty/loyalty.store'
import { useAuthStore } from '@/stores/auth/auth.store'
import VButton from '@/components/common/VButton.vue'
import VDataTable from '@/components/common/VDataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'

const store = useLoyaltyStore()
const auth = useAuthStore()
const customerId = auth.user?.id ?? ''

onMounted(() => store.fetchAllCoupons())

const columns: ColumnDef<any>[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Points', accessorKey: 'points' },
  { header: 'Discount %', accessorKey: 'percentOff' },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => ({
      row
    })
  }
]

const buy = (id: string) => store.purchaseCoupon(customerId, id)
</script>

<template>
  <main class="pt-24 px-4">
    <h2 class="text-xl font-bold text-[#1aa546] mb-6">Available Coupons</h2>

    <VDataTable :data="store.coupons" :columns="columns">
      <template #cell-actions="{ row }">
        <VButton class="bg-[#1aa546] text-white" @click="buy(row.original.id)">
          Buy
        </VButton>
      </template>
    </VDataTable>
  </main>
</template> -->
