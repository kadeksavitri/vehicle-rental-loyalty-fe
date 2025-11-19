<!-- views/rentalbooking/EditStatusBookingView.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRentalBookingStore } from '@/stores/rentalbooking/rentalbooking.store'
import type { RentalBooking } from '@/interfaces/rentalbooking.interface'
import VStatusForm from '@/components/rentalbooking/VStatusForm.vue'

const route = useRoute()
const router = useRouter()
const store = useRentalBookingStore()

const bookingId = route.params.id as string
const booking = ref<RentalBooking | null>(null)

const loadBooking = async () => {
  const data = await store.getRentalBooking(bookingId)
  if (!data) {
    router.replace('/bookings')
    return
  }
  booking.value = data
}

onMounted(loadBooking)

const handleSuccess = () => {
  router.push('/bookings')
}
</script>

<template>
  <main class="w-full min-h-screen bg-gray-100 pt-24 pb-16 px-4 flex justify-center">
    <div class="w-full max-w-3xl">
      <VStatusForm
        v-if="booking"
        :booking="booking"
        @success="handleSuccess"
      />
    </div>
  </main>
</template>
