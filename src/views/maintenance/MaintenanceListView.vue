<script setup lang="ts">
import { ref, onMounted, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import VDataTable from '@/components/common/VDataTable.vue'
import VButton from '@/components/common/VButton.vue'
import { useMaintenanceStore } from '@/stores/maintenance/maintenance.store'
import { useAuthStore } from '@/stores/auth/auth.store'
import type { ColumnDef } from '@tanstack/vue-table'
import type { MaintenanceRecordResponseDTO } from '@/interfaces/maintenance.interface'

const router = useRouter()
const store = useMaintenanceStore()
const auth = useAuthStore()

const searchKeyword = ref('')
const statusFilter = ref('All')

const STATUS_OPTIONS = ['All', 'Ongoing', 'Completed']

onMounted(async () => {
  await store.fetchAll()
})

// format rupiah
const formatRupiah = (n: number) => `Rp ${n.toLocaleString('id-ID', { minimumFractionDigits: 0 })}`

// format datetime
const formatDateTime = (iso: string) => {
  const date = new Date(iso)
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const filtered = computed(() => {
  let items = store.records ?? []

  // filter by status
  if (statusFilter.value !== 'All') {
    items = items.filter((i) => i.status === statusFilter.value)
  }

  // filter by search keyword
  if (searchKeyword.value) {
    const q = searchKeyword.value.toLowerCase()
    items = items.filter(
      (i) =>
        i.id.toLowerCase().includes(q) ||
        i.vehicleId.toLowerCase().includes(q) ||
        (i.vehicleDisplay ?? '').toLowerCase().includes(q) ||
        (i.description ?? '').toLowerCase().includes(q),
    )
  }
  return items
})

const openCreate = () => router.push('/maintenance/add')
const openDetail = (id: string) => router.push(`/maintenance/${id}`)

const columns: ColumnDef<MaintenanceRecordResponseDTO>[] = [
  {
    header: 'No',
    id: 'no',
    cell: () => null,
  },
  { header: 'ID', accessorKey: 'id' },
  { header: 'Vehicle ID', accessorKey: 'vehicleId' },
  {
    header: 'Service Date',
    accessorKey: 'serviceDate',
    id: 'serviceDate',
    cell: () => null,
  },
  { header: 'Description', accessorKey: 'description' },
  {
    header: 'Cost',
    accessorKey: 'cost',
    id: 'cost',
    cell: () => null,
  },
  {
    header: 'Status',
    accessorKey: 'status',
    id: 'status',
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
    <h1 class="text-2xl font-bold text-[#1aa546] mb-6 text-center">Maintenance Records</h1>
    <div class="max-w-6xl mx-auto bg-white shadow-lg ring-1 ring-gray-200/70 rounded-2xl p-6">
      <!-- Button Row -->
      <div class="flex flex-wrap justify-between items-center mb-5 gap-3">
        <div class="flex gap-2">
          <button
            @click="openCreate"
            class="bg-[#1aa546] hover:bg-[#15903c] text-white font-semibold px-4 py-2 rounded-md"
          >
            Add A New Maintenance
          </button>
        </div>

        <div class="flex gap-3 items-center">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="Search maintenance..."
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1aa546] focus:outline-none"
          />
          <select
            v-model="statusFilter"
            class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#1aa546]"
          >
            <option v-for="status in STATUS_OPTIONS" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
        </div>
      </div>

      <!-- Data Table -->
      <VDataTable :data="filtered" :columns="columns" :page-size="5">
        <template #cell="{ column, cell }">
          <template v-if="column.id === 'no'">
            <span>{{ cell.row.index + 1 }}</span>
          </template>
          <template v-else-if="column.id === 'serviceDate'">
            <span>{{ formatDateTime(cell.row.original.serviceDate) }}</span>
          </template>
          <template v-else-if="column.id === 'cost'">
            <span>{{ formatRupiah(cell.row.original.cost || 0) }}</span>
          </template>
          <template v-else-if="column.id === 'status'">
            <span
              :class="
                cell.row.original.status === 'Completed'
                  ? 'text-green-600 font-semibold'
                  : 'text-orange-500 font-semibold'
              "
            >
              {{ cell.row.original.status }}
            </span>
          </template>
          <template v-else-if="column.id === 'actions'">
            <button
              @click="() => openDetail(cell.row.original.id)"
              class="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-4 rounded-md"
            >
              Detail
            </button>
          </template>
          <template v-else>
            {{ cell.getValue() }}
          </template>
        </template>
      </VDataTable>
    </div>
  </div>
</template>
