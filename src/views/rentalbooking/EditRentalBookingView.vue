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
import { calculateAddOnTotal } from '@/service/booking-calculator'
import { rentalBookingService } from '@/service/rentalbooking.service'
import type { CreateRentalBookingRequest, UpdateRentalBookingRequest, RentalBooking, RentalAddOn } from '@/interfaces/rentalbooking.interface'

const router = useRouter()
const route = useRoute()
const bookingId = route.params.id as string

const vehicleStore = useVehicleStore()
const locationStore = useLocationStore()
const bookingStore = useRentalBookingStore()
const addOnStore = useAddOnStore()

// model booking (reuse create model shape)
const model = ref<UpdateRentalBookingRequest>({
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
  listOfAddOns: []
})

const originalBooking = ref<RentalBooking | null>(null)

const availableVehicles = ref<any[]>([])
const selectedVehicle = ref<any | null>(null)
const days = ref<number>(1)
const showVehicleList = ref(false)
const showPriceDetails = ref(false)
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

  // prefill model
  model.value.vehicleId = data.vehicleId
  model.value.pickUpLocation = data.pickUpLocation
  model.value.dropOffLocation = data.dropOffLocation
  model.value.pickUpTime = data.pickUpTime as unknown as string
  model.value.dropOffTime = data.dropOffTime as unknown as string
  model.value.capacityNeeded = data.capacityNeeded
  model.value.transmissionNeeded = data.transmissionNeeded
  model.value.includeDriver = data.includeDriver
  model.value.listOfAddOns = (data.listOfAddOns ?? []).map(a => (a as any).id)

  // fetch vehicle to get daily price
  const v = await vehicleStore.getVehicle(data.vehicleId)
  if (v) {
    model.value.vehicleDailyPrice = v.price
    selectedVehicle.value = v
  }

  // compute initial summary using centralized service
  const initialPreview = rentalBookingService.previewVehiclePrice(
    model.value.vehicleDailyPrice,
    model.value.pickUpTime,
    model.value.dropOffTime,
    model.value.includeDriver
  )
  const initialAddOnIds = (model.value.listOfAddOns ?? [])
  const initialAddOnTotal = calculateAddOnTotal(initialAddOnIds, addons.value)
  days.value = initialPreview.days
  model.value.totalPrice = initialPreview.grandTotal + initialAddOnTotal
  showPriceDetails.value = true
})

// search vehicles for given model criteria
const searchVehicles = async (b: CreateRentalBookingRequest) => {
  selectedVehicle.value = null
  showPriceDetails.value = false

  // compute days using centralized service (preview with 0 price to get days)
  const dayPreview = rentalBookingService.previewVehiclePrice(0, b.pickUpTime, b.dropOffTime, false)
  days.value = dayPreview.days

  const allVehicles = (await vehicleStore.fetchVehicles()) ?? []
  availableVehicles.value = allVehicles
    .filter(v =>
      v.capacity >= b.capacityNeeded &&
      v.transmission.toLowerCase() === b.transmissionNeeded.toLowerCase() &&
      v.status === 'Available' &&
      v.location === b.pickUpLocation
    )
    .map(v => {
      const preview = rentalBookingService.previewVehiclePrice(v.price, b.pickUpTime, b.dropOffTime, b.includeDriver)
      return { ...v, calculatedPrice: preview.grandTotal }
    })

  showVehicleList.value = true
}

const selectVehicle = (v: any) => {
  selectedVehicle.value = v
  model.value.vehicleId = v.id
  model.value.vehicleDailyPrice = v.price

  const preview = rentalBookingService.previewVehiclePrice(
    v.price,
    model.value.pickUpTime,
    model.value.dropOffTime,
    model.value.includeDriver
  )
  // include any selected add-ons in the total
  const addOnIds = model.value.listOfAddOns ?? []
  const addOnTotal = calculateAddOnTotal(addOnIds, addons.value)
  model.value.totalPrice = preview.grandTotal + addOnTotal
  days.value = preview.days
  showPriceDetails.value = true
}

const cancel = () => router.push(`/bookings/${bookingId}`)

const saveBooking = async () => {
  if (!originalBooking.value) return
  // ensure add-ons are preserved if user did not change them
  const preservedAddOnIds = (model.value.listOfAddOns && model.value.listOfAddOns.length > 0)
    ? model.value.listOfAddOns
    : (originalBooking.value.listOfAddOns ?? []).map(a => (typeof a === 'string' ? a : (a as any).id))

  // compute totals using centralized service + add-on totals
  const preview = rentalBookingService.previewVehiclePrice(
    model.value.vehicleDailyPrice,
    model.value.pickUpTime as unknown as string,
    model.value.dropOffTime as unknown as string,
    model.value.includeDriver
  )
  const addOnTotal = calculateAddOnTotal(preservedAddOnIds, addons.value)

  const payload: UpdateRentalBookingRequest = {
    id: bookingId,
    vehicleId: model.value.vehicleId,
    pickUpTime: model.value.pickUpTime as unknown as string,
    dropOffTime: model.value.dropOffTime as unknown as string,
    pickUpLocation: model.value.pickUpLocation,
    dropOffLocation: model.value.dropOffLocation,
    capacityNeeded: model.value.capacityNeeded,
    transmissionNeeded: model.value.transmissionNeeded,
    totalPrice: preview.grandTotal + addOnTotal,
    listOfAddOns: preservedAddOnIds ?? [],
    includeDriver: model.value.includeDriver,
    status: originalBooking.value.status,
    vehicleDailyPrice: model.value.vehicleDailyPrice,
  }

  const res = await bookingStore.updateRentalBooking(payload as any)
  if (res) {
    toast.success('Booking updated successfully')
    router.push(`/bookings/${bookingId}`)
  }
}
</script>

<template>
  <main class="w-full min-h-screen bg-gray-100 pt-24 pb-20 px-4">
    <div class="max-w-3xl mx-auto">

      <VBookingForm
        :action="searchVehicles"
        :bookingModel="model"
        :availableLocations="locations"
        :isEdit="false"
        @update:modelValue="model = $event"
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

      <!-- Price Details + Save -->
      <div v-if="showPriceDetails" class="mt-8 bg-white p-6 rounded-xl shadow-md">
        <h3 class="text-lg font-bold text-[#1aa546] mb-2">Booking Price Details</h3>

        <p class="text-gray-700 mb-1">
          Price per Day ({{ days }} days):
          <b class="float-right">Rp {{ (selectedVehicle?.calculatedPrice ?? (model.vehicleDailyPrice * days)).toLocaleString() }}</b>
        </p>

        <p class="text-gray-700 mb-1" v-if="model.includeDriver">
          Driver Fee:
          <b class="float-right">Rp {{ (100000 * days).toLocaleString() }}</b>
        </p>

        <div class="border-t mt-2 pt-2 text-xl font-bold text-[#1aa546]">
          Grand Total:
          <span class="float-right">
            Rp {{ model.totalPrice.toLocaleString() }}
          </span>
        </div>

        <div class="flex gap-4 mt-6">
          <VButton class="w-full bg-gray-400 text-white" @click="cancel">Cancel</VButton>
          <VButton class="w-full bg-[#1aa546] text-white" @click="saveBooking">Save</VButton>
        </div>
      </div>

    </div>
  </main>
</template>
