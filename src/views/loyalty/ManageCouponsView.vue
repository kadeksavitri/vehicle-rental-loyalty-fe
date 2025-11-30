<script setup lang="ts">
import { onMounted } from 'vue'
import { useLoyaltyStore } from '@/stores/loyalty/loyalty.store'
import VButton from '@/components/common/VButton.vue'
import VDataTable from '@/components/common/VDataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Coupon } from '@/interfaces/loyalty.interface'

const store = useLoyaltyStore()

onMounted(async () => {
  await store.fetchAllCoupons()
})

const columns: ColumnDef<Coupon>[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Points', accessorKey: 'points' },
  { header: 'Discount %', accessorKey: 'percentOff' },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => null,
  },
]
</script>

<template>
  <main class="pt-24 px-4">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-[#1aa546]">Manage Coupons</h2>
      </div>
      <div class="flex items-center gap-4">
        <router-link to="/loyalty/admin/create">
          <VButton class="bg-[#1aa546] text-white px-6">Create Coupon</VButton>
        </router-link>
      </div>
    </div>

    <VDataTable :data="store.coupons" :columns="columns">
      <template #cell="{ column, cell }">
        <template v-if="column.id === 'actions'">
          <router-link :to="`/loyalty/admin/edit/${cell.row.original.id}`">
            <VButton class="bg-blue-600 text-white text-sm px-4 py-1">Edit</VButton>
          </router-link>
        </template>
        <template v-else>
          {{ cell.getValue() }}
        </template>
      </template>
    </VDataTable>
  </main>
</template>
