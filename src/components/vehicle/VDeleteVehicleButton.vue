<script setup lang="ts">
import VButton from '../common/VButton.vue'
import { useVehicleStore } from '@/stores/vehicle/vehicle.store'
import { toast } from 'vue-sonner'

const emit = defineEmits(['deleted'])

const { vehicleId } = defineProps({
  vehicleId: {
    type: String,
    required: true,
  },
})

const vehicleStore = useVehicleStore()

const deleteVehicle = async () => {
  try {
    await vehicleStore.deleteVehicle(vehicleId)
    toast.success('Vehicle deleted successfully')
    // Emit after successful deletion
    emit('deleted', vehicleId)
  } catch (error) {
    toast.error('Failed to delete vehicle')
  }
}
</script>

<template>
  <VButton @click="deleteVehicle" class="del-button">Hapus</VButton>
</template>

<style scoped>
@reference "@/assets/main.css";

.del-button {
  @apply bg-rose-600 hover:bg-rose-800 text-white
}
</style>