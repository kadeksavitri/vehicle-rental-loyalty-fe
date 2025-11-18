<!-- views/rentalbooking/DetailRentalBookingView.vue -->

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { useRentalBookingStore } from '@/stores/rentalbooking/rentalbooking.store'
import { useAddOnStore } from '@/stores/additional/addon.store'
import VButton from '@/components/common/VButton.vue'
import type { RentalBooking } from '@/interfaces/rentalbooking.interface'
import VDeleteBookingButton from '@/components/rentalbooking/VDeleteBookingButton.vue'


const router = useRouter()
const route = useRoute()
const store = useRentalBookingStore()

const bookingId = route.params.id as string
const booking = ref<RentalBooking | null>(null)
const addOnStore = useAddOnStore()
const displayedAddOns = computed(() => {
  if (!booking.value) return []
  const catalog = addOnStore.addOns ?? []
  return (booking.value.listOfAddOns ?? []).map(a => {
    if (!a) return null
    return typeof a === 'string'
      ? (catalog.find(x => x.id === a) ?? { id: a, name: a, price: 0 })
      : a
  }).filter(Boolean)
})
const showAddOns = ref(false)

// Fetch booking
onMounted(async () => {
  const data = await store.getRentalBooking(bookingId)
  if (!data) {
    toast.error('Booking not found')
    router.replace('/bookings')
  } else {
    booking.value = data
    // ensure add-on catalog loaded so modal can display full add-on info
    await addOnStore.fetchAddOns()
  }
})

// Conditions for buttons
const canUpdateDetails = computed(() => booking.value?.status === 'Upcoming')
const canUpdateAddOns = computed(() => booking.value?.status === 'Upcoming')
const canUpdateStatus = computed(
  () => booking.value?.status === 'Upcoming' || booking.value?.status === 'Ongoing'
)
const canCancel = computed(() => booking.value?.status === 'Upcoming')
</script>

<template>
  <main class="w-full min-h-screen bg-gray-100 pt-24 pb-12 px-4 flex justify-center">
    <div class="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8">

      <!-- HEADER SECTION -->
      <div class="flex justify-between items-center border-b pb-4 mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Booking Details</h2>

        <div class="flex gap-2">
          <VButton
            v-if="canUpdateDetails"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
            @click="router.push(`/bookings/${booking?.id}/edit`)"
          >
            Update Booking Details
          </VButton>

          <VButton
            v-if="canUpdateAddOns"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
            @click="router.push(`/bookings/${booking?.id}/update-addons`)"
          >
            Update Add-Ons
          </VButton>

          <VButton
            v-if="canUpdateStatus"
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded"
            @click="router.push(`/bookings/${booking?.id}/update-status`)"
          >
            Update Status
          </VButton>

          <VDeleteBookingButton
            v-if="canCancel"
            :rentalBookingId="booking?.id!"
            @deleted="router.push('/bookings')"
          />


        </div>
      </div>

      <!-- DETAILS -->
      <div v-if="booking" class="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 text-gray-700">

        <div>
          <p>
            <strong>Booking ID</strong><br>
            <span class="text-green-600 font-semibold">{{ booking.id }}</span>
          </p>

          <p>
            <strong>Pick-up Time</strong><br>
            <span class="text-green-600 font-semibold">
{{ booking?.pickUpTime ? new Date(booking.pickUpTime).toLocaleString() : '-' }}
            </span>
          </p>

          <p>
            <strong>Pick-up Location</strong><br>
            <span class="text-green-600 font-semibold">{{ booking.pickUpLocation }}</span>
          </p>

          <p>
            <strong>Include Driver?</strong><br>
            <span>{{ booking.includeDriver ? 'Yes' : 'No' }}</span>
          </p>

          <p>
            <strong>Total Price</strong><br>
            <span class="text-green-600 font-semibold">
              Rp {{ booking.totalPrice.toLocaleString('id-ID') }}
            </span>
          </p>
        </div>

        <div>
          <p>
            <strong>Vehicle ID</strong><br>
            <span
              class="text-blue-700 font-semibold underline cursor-pointer"
              @click="router.push(`/vehicles/${booking.vehicleId}`)"
            >
              {{ booking.vehicleId }}
            </span>
          </p>

          <p>
            <strong>Drop-off Time</strong><br>
            <span class="text-green-600 font-semibold">
              {{ new Date(booking.dropOffTime).toLocaleString() }}
            </span>
          </p>

          <p>
            <strong>Drop-off Location</strong><br>
            <span class="text-green-600 font-semibold">{{ booking.dropOffLocation }}</span>
          </p>

          <p>
            <strong>Status</strong><br>
            <span class="text-green-600 font-semibold">{{ booking.status }}</span>
          </p>
        </div>

      </div>

      <!-- BUTTONS -->
      <div class="mt-10 flex flex-col gap-3">
        <VButton
          class="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded"
          @click="showAddOns = true"
        >
          View Add-Ons
        </VButton>

        <VButton
          class="w-full bg-gray-400 hover:bg-gray-500 text-white py-2 rounded"
          @click="router.push('/bookings')"
        >
          Back
        </VButton>
      </div>

    </div>

<!-- ADD-ONS MODAL -->
<div
  v-if="showAddOns"
  class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
  @click.self="showAddOns = false"
>
  <div class="bg-white p-6 rounded-xl w-full max-w-2xl shadow-xl">
    
    <!-- Header -->
    <div class="flex justify-between items-center border-b pb-3 mb-4">
      <h3 class="text-xl font-bold">Included Add-Ons</h3>
      <button @click="showAddOns = false" class="text-gray-500 text-2xl">&times;</button>
    </div>

    <!-- Add-ons List -->
    <ul v-if="displayedAddOns.length" class="list-disc pl-5 space-y-2 text-gray-700">
      <li v-for="addon in displayedAddOns" :key="addon!.id">
        {{ addon!.name }} – 
        Rp {{ (addon!.price ?? 0).toLocaleString('id-ID') }}
      </li>
    </ul>

    <!-- Empty -->
    <p v-else class="text-gray-500 italic">
      No add-ons included.
    </p>
  </div>
</div>


  </main>
</template>

