<!-- views/rentalbooking/RentalBookingView.vue -->

<script setup lang="ts">
import { onMounted, ref, h } from 'vue'
import { useRouter } from 'vue-router'
import { useRentalBookingStore } from '@/stores/rentalbooking/rentalbooking.store'
import type { ColumnDef } from '@tanstack/vue-table'
import type { RentalBooking } from '@/interfaces/rentalbooking.interface'
import VButton from '@/components/common/VButton.vue'
import VDataTable from '@/components/common/VDataTable.vue'

const router = useRouter()
const store = useRentalBookingStore()
const bookings = ref<RentalBooking[]>([])
const loading = ref(true)

onMounted(async () => {
  await store.fetchRentalBookings()
  bookings.value = store.rentalBookings ?? []
  loading.value = false
})

const formatRupiah = (value: number) =>
  'Rp ' + Number(value).toLocaleString('id-ID', { minimumFractionDigits: 2 })

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

const columns: ColumnDef<RentalBooking>[] = [
  {
    header: 'No',
    cell: ({ row }) => row.index + 1,
  },
  {
    header: 'ID',
    accessorKey: 'id',
  },
  {
    header: 'Vehicle ID',
    accessorKey: 'vehicleId',
  },
  {
    header: 'Pick-up Time',
    cell: ({ row }) => formatDateTime(row.original.pickUpTime),
  },
  {
    header: 'Drop-off Time',
    cell: ({ row }) => formatDateTime(row.original.dropOffTime),
  },
  {
    header: 'Pick-up Location',
    accessorKey: 'pickUpLocation',
  },
  {
    header: 'Status',
    accessorKey: 'status',
  },
  {
    header: 'Total Price',
    cell: ({ row }) => formatRupiah(row.original.totalPrice),
  },
  {
    header: 'Action',
    id: 'actions',
    cell: ({ row }) =>
      h(
        VButton,
        {
          class:
            'bg-[#1aa546] hover:bg-[#007f66] text-white font-semibold px-4 py-1 rounded-md text-sm w-20',
          onClick: () => router.push(`/bookings/${row.original.id}`),
        },
        { default: () => 'Detail' }
      ),
  },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 font-sans">
    <h1 class="text-2xl font-bold text-[#1aa546] mb-6 text-center">Booking List</h1>
    <div class="max-w-6xl mx-auto bg-white shadow-lg ring-1 ring-gray-200/70 rounded-2xl p-6">

      <div class="flex flex-wrap justify-between items-center mb-5 gap-3">
        <div class="flex gap-2">
          <RouterLink
            to="/bookings/add"
            class="bg-[#1aa546] hover:bg-[#15903c] text-white font-semibold px-4 py-2 rounded-md"
          >
            Add A New Booking
          </RouterLink>
          <RouterLink
            to="/bookings/statistics"
            class="bg-[#17a2b8] hover:bg-[#117a8b] text-white font-semibold px-4 py-2 rounded-md"
          >
            Statistics
          </RouterLink>
        </div>
      </div>

      <VDataTable
        :data="bookings"
        :columns="columns"
        :page-size="10"
        class="mt-4"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
