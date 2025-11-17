<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import VBookingForm from '@/components/rentalbooking/VBookingForm.vue'
import VButton from '@/components/common/VButton.vue'
import { useVehicleStore } from '@/stores/vehicle/vehicle.store'
import { useAddOnStore } from '@/stores/additional/addon.store'
import { useLocationStore } from '@/stores/additional/location.store'
import type { CreateRentalBookingRequest } from '@/interfaces/rentalbooking.interface'

const router = useRouter()
const vehicleStore = useVehicleStore()
const addOnStore = useAddOnStore()
const locationStore = useLocationStore()

// model booking
const initialBooking = ref<CreateRentalBookingRequest>({
  vehicleId: '',
  pickUpLocation: '',
  dropOffLocation: '',
  pickUpTime: '',
  dropOffTime: '',
  capacityNeeded: 1,
  transmissionNeeded: '',
  includeDriver: false,
  totalPrice: 0,
  listOfAddOns: [],
  vehicleDailyPrice: 0
})

const availableVehicles = ref<any[]>([])
const selectedVehicle = ref<any | null>(null)
const days = ref<number>(1)
const showVehicleList = ref(false)
const showPriceDetails = ref(false)
const locations = ref<string[]>([])

onMounted(async () => {
  await locationStore.fetchLocations()
  locations.value = locationStore.locations
})

// Step 1 — Search vehicles
const searchVehicles = async (booking: CreateRentalBookingRequest) => {
  selectedVehicle.value = null
  showPriceDetails.value = false

  const pick = new Date(booking.pickUpTime)
  const drop = new Date(booking.dropOffTime)
  days.value = Math.max(1, Math.ceil((drop.getTime() - pick.getTime()) / (1000 * 60 * 60 * 24)))

  const allVehicles = (await vehicleStore.fetchVehicles()) ?? []

  availableVehicles.value = allVehicles
    .filter(v =>
      v.capacity >= booking.capacityNeeded &&
      v.transmission.toLowerCase() === booking.transmissionNeeded.toLowerCase() &&
      v.status === 'Available' &&
      v.location === booking.pickUpLocation
    )
    .map(v => ({
      ...v,
      calculatedPrice: v.price * days.value
    }))

  showVehicleList.value = true
}

// Step 2 — pilih kendaraan
const selectVehicle = (vehicle: any) => {
  selectedVehicle.value = vehicle
  initialBooking.value.vehicleId = vehicle.id
  initialBooking.value.totalPrice = vehicle.calculatedPrice
  showPriceDetails.value = true
}

// Step 3 — Proceed to add-ons
const goToAddOns = () => {
  router.push({
    name: 'AddOnsForm',
    state: {
      bookingData: initialBooking.value
    }
  })
}
</script>

<template>
  <main class="w-full min-h-screen bg-gray-100 pt-24 pb-20 px-4">
    <div class="max-w-3xl mx-auto">

      <VBookingForm
        :bookingModel="initialBooking"
        :availableLocations="locations"
        :isEdit="false"
        :action="searchVehicles"
      />

      <!-- Vehicle List -->
      <div v-if="showVehicleList" class="mt-10 bg-white p-6 shadow-md rounded-xl">
        <h3 class="text-xl font-bold text-[#1aa546] mb-4">
          Available Vehicles ({{ days }} day{{ days > 1 ? 's' : '' }})
        </h3>

        <div
          v-for="v in availableVehicles"
          :key="v.id"
          @click="selectVehicle(v)"
          class="border rounded-lg p-4 mb-4 cursor-pointer hover:bg-green-100 transition"
        >
          <p class="font-semibold">{{ v.brand }} {{ v.model }} ({{ v.type }})</p>
          <p class="mt-1 text-gray-700">
            Total Price:
            <b class="text-[#1aa546]">Rp {{ v.calculatedPrice.toLocaleString() }}</b>
          </p>
        </div>

        <div v-if="availableVehicles.length === 0" class="text-center text-gray-500">
          No matching vehicles.
        </div>
      </div>

      <!-- Price Details -->
      <div v-if="showPriceDetails" class="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h3 class="text-lg font-bold text-[#1aa546] mb-2">Booking Price Details</h3>

        <p class="text-gray-700 mb-1">
          Price per Day ({{ days }} days):
          <b class="float-right">Rp {{ (selectedVehicle.calculatedPrice).toLocaleString() }}</b>
        </p>

        <p class="text-gray-700 mb-1" v-if="initialBooking.includeDriver">
          Driver Fee:
          <b class="float-right">Rp {{ (100000 * days).toLocaleString() }}</b>
        </p>

        <div class="border-t mt-2 pt-2 text-xl font-bold text-[#1aa546]">
          Grand Total:
          <span class="float-right">
            Rp {{ initialBooking.totalPrice.toLocaleString() }}
          </span>
        </div>
      </div>

    </div>
  </main>
</template>
