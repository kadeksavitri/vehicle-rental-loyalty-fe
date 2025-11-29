<!-- components/rentalbooking/VStatusForm.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRentalBookingStore } from '@/stores/rentalbooking/rentalbooking.store'
import type { RentalBooking, UpdateRentalBookingStatusRequest } from '@/interfaces/rentalbooking.interface'
import VButton from '@/components/common/VButton.vue'

const props = defineProps<{
  booking: RentalBooking
}>()

const emit = defineEmits(['success'])

const router = useRouter()
const store = useRentalBookingStore()

const newStatus = ref('')

const saveStatus = async () => {
  if (!newStatus.value) return

  const payload: UpdateRentalBookingStatusRequest = {
    id: props.booking.id,
    newStatus: newStatus.value
  }

  const updated = await store.updateRentalBookingStatus(payload as any)

  if (updated) {
    emit('success')
  }
}

</script>

<template>
  <div class="bg-white shadow-lg rounded-xl p-10">

    <h2 class="text-2xl font-bold text-green-600 mb-2">
      Update Booking Status
    </h2>

    <hr class="border-gray-300 mb-6" />

    <!-- Booking ID -->
    <div class="mb-4">
      <label class="font-semibold text-gray-700">Booking ID</label>
      <p class="text-gray-900 mt-1">{{ props.booking.id }}</p>
    </div>

    <!-- Current Status -->
    <div class="mb-4">
      <label class="font-semibold text-gray-700">Current Status</label>
      <p class="font-bold text-orange-500 mt-1">{{ props.booking.status }}</p>
    </div>

    <!-- New Status -->
    <div class="mb-4">
      <label for="newStatus" class="font-semibold text-gray-700">Select new status:</label>
      <select
        id="newStatus"
        v-model="newStatus"
        class="mt-2 w-full border border-gray-300 rounded-lg p-2"
        required
      >
        <option value="">-- Select Status --</option>

        <option value="Ongoing" v-if="props.booking.status === 'Upcoming'">Ongoing</option>

        <option value="Done" v-if="props.booking.status === 'Ongoing'">Done</option>
      </select>
    </div>

    <!-- BUTTONS -->
    <div class="flex justify-between gap-3 mt-8">

      <VButton
      
        label="Save"
        color="success"
        class="bg-[#1aa546] hover:bg-[#007f66] text-white font-semibold px-6 py-2 rounded-lg w-32"
        @click="saveStatus"
      > Save
      </VButton>
    </div>

  </div>
</template>
