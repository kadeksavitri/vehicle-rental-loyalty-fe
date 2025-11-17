<script setup lang="ts">
import VInput from '../common/VInput.vue'
import VButton from '../common/VButton.vue'
import VDropdown from '../common/VDropdown.vue'
import { ref, toRefs, watch, type PropType } from 'vue'
import { useRouter } from 'vue-router'
import type { CreateRentalBookingRequest } from '@/interfaces/rentalbooking.interface'

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
  },
})

const model = toRefs(props).bookingModel

const emit = defineEmits(['update:modelValue'])

watch(
  model, () => {
    emit('update:modelValue', { ...props.bookingModel })},
  { deep: true }
)

const router = useRouter()

const handleSubmit = async () => {
  await props.action(props.bookingModel)
}

const handleCancel = () => router.push('/bookings')

const includeDriver = ref<boolean>(props.bookingModel.includeDriver || false)

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
    class="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto flex flex-col gap-4 font-sans"
  >
    <!-- Include Driver -->
    <div class="flex items-center gap-2">
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

    <!-- Pick-up Location -->
    <VDropdown
      id="pickUpLocation"
      label="Pick-up Location"
      v-model="model.pickUpLocation"
      :options="availableLocations.map(loc => ({ value: loc, label: loc }))"
      placeholder="-- Select Pick-up Location --"
    />

    <!-- Drop-off Location -->
    <VDropdown
      id="dropOffLocation"
      label="Drop-off Location"
      v-model="model.dropOffLocation"
      :options="availableLocations.map(loc => ({ value: loc, label: loc }))"
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

    <!-- Transmission Needed -->
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

    <!-- ACTION BUTTONS -->
    <div class="flex justify-center gap-5 mt-6">
      <VButton
        type="submit"
        class="bg-[#1aa546] hover:bg-[#007f66] text-white font-semibold px-6 py-2 rounded-lg w-32"
      >
        {{ isEdit ? 'Save Changes' : 'Search for Vehicles' }}
      </VButton>
    </div>

    <!-- AVAILABLE VEHICLES + SUMMARY (ONE CONTAINER) -->
      <div  class="bg-white mt-10 p-6 rounded-xl shadow">

        <h3 v-if="showResults" class="text-xl font-bold text-[#1aa546] mb-4">Available Vehicles</h3>

        <div
          v-for="v in availableVehicles"
          :key="v.id"
          @click="selectVehicle(v)"
          class="border rounded-lg p-4 mb-3 transition cursor-pointer"
          :class="selectedVehicle?.id === v.id ? 'bg-green-200 border-green-600' : 'hover:bg-green-50'"
        >
          <p class="font-semibold">{{ v.brand }} {{ v.model }} ({{ v.type }})</p>
          <p class="text-gray-700 mt-1">
            Total Price:
            <b class="text-[#1aa546]">
              Rp {{
                rentalBookingService.previewVehiclePrice(
                  v.price,
                  initialBooking.pickUpTime,
                  initialBooking.dropOffTime
                ).grandTotal.toLocaleString('id-ID')
              }}
            </b>
          </p>
        </div>

        <!-- Summary -->
        <div v-if="summary" class="mt-6 border rounded-xl p-5">
          <h3 class="text-lg font-bold text-[#1aa546] mb-2">Booking Price Details</h3>

          <p>
            Price per Day ({{ summary.days }} day<span v-if="summary.days > 1">s</span>):
            <b class="float-right">
              Rp {{ summary.basePrice.toLocaleString('id-ID') }}
            </b>
          </p>

          <p v-if="initialBooking.includeDriver" class="mt-2">
            Include Driver:
            <b class="float-right">
              Rp {{ summary.driverFee.toLocaleString('id-ID') }}
            </b>
          </p>

          <div class="border-t mt-3 pt-3 text-xl font-bold text-[#1aa546]">
            Grand Total:
            <span class="float-right">
              Rp {{ summary.grandTotal.toLocaleString('id-ID') }}
            </span>
          </div>

          <VButton
            class="w-full bg-blue-600 hover:bg-blue-700 text-white mt-5 py-3 rounded-lg font-semibold"
            @click="goToAddOns"
          >
            Proceed to Add-ons
          </VButton>
        </div>
      </div>




  </form>
</template>
