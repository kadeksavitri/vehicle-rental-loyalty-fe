<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRentalBookingStore } from '@/stores/rentalbooking/rentalbooking.store'
import type { RentalBooking, UpdateRentalBookingStatusRequest } from '@/interfaces/rentalbooking.interface'
import VButton from '@/components/common/VButton.vue'

const route = useRoute()
const router = useRouter()
const rentalBookingStore = useRentalBookingStore()

const bookingId = route.params.id as string
const booking = ref<RentalBooking | null>(null)
const newStatus = ref('')

const loadBooking = async () => {
  const data = await rentalBookingStore.getRentalBooking(bookingId)
  if (!data) {
    router.replace('/bookings')
    return
  }
  booking.value = data
}

const saveStatus = async () => {
  if (!booking.value || !newStatus.value) return

  const payload: UpdateRentalBookingStatusRequest = {
    id: booking.value.id,
    newStatus: newStatus.value
  }

  const updated = await rentalBookingStore.updateRentalBookingStatus(payload as any)

  if (updated) {
    router.push('/bookings')
  }
}

onMounted(loadBooking)
</script>

<template>
  <main class="w-full min-h-screen bg-gray-100 pt-24 py-10 px-4 flex justify-center">
    <div class="w-full max-w-xl bg-white shadow-md rounded-xl p-8">

      <h2 class="text-2xl font-bold text-green-600 mb-4">
        Update Booking Status
      </h2>

      <hr class="border-gray-300 mb-6" />

      <div v-if="booking">
        <!-- Booking ID -->
        <div class="mb-4">
          <label class="font-semibold text-gray-700">Booking ID</label>
          <p class="text-gray-900 mt-1">{{ booking.id }}</p>
        </div>

        <!-- Current Status -->
        <div class="mb-4">
          <label class="font-semibold text-gray-700">Current Status</label>
          <p class="font-bold text-orange-500 mt-1">{{ booking.status }}</p>
        </div>

        <!-- Select new status -->
        <div class="mb-4">
          <label for="newStatus" class="font-semibold text-gray-700">Select new status:</label>
          <select
            id="newStatus"
            v-model="newStatus"
            class="mt-2 w-full border border-gray-300 rounded-lg p-2"
            required
          >
            <option value="">-- Select Status --</option>

            <!-- For Upcoming → Ongoing -->
            <option value="Ongoing" v-if="booking.status === 'Upcoming'">Ongoing</option>

            <!-- For Ongoing → Done -->
            <option value="Done" v-if="booking.status === 'Ongoing'">Done</option>
          </select>
        </div>

        <!-- Buttons -->
        <div class="flex justify-between mt-6">
          <VButton
            label="Back"
            color="secondary"
            @click="router.push('/bookings')"
            class="w-[48%]"
          />

          <VButton
            label="Save"
            color="success"
            @click="saveStatus"
            class="w-[48%]"
          />
        </div>

      </div>

      <div v-else class="text-center text-gray-500">
        Loading booking data...
      </div>
    </div>
  </main>
</template>

<style scoped>
/* optional custom styles */
</style>
