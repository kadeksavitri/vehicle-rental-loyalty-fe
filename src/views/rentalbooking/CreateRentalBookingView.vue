<!-- views/rentalbooking/CreateRentalBookingView.vue -->

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useVehicleStore } from '@/stores/vehicle/vehicle.store'
import { useLocationStore } from '@/stores/additional/location.store'
import { useTempBookingStore } from '@/stores/rentalbooking/booking-temp.store'
import VBookingForm from '@/components/rentalbooking/VBookingForm.vue'
import VButton from '@/components/common/VButton.vue'
import { rentalBookingService } from '@/service/rentalbooking.service'
import { previewVehiclePrice, calculateDays } from '@/service/booking-calculator'
import type { CreateRentalBookingRequest } from '@/interfaces/rentalbooking.interface'

const router = useRouter()
const vehicleStore = useVehicleStore()
const locationStore = useLocationStore()
const tempStore = useTempBookingStore()

// ==== INITIAL BOOKING MODEL ====
const booking = ref<CreateRentalBookingRequest>({
  pickUpLocation: '',
  dropOffLocation: '',
  pickUpTime: '',
  dropOffTime: '',
  capacityNeeded: 1,
  transmissionNeeded: '',
  includeDriver: false,
  vehicleId: '',
  totalPrice: 0,
  vehicleDailyPrice: 0,
  listOfAddOns: []
})

const availableVehicles = ref<any[]>([])
const selectedVehicle = ref<any | null>(null)
const summary = ref<any | null>(null)
const locations = ref<string[]>([])
const showResults = ref(false)

onMounted(async () => {
  await locationStore.fetchLocations()
  locations.value = locationStore.locations
})

// ====================
const searchVehicles = async () => {
  const allVehicles = (await vehicleStore.fetchVehicles()) ?? []

  // calculate days for the requested period
  const days = calculateDays(booking.value.pickUpTime, booking.value.dropOffTime)

  availableVehicles.value = allVehicles
    .filter(v =>
      v.capacity >= booking.value.capacityNeeded &&
      v.transmission.toLowerCase() === booking.value.transmissionNeeded.toLowerCase() &&
      v.status === 'Available' &&
      v.location === booking.value.pickUpLocation
    )
    .map(v => ({
      ...v,
      calculatedPrice: v.price * days
    }))

  selectedVehicle.value = null
  summary.value = null
  showResults.value = true
}

const selectVehicle = (v: any) => {
  selectedVehicle.value = v
  booking.value.vehicleId = v.id
  booking.value.vehicleDailyPrice = v.price

  const preview = previewVehiclePrice(v.price, booking.value.pickUpTime, booking.value.dropOffTime, booking.value.includeDriver)
  summary.value = preview
  booking.value.totalPrice = preview.grandTotal
}

const proceedToAddOns = () => {
  tempStore.setBooking(booking.value)
  tempStore.setSelectedVehicle(selectedVehicle.value)
  // navigate to the add-ons step route
  router.push({ name: 'CreateBookingAddOns' })
}

// keep booking total in sync when includeDriver is toggled after selection
watch(() => booking.value.includeDriver, (newVal) => {
  if (!selectedVehicle.value || !summary.value) return
  const days = summary.value.days || 1
  const basePrice = selectedVehicle.value.price * days
  const driverFee = newVal ? days * 100000 : 0
  booking.value.totalPrice = basePrice + driverFee
  summary.value.driverFee = driverFee
  summary.value.grandTotal = booking.value.totalPrice
})
</script>

<template>
  <main class="pt-8 pb-20 px-4">
    <div class="max-w-3xl mx-auto">

      <VBookingForm
        :action="searchVehicles"
        :bookingModel="booking"
        :availableLocations="locations"
        :isEdit="false"
        @update:modelValue="booking = $event"
      />


      <div v-if="showResults" class="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto flex flex-col gap-4 font-sans -mt-8">
        <h3 class="font-bold text-xl text-[#1aa546] mb-3">Available Vehicles</h3>

        <div
          v-for="v in availableVehicles"
          :key="v.id"
          class="p-4 border rounded-lg mb-3 cursor-pointer border-gray-300"
          :class="selectedVehicle?.id === v.id ? 'bg-green-200 border-green-600' : 'hover:bg-green-50'"
          @click="selectVehicle(v)"
        >
          <p class="font-semibold">{{ v.brand }} {{ v.model }} ({{ v.type }})</p>
          <p class="mt-1 text-gray-600">
            Price per day:
            <b>{{ v.price.toLocaleString('id-ID') }}</b>
          </p>
        </div>

        <div v-if="summary" class="mt-6 border rounded-xl p-5">
          <h3 class="text-lg font-bold text-[#1aa546] mb-2">Booking Summary</h3>

          <p>
            Base Price:
            <b class="float-right">{{ summary.basePrice.toLocaleString('id-ID') }}</b>
          </p>

          <p v-if="booking.includeDriver" class="mt-2">
            Driver Fee:
            <b class="float-right">{{ summary.driverFee.toLocaleString('id-ID') }}</b>
          </p>

          <div class="border-t mt-3 pt-3 text-xl font-bold">
            Total:
            <span class="float-right">{{ summary.grandTotal.toLocaleString('id-ID') }}</span>
          </div>

          <VButton
            class="w-full bg-blue-600 hover:bg-blue-700 mt-5"
            @click="proceedToAddOns"
          >
            Proceed to Add-ons
          </VButton>
        </div>
      </div>

    </div>
  </main>
</template>
