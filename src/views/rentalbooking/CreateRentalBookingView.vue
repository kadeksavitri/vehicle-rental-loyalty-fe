<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import VBookingForm from '@/components/rentalbooking/VBookingForm.vue'
import VButton from '@/components/common/VButton.vue'
import { useVehicleStore } from '@/stores/vehicle/vehicle.store'
import { useLocationStore } from '@/stores/additional/location.store'
import { rentalBookingService } from '@/service/rentalbooking.service'
import { useTempBookingStore } from '@/stores/rentalbooking/booking-temp.store'
import type { CreateRentalBookingRequest } from '@/interfaces/rentalbooking.interface'

const router = useRouter()
const vehicleStore = useVehicleStore()
const locationStore = useLocationStore()
const tempStore = useTempBookingStore()

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

const searchVehicles = async (booking: CreateRentalBookingRequest) => {
  selectedVehicle.value = null
  summary.value = null

  const allVehicles = (await vehicleStore.fetchVehicles()) ?? []

  availableVehicles.value = allVehicles.filter(v =>
    v.capacity >= booking.capacityNeeded &&
    v.transmission.toLowerCase() === booking.transmissionNeeded.toLowerCase() &&
    v.status === 'Available' &&
    v.location === booking.pickUpLocation
  )

  showResults.value = true
}

const selectVehicle = (vehicle: any) => {
  selectedVehicle.value = vehicle
  initialBooking.value.vehicleId = vehicle.id
  initialBooking.value.vehicleDailyPrice = vehicle.price

  summary.value = rentalBookingService.previewVehiclePrice(
    vehicle.price,
    initialBooking.value.pickUpTime,
    initialBooking.value.dropOffTime
  )
}


const goToAddOns = () => {
  tempStore.setBooking(initialBooking.value)
  router.push({ name: 'AddOnsForm' })
}

</script>

<template>
  <main class="w-full min-h-screen bg-gray-100 pt-24 pb-20 px-4">
    <div class="max-w-3xl mx-auto">

      <!-- FORM -->
      <VBookingForm
        :bookingModel="initialBooking"
        :availableLocations="locations"
        :isEdit="false"
        :action="searchVehicles"
      />

    </div>
  </main>
</template>
