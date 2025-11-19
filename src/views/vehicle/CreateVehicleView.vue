<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { toast } from 'vue-sonner'
import { useVendorStore } from '@/stores/additional/vendor.store'
import { useRouter } from 'vue-router'
import { useVehicleStore } from '@/stores/vehicle/vehicle.store'
import type { VehicleRequest } from '@/interfaces/vehicle.interface'
import VVehicleForm from '@/components/vehicle/VVehicleForm.vue'
import { useLocationStore } from '@/stores/additional/location.store'

// store dan router
const vehicleStore = useVehicleStore()
const locationStore = useLocationStore()
const vendorStore = useVendorStore()
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


onMounted(async () => {
  await vendorStore.fetchVendors()
})
const vendors = computed(() => vendorStore.vendors)

// aksi simpan data kendaraan baru
const handleCreate = async (data: VehicleRequest) => {
  try {
    const currentYear = new Date().getFullYear()
    if (data.productionYear > currentYear) {
      toast.error('Tahun produksi tidak boleh lebih dari tahun saat ini')
      return
    }

    // ensure we have vehicle list to check license plate uniqueness locally
    if (vehicleStore.vehicles.length === 0) {
      await vehicleStore.fetchVehicles()
    }
    const exists = vehicleStore.vehicles.find(v => v.licensePlate === data.licensePlate)
    if (exists) {
      toast.error('License plate key constraint tidak unik')
      return
    }

    await vehicleStore.createVehicle(data)
    router.push('/vehicles')
  } catch (err) {
    console.error('Gagal membuat kendaraan:', err)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 font-sans">

      <VVehicleForm
        :vehicleModel="newVehicle"
        :vendors="vendors"
        :action="handleCreate"
        :isEdit="false"
      />
  </div>
</template>

<style scoped>

</style>
