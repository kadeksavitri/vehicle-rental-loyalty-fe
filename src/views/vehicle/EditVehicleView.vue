<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVehicleStore } from '@/stores/vehicle/vehicle.store'
import VVehicleForm from '@/components/vehicle/VVehicleForm.vue'
import type { VehicleRequest } from '@/interfaces/vehicle.interface'

// setup
const store = useVehicleStore()
const route = useRoute()
const router = useRouter()

// reactive state
const vehicleModel = ref<VehicleRequest | null>(null)
const loading = ref(true)

// dummy vendor data (bisa ganti nanti dari backend)
const vendors = ref([
  {
    id: 1,
    name: 'Indrajaya, Januar and Winardi',
    listOfLocations: ['DKI Jakarta', 'Bandung', 'Surabaya'],
  },
  {
    id: 2,
    name: 'Auto Maju Rent',
    listOfLocations: ['Bali', 'Yogyakarta', 'Semarang'],
  },
])

// ambil id kendaraan dari route
const id = route.params.id as string

// ambil data kendaraan dari API/store
onMounted(async () => {
  const data = await store.getVehicle(id)
  if (data) {
    vehicleModel.value = { ...data }
  } else {
    router.push('/vehicles')
  }
  loading.value = false
})

// aksi update kendaraan
const handleUpdate = async (data: VehicleRequest) => {
  await store.updateVehicle(data as any)
  router.push('/vehicles')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 font-sans">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
      <h1 class="text-2xl font-semibold text-[#1aa546] mb-6">
        Vehicle Rental App
      </h1>

      <div v-if="loading" class="text-center text-gray-500 py-20">
        Loading vehicle data...
      </div>

      <VVehicleForm
        v-else-if="vehicleModel"
        :vehicleModel="vehicleModel"
        :vendors="vendors"
        :action="handleUpdate"
        :isEdit="true"
      />

      <div v-else class="text-center text-gray-500 py-20">
        Vehicle not found.
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  @apply mb-6;
}
</style>
