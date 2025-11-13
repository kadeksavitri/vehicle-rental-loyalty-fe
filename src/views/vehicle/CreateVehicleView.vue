<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useVehicleStore } from '@/stores/vehicle/vehicle.store'
import type { VehicleRequest } from '@/interfaces/vehicle.interface'
import VVehicleForm from '@/components/vehicle/VVehicleForm.vue'

// store dan router
const store = useVehicleStore()
const router = useRouter()

// data awal vehicle baru
const newVehicle = ref<VehicleRequest>({
  id: '',
  rentalVendorId: 0,
  rentalVendorName: '',
  type: '',
  brand: '',
  model: '',
  productionYear: new Date().getFullYear(),
  location: '',
  licensePlate: '',
  capacity: 0,
  transmission: '',
  fuelType: '',
  price: 0,
  status: 'Available',
})

// dummy vendor (sementara) — bisa nanti diganti dari API
const vendors = ref([
  {
    id: 1,
    name: 'Indrajaya, Januar and Winardi',
    listOfLocations: ['Jakarta', 'Bandung', 'Surabaya'],
  },
  {
    id: 2,
    name: 'Auto Maju Rent',
    listOfLocations: ['Bali', 'Semarang', 'Yogyakarta'],
  },
])

// aksi simpan data kendaraan baru
const handleCreate = async (data: VehicleRequest) => {
  try {
    await store.createVehicle(data)
    router.push('/vehicles')
  } catch (err) {
    console.error('Gagal membuat kendaraan:', err)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 font-sans">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
      <h1 class="text-2xl font-semibold text-[#1aa546] mb-6">
        Vehicle Rental App
      </h1>

      <VVehicleForm
        :vehicleModel="newVehicle"
        :vendors="vendors"
        :action="handleCreate"
        :isEdit="false"
      />
    </div>
  </div>
</template>

<style scoped>
h1 {
  @apply mb-6;
}
</style>
