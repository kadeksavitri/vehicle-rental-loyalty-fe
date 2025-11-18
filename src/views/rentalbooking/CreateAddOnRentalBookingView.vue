<!-- views/rentalbooking/CreateAddOnRentalBookingView.vue -->

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


if (!bookingData) {
  router.push('/bookings/add')
}

const addons = ref<RentalAddOn[]>([])

onMounted(async () => {
  await addOnStore.fetchAddOns()
  addons.value = addOnStore.addOns
})

const handleAddOnsSubmit = async (addOns: string[]) => {
  const updated: CreateRentalBookingRequest = {
    ...bookingData!,
    listOfAddOns: addOns
  }

  const newBooking = await bookingStore.createRentalBooking(updated)
  if (newBooking) {
    tempStore.clear()
    router.push('/bookings')
  }
}

</script>

<template>
  <main class="pt-8 pb-20 px-4">
  <VAddOnsForm
   :bookingAddOns="bookingData!.listOfAddOns ?? []"
   :addons="addons"
   :onSubmit="handleAddOnsSubmit"
    :isEdit="false"
  />

  </main>
</template>

