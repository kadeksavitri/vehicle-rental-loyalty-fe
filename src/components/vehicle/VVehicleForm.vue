<script setup lang="ts">
import VInput from '../common/VInput.vue'
import VButton from '../common/VButton.vue'
import VDropdown from '../common/VDropdown.vue'
import { type PropType, ref, watch, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import type { VehicleRequest } from '@/interfaces/vehicle.interface'

// Stores
import { useLocationStore } from '@/stores/additional/location.store'
import { useVendorStore } from '@/stores/additional/vendor.store'

// Props
const props = defineProps({
  action: {
    type: Function as PropType<(data: VehicleRequest) => Promise<void>>,
    required: true,
  },
  vehicleModel: {
    type: Object as PropType<VehicleRequest>,
    required: true,
  },
  vendors: {
    /* Format vendor dari backend:
        {
          id: number,
          name: string,
          listOfLocations: string[]
        }
    */
    type: Array as PropType<
      { id: number; name: string; listOfLocations: string[] }[]
    >,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()
const model = toRefs(props).vehicleModel

// 🔥 Lokasi dinamis berdasarkan vendor yang dipilih
const availableLocations = ref<string[]>([])

watch(
  () => model.value.rentalVendorId,
  (vendorId) => {
    const vendor = props.vendors.find((v) => v.id === Number(vendorId))
    availableLocations.value = vendor?.listOfLocations ?? []

    // Reset location kalau tidak masuk list vendor
    if (!availableLocations.value.includes(model.value.location ?? '')) {
      model.value.location = ''
    }
  },
  { immediate: true }
)

// STATIC OPTIONS
const typeOptions = [
  { value: 'Sedan', label: 'Sedan' },
  { value: 'SUV', label: 'SUV' },
  { value: 'MPV', label: 'MPV' },
  { value: 'Luxury', label: 'Luxury' },
]

const transmissionOptions = [
  { value: 'Manual', label: 'Manual' },
  { value: 'Automatic', label: 'Automatic' },
]

const fuelOptions = [
  { value: 'Bensin', label: 'Bensin' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'Listrik', label: 'Listrik' },
]

const statusOptions = [
  { value: 'Available', label: 'Available' },
  { value: 'Unavailable', label: 'Unavailable' },
  { value: 'In Use', label: 'In Use' },
]

// ACTIONS
const handleSubmit = async () => {
  await props.action(model.value)
}

const handleCancel = () => router.push('/vehicles')
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto flex flex-col gap-4 font-sans"
  >
    <h2 class="text-xl font-bold text-[#1aa546] mb-4">
      {{ props.isEdit ? 'Update Vehicle' : 'Create a New Vehicle' }}
    </h2>

    <div class="border-b border-gray-500 -mt-6"></div>

    <!-- Vendor -->
    <VDropdown
      id="vendor"
      label="Rental Vendor"
      v-model="model.rentalVendorId"
      :options="props.vendors.map(v => ({ value: v.id, label: v.name }))"
      placeholder="-- Select Vendor --"
    />

    <!-- Vehicle Type -->
    <VDropdown
      id="type"
      label="Vehicle Type"
      v-model="model.type"
      :options="typeOptions"
      placeholder="-- Select Type --"
    />

    <!-- Brand -->
    <VInput id="brand" label="Vehicle Brand" v-model="model.brand" placeholder="Enter brand" />

    <!-- Model -->
    <VInput id="model" label="Vehicle Model" v-model="model.model" placeholder="Enter model" />

    <!-- Production Year -->
    <VInput
      id="productionYear"
      label="Production Year"
      type="number"
      min="1990"
      :max="new Date().getFullYear().toString()"
      v-model="model.productionYear"
    />

    <!-- Location -->
    <VDropdown
      id="location"
      label="Location"
      v-model="model.location"
      :options="availableLocations.map(loc => ({ value: loc, label: loc }))"
      placeholder="-- Select Location --"
    />

    <!-- License Plate -->
    <VInput
      id="licensePlate"
      label="License Plate"
      v-model="model.licensePlate"
      placeholder="Enter license plate"
    />

    <!-- Capacity -->
    <VInput
      id="capacity"
      label="Capacity"
      type="number"
      min="1"
      v-model="model.capacity"
      placeholder="Enter capacity"
    />

    <!-- Transmission -->
    <VDropdown
      id="transmission"
      label="Transmission"
      v-model="model.transmission"
      :options="transmissionOptions"
      placeholder="-- Select Transmission --"
    />

    <!-- Fuel Type -->
    <VDropdown
      id="fuelType"
      label="Fuel Type"
      v-model="model.fuelType"
      :options="fuelOptions"
      placeholder="-- Select Fuel Type --"
    />

    <!-- Price -->
    <VInput
      id="price"
      label="Price per Day"
      type="number"
      min="0"
      v-model="model.price"
      placeholder="Enter price"
    />

    <!-- Status (edit only) -->
    <VDropdown
      v-if="props.isEdit"
      id="status"
      label="Status"
      v-model="model.status"
      :options="statusOptions"
      placeholder="-- Select Status --"
    />

    <!-- Actions -->
    <div class="flex justify-center gap-5 mt-6">
      <VButton
        type="button"
        class="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg w-32"
        @click.prevent="handleCancel"
      >
        Cancel
      </VButton>
      <VButton
        type="submit"
        class="bg-[#1aa546] hover:bg-[#007f66] text-white font-semibold px-6 py-2 rounded-lg w-32"
      >
        Save
      </VButton>
    </div>
  </form>
</template>
