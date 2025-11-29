<script setup lang="ts">
import VInput from '../common/VInput.vue'
import VButton from '../common/VButton.vue'
import VDropdown from '../common/VDropdown.vue'
import { ref, toRefs, watch, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import type { CreateRentalBookingRequest } from '@/interfaces/rentalbooking.interface'
import type { Vehicle } from '@/interfaces/vehicle.interface'

const props = defineProps({
  action: {
    type: Function as PropType<(data: CreateRentalBookingRequest) => Promise<void>>,
    required: true,
  },
  bookingModel: {
    type: Object as PropType<CreateRentalBookingRequest>,
    required: true,
  },
  availableLocations: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  isEdit: {
    type: Boolean,
    default: false,
  }
})

const model = ref(props.bookingModel)

watch(
  () => props.bookingModel,
  (newVal) => {
    model.value = newVal
  },
  { deep: true }
)
watch(model, (v) => emit('update:modelValue', v), { deep: true })

// nver use
const showResults = ref<boolean>(false)
const selectedVehicle = ref<Vehicle | null>(null)
const summary = ref<CreateRentalBookingRequest | null>(null)

const emit = defineEmits(['update:modelValue'])

watch(model, (v) => emit('update:modelValue', v), { deep: true })

const router = useRouter()

const handleSubmit = async () => {
  await props.action(model.value)
}

const handleCancel = () => router.push('/bookings')

const includeDriver = ref<boolean>(model.value.includeDriver || false)

watch(includeDriver, (val) => {
  model.value.includeDriver = val
})

const transmissionOptions = [
  { value: 'Manual', label: 'Manual' },
  { value: 'Automatic', label: 'Automatic' },
]
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto flex flex-col gap-4 font-sans border-1 border-gray-200"
  >
    <h2 class="text-xl font-bold text-[#1aa546] mb-4">
      {{ props.isEdit ? 'Update Rental Booking' : 'Create a New Rental Booking' }}
    </h2>  
    
    <div class="border-b border-gray-500 -mt-6"></div>

    <div class="flex items-center gap-2 mt-4">
      <input
        id="includeDriver"
        type="checkbox"
        v-model="includeDriver"
        class="w-4 h-4 text-[#1aa546] border-gray-300 rounded focus:ring-[#1aa546]"
      />
      <label for="includeDriver" class="text-gray-700 font-medium">
        Include Driver?
      </label>
    </div>

    <VDropdown
      id="pickUpLocation"
      label="Pick-up Location"
      v-model="model.pickUpLocation"
      :options="availableLocations.map(loc => ({ value: loc, label: loc }))"
      placeholder="-- Select Pick-up Location --"
    />

    <VDropdown
      id="dropOffLocation"
      label="Drop-off Location"
      v-model="model.dropOffLocation"
      :options="availableLocations.map(loc => ({ value: loc, label: loc }))"
      placeholder="-- Select Drop-off Location --"
    />

    <VInput
      id="pickUpTime"
      type="datetime-local"
      label="Pick-up Time"
      v-model="model.pickUpTime"
    />

    <VInput
      id="dropOffTime"
      type="datetime-local"
      label="Drop-off Time"
      v-model="model.dropOffTime"
    />

    <VInput
      id="capacityNeeded"
      type="number"
      label="Capacity Needed"
      min="1"
      v-model="model.capacityNeeded"
    />

    <div class="flex flex-col gap-2">
      <label class="font-semibold text-[#1aa546]">Transmission</label>
      <div class="flex gap-4">
        <label
          v-for="opt in transmissionOptions"
          :key="opt.value"
          class="flex items-center gap-2"
        >
          <input
            type="radio"
            :value="opt.value"
            v-model="model.transmissionNeeded"
            class="text-[#1aa546] focus:ring-[#1aa546]"
          />
          {{ opt.label }}
        </label>
      </div>
    </div>

    <div class="flex justify-center gap-5 mt-6">
      <VButton
        type="submit"
        class="bg-[#1aa546] hover:bg-[#007f66] text-white font-semibold px-6 py-2 rounded-lg w-32"
      >
        Search for Vehicles
      </VButton>
    </div>
  </form>
</template>
