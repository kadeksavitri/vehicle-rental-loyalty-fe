<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import VAddOnsForm from '@/components/rentalbooking/VAddOnsForm.vue'
import { useAddOnStore } from '@/stores/additional/addon.store'
import { useRentalBookingStore } from '@/stores/rentalbooking/rentalbooking.store'
import type { CreateRentalBookingRequest, RentalAddOn } from '@/interfaces/rentalbooking.interface'
import { useTempBookingStore } from '@/stores/rentalbooking/booking-temp.store'


const router = useRouter()
const addOnStore = useAddOnStore()
const bookingStore = useRentalBookingStore()

const tempStore = useTempBookingStore()
const bookingData = tempStore.bookingData

// const bookingData =
//   (history.state?.bookingData as CreateRentalBookingRequest) ?? null

if (!bookingData) {
  router.push('/bookings/create')
}

const addons = ref<RentalAddOn[]>([])

onMounted(async () => {
  await addOnStore.fetchAddOns()
  addons.value = addOnStore.addOns
})

const handleSubmit = async (updatedBooking: CreateRentalBookingRequest) => {
  const newBooking = await bookingStore.createRentalBooking(updatedBooking)

  if (newBooking) router.push('/bookings')
}
</script>

<template>
  <main class="pt-24 pb-20 px-4">
  <VAddOnsForm
    :booking="bookingData!"
    :addons="addons"
    :onSubmit="handleSubmit"
    :isEdit="false"
  />

  </main>
</template>
