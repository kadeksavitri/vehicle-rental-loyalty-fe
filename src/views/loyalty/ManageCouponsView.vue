<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useLoyaltyStore } from '@/stores/loyalty/loyalty.store'
import VButton from '@/components/common/VButton.vue'
import VDataTable from '@/components/common/VDataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Coupon } from '@/interfaces/loyalty.interface'

const store = useLoyaltyStore()
const searchKeyword = ref('')

onMounted(async () => {
  await store.fetchAllCoupons()
})

const filteredCoupons = computed(() => {
  if (!searchKeyword.value) return store.coupons
  const q = searchKeyword.value.toLowerCase()
  return store.coupons.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.points.toString().includes(q) ||
      c.percentOff.toString().includes(q),
  )
})

const columns: ColumnDef<Coupon>[] = [
  {
    header: 'No',
    id: 'no',
    cell: () => null,
  },
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
  <div class="min-h-screen bg-gray-50 p-6 font-sans">
    <h1 class="text-2xl font-bold text-[#1aa546] mb-6 text-center">Manage Coupons</h1>
    <div class="max-w-6xl mx-auto bg-white shadow-lg ring-1 ring-gray-200/70 rounded-2xl p-6">
      <!-- Button Row -->
      <div class="flex flex-wrap justify-between items-center mb-5 gap-3">
        <div class="flex gap-2">
          <RouterLink
            to="/loyalty/admin/create"
            class="bg-[#1aa546] hover:bg-[#15903c] text-white font-semibold px-4 py-2 rounded-md"
          >
            Create Coupon
          </RouterLink>
        </div>

        <div class="flex gap-3 items-center">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="Search coupons..."
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1aa546] focus:outline-none"
          />
        </div>
      </div>

      <!-- Data Table -->
      <VDataTable :data="filteredCoupons" :columns="columns" :page-size="5">
        <template #cell="{ column, cell }">
          <template v-if="column.id === 'no'">
            <span>{{ cell.row.index + 1 }}</span>
          </template>
          <template v-else-if="column.id === 'actions'">
            <RouterLink
              :to="`/loyalty/admin/edit/${cell.row.original.id}`"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded-md inline-block"
            >
              Edit
            </RouterLink>
          </template>
          <template v-else>
            {{ cell.getValue() }}
          </template>
        </template>
      </VDataTable>
    </div>
  </div>
</template>
