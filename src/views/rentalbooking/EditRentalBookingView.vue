<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import VBookingForm from '@/components/rentalbooking/VBookingForm.vue'
import VButton from '@/components/common/VButton.vue'
import { useVehicleStore } from '@/stores/vehicle/vehicle.store'
import { useLocationStore } from '@/stores/additional/location.store'
import { useRentalBookingStore } from '@/stores/rentalbooking/rentalbooking.store'
import { useAddOnStore } from '@/stores/additional/addon.store'
import { calculateAddOnTotal, calculateDays } from '@/service/booking-calculator'
import { rentalBookingService } from '@/service/rentalbooking.service'
import type {
  CreateRentalBookingRequest,
  UpdateRentalBookingRequest,
  RentalBooking,
  RentalAddOn,
} from '@/interfaces/rentalbooking.interface'
import apiClient from '@/lib/api'
import type { CommonResponseInterface } from '@/interfaces/common.response.interface'

const router = useRouter()
const route = useRoute()
const bookingId = route.params.id as string

const vehicleStore = useVehicleStore()
const locationStore = useLocationStore()
const bookingStore = useRentalBookingStore()
const addOnStore = useAddOnStore()

// booking booking (reuse create booking shape)
const booking = ref<UpdateRentalBookingRequest>({
  customerId: '',
  id: bookingId,
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
  status: '',
  listOfAddOns: [],
})

const originalBooking = ref<RentalBooking | null>(null)

const availableVehicles = ref<any[]>([])
const selectedVehicle = ref<any | null>(null)
const days = ref<number>(1)
const showResults = ref(false)
const summary = ref<any | null>(null)

const locations = ref<string[]>([])
const addons = ref<RentalAddOn[]>([])

onMounted(async () => {
  await locationStore.fetchLocations()
  locations.value = locationStore.locations

  await addOnStore.fetchAddOns()
  addons.value = addOnStore.addOns

  const data = await bookingStore.getRentalBooking(bookingId)
  if (!data) {
    toast.error('Booking not found')
    router.replace('/bookings')
    return
  }

  if (data.status !== 'Upcoming') {
    toast.error('Only Upcoming bookings can be edited')
    router.replace(`/bookings/${bookingId}`)
    return
  }

  originalBooking.value = data

  // prefill booking
  booking.value.vehicleId = data.vehicleId
  booking.value.pickUpLocation = data.pickUpLocation
  booking.value.dropOffLocation = data.dropOffLocation
  booking.value.pickUpTime = data.pickUpTime as unknown as string
  booking.value.dropOffTime = data.dropOffTime as unknown as string
  booking.value.capacityNeeded = data.capacityNeeded
  booking.value.transmissionNeeded = data.transmissionNeeded
  booking.value.includeDriver = data.includeDriver

  // backend returns add-ons as names (RentalBookingResponseDTO.listOfAddOns = List<String> names)
  // map those names back to add-on IDs using the add-on catalog we just fetched
  const mappedAddOnIds = (data.listOfAddOns ?? [])
    .map((item: any) => {
      if (!item) return null
      const str = String(item)
      // try find by id first, then by name
      const found =
        addons.value.find((a) => a.id === str) || addons.value.find((a) => a.name === str)
      return found ? found.id : null
    })
    .filter(Boolean) as string[]

  booking.value.listOfAddOns = mappedAddOnIds

  // fetch vehicle to get daily price
  const v = await vehicleStore.getVehicle(data.vehicleId)
  if (v) {
    booking.value.vehicleDailyPrice = v.price
    selectedVehicle.value = v
  }
})

// search vehicles for given booking criteria
const searchVehicles = async () => {
  try {
    const searchPayload = {
      pickUpLocation: booking.value.pickUpLocation,
      dropOffLocation: booking.value.dropOffLocation,
      pickUpTime: booking.value.pickUpTime,
      dropOffTime: booking.value.dropOffTime,
      capacityNeeded: booking.value.capacityNeeded,
      transmissionNeeded: booking.value.transmissionNeeded,
    }

    const response = await apiClient.post<CommonResponseInterface<any[]>>(
      '/vehicles/search',
      searchPayload,
    )

    availableVehicles.value = response.data.data ?? []

    if (availableVehicles.value.length === 0) {
      toast.warning('No vehicles available for the requested period')
    } else {
      toast.success(`Found ${availableVehicles.value.length} available vehicle(s)`)
    }

    selectedVehicle.value = null
    summary.value = null
    showResults.value = true
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || error.message || 'Failed to search vehicles'
    toast.error(`Error: ${errorMessage}`)
    availableVehicles.value = []
    showResults.value = false
  }
}

const selectVehicle = (v: any) => {
  selectedVehicle.value = v
  booking.value.vehicleId = v.id
  booking.value.vehicleDailyPrice = v.price

  const days = calculateDays(booking.value.pickUpTime, booking.value.dropOffTime)
  const driverFee = booking.value.includeDriver ? days * 100000 : 0
  const basePrice = v.calculatedPrice
  const grandTotal = basePrice + driverFee

  summary.value = {
    days,
    basePrice,
    driverFee,
    grandTotal,
  }
  booking.value.totalPrice = grandTotal
}

const cancel = () => router.push(`/bookings/${bookingId}`)

const saveBooking = async () => {
  if (!originalBooking.value) return
  // Basic client-side validation to avoid sending malformed payloads
  if (!booking.value.vehicleId || booking.value.vehicleId.trim() === '') {
    toast.error('Silakan pilih kendaraan sebelum menyimpan booking.')
    return
  }
  if (!booking.value.pickUpTime || !booking.value.dropOffTime) {
    toast.error('Waktu pengambilan dan pengembalian harus diisi.')
    return
  }
  if (!booking.value.pickUpLocation || !booking.value.dropOffLocation) {
    toast.error('Lokasi pengambilan dan pengembalian harus dipilih.')
    return
  }
  // additional constraints: pickup >= now, pickup < drop
  const now = new Date()
  const pick = new Date(booking.value.pickUpTime)
  const drop = new Date(booking.value.dropOffTime)
  if (isNaN(pick.getTime()) || isNaN(drop.getTime())) {
    toast.error('Format waktu tidak valid')
    return
  }
  if (pick.getTime() < now.getTime()) {
    toast.error('waktu pengambilan minimal harus waktu saat ini atau lebih')
    return
  }
  if (pick.getTime() >= drop.getTime()) {
    toast.error('waktu pengambilan harus sebelum waktu pengembalian')
    return
  }
  const preservedAddOnIds =
    booking.value.listOfAddOns && booking.value.listOfAddOns.length > 0
      ? booking.value.listOfAddOns
      : (originalBooking.value.listOfAddOns ?? []).map((a) =>
          typeof a === 'string' ? a : (a as any).id,
        )

  const preview = rentalBookingService.previewVehiclePrice(
    booking.value.vehicleDailyPrice,
    booking.value.pickUpTime as unknown as string,
    booking.value.dropOffTime as unknown as string,
    booking.value.includeDriver,
  )
  const addOnTotal = calculateAddOnTotal(preservedAddOnIds, addons.value)

  const payload: UpdateRentalBookingRequest = {
    id: bookingId,
    customerId: originalBooking.value.customerId,
    vehicleId: booking.value.vehicleId,
    pickUpTime: booking.value.pickUpTime as unknown as string,
    dropOffTime: booking.value.dropOffTime as unknown as string,
    pickUpLocation: booking.value.pickUpLocation,
    dropOffLocation: booking.value.dropOffLocation,
    capacityNeeded: booking.value.capacityNeeded,
    transmissionNeeded: booking.value.transmissionNeeded,
    totalPrice: preview.grandTotal + addOnTotal,
    listOfAddOns: preservedAddOnIds ?? [],
    includeDriver: booking.value.includeDriver,
    status: originalBooking.value.status,
    vehicleDailyPrice: booking.value.vehicleDailyPrice,
  }

  try {
    const res = await bookingStore.updateRentalBooking(payload as any)
    if (res) {
      toast.success('Booking updated successfully')
      router.push(`/bookings/${bookingId}`)
    } else {
      // store already shows toast for server message; ensure we don't silently fail
      toast.error('Failed to update booking. See console for details.')
    }
  } catch (err: any) {
    const msg = err?.message ?? 'Unexpected error'
    toast.error(`Error updating booking: ${msg}`)
    console.error('Save booking error:', err)
  }
}
</script>

<template>
  <main class="pt-8 pb-20 px-4">
    <div class="max-w-3xl mx-auto">
      <VBookingForm
        :action="searchVehicles"
        :bookingModel="booking"
        :availableLocations="locations"
        :isEdit="true"
        @update:modelValue="booking = $event"
      />

      <!-- Vehicle List -->
      <div
        v-if="showResults"
        class="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto flex flex-col gap-4 font-sans -mt-8"
      >
        <h3 class="text-xl font-bold text-[#1aa546] mb-3">Available Vehicles</h3>

        <div
          v-for="v in availableVehicles"
          :key="v.id"
          class="p-4 border rounded-lg mb-3 cursor-pointer border-gray-300"
          :class="
            selectedVehicle?.id === v.id ? 'bg-green-200 border-green-600' : 'hover:bg-green-50'
          "
          @click="selectVehicle(v)"
        >
          <p class="font-semibold">{{ v.brand }} {{ v.model }} ({{ v.type }})</p>
          <p class="mt-1 text-gray-600">
            Total Price:
            <b class="text-[#1aa546]">Rp {{ v.calculatedPrice.toLocaleString('id-ID') }}</b>
          </p>
        </div>

        <div v-if="availableVehicles.length === 0" class="text-center text-gray-500">
          No matching vehicles.
        </div>

        <div v-if="summary" class="-mt-2">
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

            <div class="border-t mt-2 pt-2 text-xl font-bold text-[#1aa546]">
              Grand Total:
              <span class="float-right text-lg text-[#1aa546] font-bold">
                Rp {{ summary.grandTotal.toLocaleString('id-ID') }}
              </span>
            </div>

            <div class="flex gap-4 mt-6">
              <VButton class="w-full bg-gray-400 text-white" @click="cancel">Cancel</VButton>
              <VButton class="w-full bg-[#1aa546] text-white" @click="saveBooking">Save</VButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
