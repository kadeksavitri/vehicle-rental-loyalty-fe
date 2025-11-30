<script setup lang="ts">
import { ref, onMounted, h, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useVehicleStore } from '@/stores/vehicle/vehicle.store'
import VDataTable from '@/components/common/VDataTable.vue'
import VButton from '@/components/common/VButton.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Vehicle } from '@/interfaces/vehicle.interface'
import { canCreateVehicle } from '@/lib/rbac'

const vehicleStore = useVehicleStore()
const searchKeyword = ref('')
const filterType = ref('All')

const VEHICLE_TYPES = ['All', 'SUV', 'MPV', 'Sedan', 'Luxury']

onMounted(async () => {
  await vehicleStore.fetchVehicles()
})

// format harga
const formatRupiah = (n: number) => `Rp ${n.toLocaleString('id-ID', { minimumFractionDigits: 0 })}`

// filter data by search + type
const filteredVehicles = computed(() => {
  return vehicleStore.vehicles.filter((v) => {
    const keywordMatch =
      v.brand.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      v.model.toLowerCase().includes(searchKeyword.value.toLowerCase())

    const typeMatch = filterType.value === 'All' || v.type === filterType.value

    return keywordMatch && typeMatch
  })
})

const columns: ColumnDef<Vehicle>[] = [
  {
    header: 'No',
    cell: ({ row }) => h('span', {}, row.index + 1),
  },
  { header: 'ID', accessorKey: 'id' },
  { header: 'Type', accessorKey: 'type' },
  { header: 'Brand', accessorKey: 'brand' },
  { header: 'Model', accessorKey: 'model' },
  { header: 'Capacity', accessorKey: 'capacity' },
  {
    header: 'Status',
    accessorKey: 'status',
    id: 'status',
    cell: () => null,
  },
  {
    header: 'Price per Day',
    accessorKey: 'price',
    id: 'price',
    cell: () => null,
  },
  {
    header: 'Action',
    id: 'actions',
    cell: () => null,
  },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 font-sans">
    <h1 class="text-2xl font-bold text-[#1aa546] mb-6 text-center">Vehicle List</h1>
    <div class="max-w-6xl mx-auto bg-white shadow-lg ring-1 ring-gray-200/70 rounded-2xl p-6">
      <!-- Button Row -->
      <div class="flex flex-wrap justify-between items-center mb-5 gap-3">
        <div class="flex gap-2">
          <RouterLink
            v-if="canCreateVehicle()"
            to="/vehicles/add"
            class="bg-[#1aa546] hover:bg-[#15903c] text-white font-semibold px-4 py-2 rounded-md"
          >
            Add A New Vehicle
          </RouterLink>
          <RouterLink
            to="/bookings/statistics"
            class="bg-[#17a2b8] hover:bg-[#117a8b] text-white font-semibold px-4 py-2 rounded-md"
          >
            Statistics
          </RouterLink>
        </div>

        <div class="flex gap-3 items-center">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="Search vehicles..."
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1aa546] focus:outline-none"
          />
          <select
            v-model="filterType"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1aa546]"
          >
            <option v-for="type in VEHICLE_TYPES" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>
      </div>

      <!-- Data Table -->
      <VDataTable :data="filteredVehicles" :columns="columns" :page-size="5">
        <template #cell="{ column, cell }">
          <template v-if="column.id === 'status'">
            <span
              :class="
                cell.row.original.status === 'Available'
                  ? 'text-green-600 font-semibold'
                  : 'text-red-500 font-semibold'
              "
            >
              {{ cell.row.original.status }}
            </span>
          </template>
          <template v-else-if="column.id === 'price'">
            <span>{{ formatRupiah(cell.row.original.price) }}</span>
          </template>
          <template v-else-if="column.id === 'actions'">
            <RouterLink
              :to="`/vehicles/${cell.row.original.id}`"
              class="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-4 rounded-md inline-block"
            >
              Detail
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
