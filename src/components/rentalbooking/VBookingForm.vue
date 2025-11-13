<script setup lang="ts">
import VInput from '../common/VInput.vue'
import VButton from '../common/VButton.vue'
import VDropdown from '../common/VDropdown.vue'
import { type PropType, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { RentalBooking } from '@/interfaces/rentalbooking.interface'

const router = useRouter()

const props = defineProps({
  action: {
    type: Function as PropType<(data: RentalBooking) => Promise<void>>,
    required: true,
  },
  bookingModel: {
    type: Object as PropType<RentalBooking>,
    required: true,
  },
  availableLocations: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])
const model = ref<RentalBooking>({ ...props.bookingModel })

const handleSubmit = async () => {
  await props.action(model.value)
}

const handleCancel = () => router.push('/bookings')

// 💡 toggle include driver
const includeDriver = ref<boolean>(model.value.includeDriver || false)
watch(includeDriver, (val) => (model.value.includeDriver = val))

// 🚘 transmisi radio group
const transmissionOptions = [
  { value: 'Manual', label: 'Manual' },
  { value: 'Automatic', label: 'Automatic' },
]
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto flex flex-col gap-4 font-sans"
  >
    <h2 class="text-xl font-bold text-[#1aa546] mb-4">
      {{ props.isEdit ? 'Update Rental Booking' : 'Create a New Rental Booking' }}
    </h2>

    <!-- Include Driver -->
    <div class="flex items-center gap-2">
      <input
        id="includeDriver"
        type="checkbox"
        v-model="includeDriver"
        class="w-4 h-4 text-[#1aa546] border-gray-300 rounded focus:ring-[#1aa546]"
      />
      <label for="includeDriver" class="text-gray-700 font-medium">Include Driver?</label>
    </div>

    <!-- Pick-up Location -->
    <VDropdown
      id="pickUpLocation"
      label="Pick-up Location"
      v-model="model.pickUpLocation"
      :options="availableLocations.map(l => ({ value: l, label: l }))"
      placeholder="-- Select Pick-up Location --"
    />

    <!-- Drop-off Location -->
    <VDropdown
      id="dropOffLocation"
      label="Drop-off Location"
      v-model="model.dropOffLocation"
      :options="availableLocations.map(l => ({ value: l, label: l }))"
      placeholder="-- Select Drop-off Location --"
    />

    <!-- Pick-up Time -->
    <VInput
      id="pickUpTime"
      type="datetime-local"
      label="Pick-up Time"
      v-model="model.pickUpTime"
    />

    <!-- Drop-off Time -->
    <VInput
      id="dropOffTime"
      type="datetime-local"
      label="Drop-off Time"
      v-model="model.dropOffTime"
    />

    <!-- Capacity Needed -->
    <VInput
      id="capacityNeeded"
      type="number"
      label="Capacity Needed"
      min="1"
      v-model="model.capacityNeeded"
    />

    <!-- Transmission -->
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
            :id="opt.value"
            :value="opt.value"
            v-model="model.transmissionNeeded"
            class="text-[#1aa546] focus:ring-[#1aa546]"
          />
          {{ opt.label }}
        </label>
      </div>
    </div>

    <!-- Action Buttons -->
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
        {{ props.isEdit ? 'Save Changes' : 'Search for Vehicles' }}
      </VButton>
    </div>
  </form>
</template>

<style scoped>
form input,
form select {
  @apply border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#1aa546] focus:outline-none;
}
</style>
