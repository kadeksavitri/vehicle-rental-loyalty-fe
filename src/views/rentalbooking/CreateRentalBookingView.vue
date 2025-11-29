<!-- views/rentalbooking/CreateRentalBookingView.vue -->

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { toast } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { useVehicleStore } from '@/stores/vehicle/vehicle.store'
import { useLocationStore } from '@/stores/additional/location.store'
import { useVendorStore } from '@/stores/additional/vendor.store'
import { useTempBookingStore } from '@/stores/rentalbooking/booking-temp.store'
import VBookingForm from '@/components/rentalbooking/VBookingForm.vue'
import VButton from '@/components/common/VButton.vue'
import { rentalBookingService } from '@/service/rentalbooking.service'
import { previewVehiclePrice, calculateDays } from '@/service/booking-calculator'
import type { CreateRentalBookingRequest } from '@/interfaces/rentalbooking.interface'

const router = useRouter()
const vehicleStore = useVehicleStore()
const locationStore = useLocationStore()
const vendorStore = useVendorStore()
const tempStore = useTempBookingStore()

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
  await vendorStore.fetchVendors()
})

// ====================
const validateSearchInputs = (): boolean => {
  const now = new Date()
  if (!booking.value.pickUpTime || !booking.value.dropOffTime) {
    toast.error('Waktu pengambilan dan pengembalian harus diisi')
    return false
  }
  const pick = new Date(booking.value.pickUpTime)
  const drop = new Date(booking.value.dropOffTime)
  if (isNaN(pick.getTime()) || isNaN(drop.getTime())) {
    toast.error('Format waktu tidak valid')
    return false
  }
  if (pick.getTime() < now.getTime()) {
    toast.error('waktu pengambilan minimal harus waktu saat ini atau lebih')
    return false
  }
  if (pick.getTime() >= drop.getTime()) {
    toast.error('waktu pengambilan harus sebelum waktu pengembalian')
    return false
  }
  if (!booking.value.transmissionNeeded || booking.value.transmissionNeeded.trim() === '') {
    toast.error('Jenis transmisi harus dipilih')
    return false
  }
  if (!booking.value.pickUpLocation || !booking.value.dropOffLocation) {
    toast.error('Lokasi pengambilan dan pengembalian harus dipilih')
    return false
  }
  if (!booking.value.capacityNeeded || booking.value.capacityNeeded < 1) {
    toast.error('Kapasitas minimal adalah 1')
    return false
  }
  return true
}

const searchVehicles = async () => {
  if (!validateSearchInputs()) return

  const allVehicles = (await vehicleStore.fetchVehicles()) ?? []

  // calculate days for the requested period
  const days = calculateDays(booking.value.pickUpTime, booking.value.dropOffTime)

  availableVehicles.value = allVehicles
    .filter(v => {
      const vendor = vendorStore.vendors.find(x => x.id === v.rentalVendorId)
      const vendorHasLocations = vendor && Array.isArray(vendor.listOfLocations) && vendor.listOfLocations.includes(booking.value.pickUpLocation) && vendor.listOfLocations.includes(booking.value.dropOffLocation)
      return (
        v.capacity >= booking.value.capacityNeeded &&
        v.transmission.toLowerCase() === booking.value.transmissionNeeded.toLowerCase() &&
        v.status === 'Available' &&
        // vehicle location must match pickup location AND vendor must operate in both pickup and dropoff
        v.location === booking.value.pickUpLocation &&
        !!vendorHasLocations
      )
    })
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
  if (!selectedVehicle.value) {
    toast.error('Pilih kendaraan terlebih dahulu sebelum melanjutkan')
    return
  }
  tempStore.setBooking(booking.value)
  tempStore.setSelectedVehicle(selectedVehicle.value)
  // navigate to the add-ons step route
  router.push({ name: 'CreateBookingAddOns' })
}

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
            Total Price:
              <b class="text-[#1aa546]">Rp {{ v.calculatedPrice.toLocaleString('id-ID') }}</b>
          </p>
        </div>

        <div v-if="availableVehicles.length === 0" class="text-center text-gray-500">
          No vehicles available for the requested period
        </div>

      <div v-if= "summary" class=" -mt-2">
        <div class="mt-6 border rounded-xl p-5">
          <h3 class="text-lg font-bold text-[#1aa546] mb-2">Booking Price Details</h3>

          <p>
            Price per Day ({{ summary.days }} day{{ summary.days > 1 ? '(s)' : '' }}):
            <b class="float-right">Rp {{ summary.basePrice.toLocaleString('id-ID') }}</b>
          </p>

          <p v-if="booking.includeDriver" class="mt-2">
            Driver Fee:
            <b class="float-right">Rp {{ summary.driverFee.toLocaleString('id-ID') }}</b>
          </p>

          <div class="border-t mt-3 pt-3 text-lg font-bold">
            Grand Total:
            <span class="float-right text-lg  text-[#1aa546] font-bold">Rp {{ summary.grandTotal.toLocaleString('id-ID') }}</span>
          </div>

        </div>

          <VButton
            class="w-full text-white bg-blue-600 hover:bg-blue-700 mt-5"
            @click="proceedToAddOns"
          >
            Proceed to Add-ons
          </VButton>
        </div>
      </div>

    </div>
  </main>
</template>
