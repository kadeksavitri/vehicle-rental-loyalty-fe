<script setup lang="ts">
import VButton from '../common/VButton.vue'
import { useRentalBookingStore } from '@/stores/rentalbooking/rentalbooking.store'
import { toast } from 'vue-sonner'

const emit = defineEmits(['deleted'])

const { rentalBookingId } = defineProps({
  rentalBookingId: {
    type: String,
    required: true,
  },
})

const vehicleStore = useRentalBookingStore()

const deleteRentalBooking = async () => {
  try {
    await vehicleStore.deleteRentalBooking({ id: rentalBookingId })
    toast.success('Booking deleted successfully')
    emit('deleted', rentalBookingId)
  } catch (error) {
    toast.error('Failed to delete booking')
  }
}

</script>

<template>
  <VButton @click="deleteRentalBooking" class="del-button">Hapus</VButton>
</template>

<style scoped>
@reference "@/assets/main.css";

.del-button {
  @apply bg-rose-600 hover:bg-rose-800 text-white
}
</style>