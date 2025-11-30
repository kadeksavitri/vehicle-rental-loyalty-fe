<!-- <script setup lang="ts">
import { onMounted } from 'vue'
import { useLoyaltyStore } from '@/stores/loyalty/loyalty.store'
import VButton from '@/components/common/VButton.vue'
import VDataTable from '@/components/common/VDataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'

const store = useLoyaltyStore()

onMounted(() => store.fetchAllCoupons())

const columns: ColumnDef<any>[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Points', accessorKey: 'points' },
  { header: 'Discount', accessorKey: 'percentOff' },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => ({ row })
  }
]
</script>

<template>
  <main class="pt-24 px-4">
    <h2 class="text-xl font-bold text-[#1aa546] mb-4">Coupon List</h2>

    <router-link to="/loyalty/admin/create">
      <VButton class="bg-[#1aa546] text-white w-40 mb-4">Create Coupon</VButton>
    </router-link>

    <VDataTable :data="store.coupons" :columns="columns">
      <template #default="{ column, row }">
        <template v-if="column.id === 'actions'">
          <router-link :to="`/loyalty/admin/edit/${row.original.id}`">
            <VButton class="bg-blue-600 text-white">Edit</VButton>
          </router-link>
        </template>
      </template>
    </VDataTable>
  </main>
</template> -->
