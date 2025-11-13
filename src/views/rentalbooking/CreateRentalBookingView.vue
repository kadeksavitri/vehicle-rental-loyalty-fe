<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useRentalBookingStore } from '@/stores/rentalbooking/rentalbooking.store'
import { useVehicleStore } from '@/stores/vehicle/vehicle.store'
import type { RentalBooking, Vehicle, RentalAddOn, CreateRentalBookingRequest } from '@/interfaces/rentalbooking.interface'
import VBookingForm from '@/components/booking/VBookingForm.vue'
import VButton from '@/components/common/VButton.vue'
import VAddon from '@/components/booking/VAddon.vue'

const router = useRouter()
const bookingStore = useRentalBookingStore()
const vehicleStore = useVehicleStore()

// step kontrol
const step = ref<'form' | 'vehicles' | 'addons'>('form')

// state form booking
const bookingModel = ref<RentalBooking>({
  id: '',
  vehicleId: '',
  pickUpLocation: '',
  dropOffLocation: '',
  pickUpTime: '',
  dropOffTime: '',
  capacityNeeded: 1,
  transmissionNeeded: 'Manual',
  totalPrice: 0,
  includeDriver: false,
  status: 'Upcoming',
})

// data pendukung
const availableLocations = ref<string[]>([
  'DKI Jakarta', 'Jawa Barat', 'Yogyakarta', 'Bali', 'Sulawesi Utara', 'Sumatera Barat'
])
const availableVehicles = ref<Vehicle[]>([])
const selectedVehicle = ref<Vehicle | null>(null)
const addons = ref<RentalAddOn[]>([
  { id: 'ADD001', name: 'GPS', price: 50000 },
  { id: 'ADD002', name: 'Child Seat', price: 80000 },
])

// 🔍 Step 1 → cari kendaraan cocok
const handleSearchVehicle = async (data: RentalBooking) => {
  bookingModel.value = data

  const allVehicles = await vehicleStore.getAllVehicle()
  availableVehicles.value = allVehicles.filter((v: Vehicle) => {
    return (
      v.status === 'Available' &&
      v.capacity >= (data.capacityNeeded || 1) &&
      v.transmission.toLowerCase() === data.transmissionNeeded.toLowerCase() &&
      v.location === data.pickUpLocation
    )
  })

  if (availableVehicles.value.length === 0) {
    toast.warning('Tidak ada kendaraan yang memenuhi kriteria kamu 😢')
    return
  }
  toast.success('Kendaraan ditemukan!')
  step.value = 'vehicles'
}

// 🚗 Step 2 → pilih kendaraan dan hitung harga total
const selectVehicle = (vehicle: Vehicle) => {
  selectedVehicle.value = vehicle
  bookingModel.value.vehicleId = vehicle.id
  bookingModel.value.totalPrice = vehicle.price
  step.value = 'addons'
}

// 💾 Step 3 → simpan booking dengan add-ons
const handleSaveAddOns = async (finalBooking: RentalBooking) => {
  if (!selectedVehicle.value) return toast.error('Kendaraan belum dipilih!')

  const req: CreateRentalBookingRequest = {
    vehicleId: selectedVehicle.value.id,
    pickUpTime: bookingModel.value.pickUpTime,
    dropOffTime: bookingModel.value.dropOffTime,
    pickUpLocation: bookingModel.value.pickUpLocation,
    dropOffLocation: bookingModel.value.dropOffLocation,
    capacityNeeded: bookingModel.value.capacityNeeded || 1,
    transmissionNeeded: bookingModel.value.transmissionNeeded,
    totalPrice: bookingModel.value.totalPrice,
    listOfAddOns: finalBooking.listOfAddOns?.map(a => a.id) || [],
    includeDriver: bookingModel.value.includeDriver,
  }

  const newBooking = await bookingStore.createRentalBooking(req)
  if (newBooking) {
    toast.success('Booking berhasil dibuat 🎉')
    router.push('/bookings')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-8 font-sans">
    <div class="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
      <h1 class="text-2xl font-semibold text-[#1aa546] mb-6">Vehicle Rental App</h1>

      <!-- STEP 1: FORM -->
      <div v-if="step === 'form'">
        <VBookingForm
          :booking-model="bookingModel"
          :available-locations="availableLocations"
          :action="handleSearchVehicle"
        />
      </div>

      <!-- STEP 2: VEHICLE LIST -->
      <div v-else-if="step === 'vehicles'">
        <h2 class="text-xl font-bold text-[#1aa546] mb-3">Available Vehicles</h2>
        <p class="text-gray-600 mb-4">Klik salah satu kendaraan untuk melanjutkan</p>

        <div v-for="v in availableVehicles" :key="v.id"
          class="border border-gray-200 hover:border-[#1aa546] hover:bg-green-50 p-4 rounded-lg cursor-pointer mb-3"
          @click="selectVehicle(v)"
        >
          <p class="font-semibold text-gray-800">{{ v.brand }} {{ v.model }} ({{ v.type }})</p>
          <p class="text-gray-600">Location: {{ v.location }}</p>
          <p class="text-[#1aa546] font-semibold mt-1">Rp {{ v.price.toLocaleString('id-ID') }}</p>
        </div>

        <div class="text-center mt-6">
          <VButton
            class="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg"
            @click="step = 'form'"
          >
            Back
          </VButton>
        </div>
      </div>

      <!-- STEP 3: ADD-ONS -->
      <div v-else-if="step === 'addons'">
        <VAddon
          :booking="bookingModel"
          :addons="addons"
          :on-submit="handleSaveAddOns"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
p {
  @apply text-sm;
}
</style>
