<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRentalBookingStore } from '@/stores/rentalbooking/rentalbooking.store'
import type { RentalBooking, RentalAddOn, UpdateRentalBookingAddOnRequest } from '@/interfaces/rentalbooking.interface'
import { toast } from 'vue-sonner'
import VAddOnsForm from '@/components/rentalbooking/VAddOnsForm.vue'
import { useAddOnStore } from '@/stores/additional/addon.store'

const route = useRoute()
const router = useRouter()
const store = useRentalBookingStore()

const bookingId = route.params.id as string
const booking = ref<RentalBooking | null>(null)
const addOns = ref<RentalAddOn[]>([])
const addOnStore = useAddOnStore()

onMounted(async () => {
  const data = await store.getRentalBooking(bookingId)

  if (!data) {
    toast.error("Booking not found")
    router.replace("/bookings")
    return
  }
  if (data.status !== "Upcoming") {
    toast.error("Add-ons can only be updated when booking is Upcoming!")
    router.replace(`/bookings/${bookingId}`)
    return
  }

  booking.value = data

  // fetch add-ons from store
  await addOnStore.fetchAddOns()
  addOns.value = addOnStore.addOns
})

// FIXED — terima CreateRentalBookingRequest dari VAddOnsForm
// const handleUpdate = async (updatedBooking: { listOfAddOns: string[] }) => {

//   const payload: UpdateRentalBookingAddOnRequest = {
//     id: booking.value!.id,
//     listOfAddOns: updatedBooking.listOfAddOns
//   }

//   const result = await store.updateRentalBookingAddOns(payload)

//   if (result) {
//     toast.success("Add-ons updated successfully!")
//     router.push(`/bookings/${bookingId}`)
//   }
// }


const handleUpdate = async (updatedAddOns: string[]) => {

  const payload: UpdateRentalBookingAddOnRequest = {
    id: booking.value!.id,
    listOfAddOns: updatedAddOns
  }

  const result = await store.updateRentalBookingAddOns(payload)

  if (result) {
    toast.success("Add-ons updated successfully!")
    router.push(`/bookings/${bookingId}`)
  }
}

</script>

<template>
  <main class="w-full min-h-screen bg-gray-100 pt-24 pb-16 px-4 flex justify-center">
    <div class="w-full max-w-3xl">

        <VAddOnsForm
          :bookingAddOns="(booking?.listOfAddOns ?? []).map(a => (typeof a === 'string' ? a : (a as any).id))"
          :addons="addOns"
          :onSubmit="handleUpdate"
          :isEdit="true"
        />

    </div>
  </main>
</template>
