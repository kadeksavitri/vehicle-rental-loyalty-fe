<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVehicleStore } from '@/stores/vehicle/vehicle.store'
import VButton from '@/components/common/VButton.vue'
import VDeleteVehicleButton from '@/components/vehicle/VDeleteVehicleButton.vue'
import type { Vehicle } from '@/interfaces/vehicle.interface'
import { toast } from 'vue-sonner'

// setup dasar
const route = useRoute()
const router = useRouter()
const store = useVehicleStore()

// reactive data
const vehicle = ref<Vehicle | null>(null)
const loading = ref(true)

// ambil id dari url
const id = route.params.id as string

// ambil data dari store
onMounted(async () => {
  const data = await store.getVehicle(id)
  if (data) {
    vehicle.value = data
  } else {
    toast.error('Kendaraan tidak ditemukan')
    router.push('/vehicles')
  }
  loading.value = false
})

const handleDelete = async () => {
  if (!vehicle.value) return

  const confirmed = confirm('Apakah kamu yakin ingin menghapus kendaraan ini?')
  if (!confirmed) return

  const success = await store.deleteVehicle(vehicle.value.id)

  if (success) {
    toast.success('Vehicle deleted successfully')
    router.push('/vehicles')
  } else {
    toast.error('Failed to delete vehicle')
  }
}


</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 font-sans">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
      <h1 class="text-2xl font-semibold text-[#1aa546] mb-6">Vehicle Rental App</h1>

      <div v-if="loading" class="text-center text-gray-500 py-20">
        Loading vehicle details...
      </div>

      <div v-else-if="vehicle">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800">Vehicle Details</h2>
          <div class="flex gap-2">
            <VButton
                class="bg-[#1aa546] hover:bg-[#007f66] text-white font-semibold px-6 py-2 rounded-lg whitespace-nowrap"
               @click="router.push(`/vehicles/${vehicle.id}/edit`)"
            >
              Update Vehicle Details
            </VButton>
            <VDeleteVehicleButton :vehicle-id="vehicle.id" @deleted="handleDelete" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
          <p><b>Vehicle ID</b><br />{{ vehicle.id }}</p>
          <p><b>Vendor Name</b><br /><span class="font-semibold text-[#1aa546]">{{ vehicle.rentalVendorName }}</span></p>

          <p><b>Vehicle Type</b><br />{{ vehicle.type }}</p>
          <p><b>Vehicle Brand</b><br />{{ vehicle.brand }}</p>

          <p><b>Vehicle Model</b><br />{{ vehicle.model }}</p>
          <p><b>Vehicle Production Year</b><br />{{ vehicle.productionYear }}</p>

          <p><b>Location</b><br /><span class="font-semibold">{{ vehicle.location }}</span></p>
          <p><b>License Plate</b><br />{{ vehicle.licensePlate }}</p>

          <p><b>Capacity</b><br />{{ vehicle.capacity }} orang</p>
          <p><b>Transmission</b><br />{{ vehicle.transmission }}</p>

          <p><b>Fuel Type</b><br />{{ vehicle.fuelType }}</p>
          <p>
            <b>Price per Day</b><br />
            <span class="text-[#1aa546] font-semibold">
              Rp {{ Number(vehicle.price).toLocaleString('id-ID', { minimumFractionDigits: 2 }) }}
            </span>
          </p>

          <p><b>Status</b><br />{{ vehicle.status }}</p>
        </div>

        <div class="mt-8 text-center">
          <VButton
            class="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-8 py-2 rounded-lg"
            @click="router.push('/vehicles')"
          >
            Back
          </VButton>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 py-20">
        Vehicle not found.
      </div>
    </div>
  </div>
</template>
