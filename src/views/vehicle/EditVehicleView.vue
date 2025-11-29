<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVehicleStore } from '@/stores/vehicle/vehicle.store'
import { useVendorStore } from '@/stores/additional/vendor.store'
import VVehicleForm from '@/components/vehicle/VVehicleForm.vue'
import type { UpdateVehicleRequest } from '@/interfaces/vehicle.interface'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()

const vehicleStore = useVehicleStore()
const vendorStore = useVendorStore()

const id = route.params.id as string

const vehicleData = ref<UpdateVehicleRequest | null>(null)

onMounted(async () => {
  await vendorStore.fetchVendors()

  const data = await vehicleStore.getVehicle(id)

  if (!data) {
    toast.error("Kendaraan tidak ditemukan")
    return router.push('/vehicles')
  }

  if (data.status === "In Use") {
    toast.error("Kendaraan tidak dapat diubah karena sedang digunakan (In Use)")
    return router.push(`/vehicles/${id}`)
  }

  vehicleData.value = {
    id: data.id,
    rentalVendorId: data.rentalVendorId,
    rentalVendorName: data.rentalVendorName,
    type: data.type,
    brand: data.brand,
    model: data.model,
    productionYear: data.productionYear,
    location: data.location,
    licensePlate: data.licensePlate,
    capacity: data.capacity,
    transmission: data.transmission,
    fuelType: data.fuelType,
    price: data.price,
    status: data.status,
  }
})

const vendors = computed(() => vendorStore.vendors)

const handleUpdate = async (updated: UpdateVehicleRequest) => {
  const currentYear = new Date().getFullYear()
  if (updated.productionYear > currentYear) {
    toast.error('Tahun produksi tidak boleh lebih dari tahun saat ini')
    return
  }

  // check license plate uniqueness (exclude current vehicle)
  if (vehicleStore.vehicles.length === 0) {
    await vehicleStore.fetchVehicles()
  }
  const conflict = vehicleStore.vehicles.find(v => v.licensePlate === updated.licensePlate && v.id !== updated.id)
  if (conflict) {
    toast.error('License plate key constraint tidak unik')
    return
  }

  const success = await vehicleStore.updateVehicle(updated)

  if (success) {
    toast.success("Kendaraan berhasil diperbarui")
    router.push(`/vehicles/${updated.id}`)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 font-sans">
    <div v-if="vehicleData">
      <VVehicleForm
        :vehicleModel="vehicleData"
        :vendors="vendors"
        :action="handleUpdate"
        :isEdit="true"
      />
    </div>
  </div>
</template>
