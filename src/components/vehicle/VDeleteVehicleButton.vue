<script setup lang="ts">
import VButton from '../common/VButton.vue'

const emit = defineEmits(['deleted'])

const { vehicleId } = defineProps({
  vehicleId: {
    type: String,
    required: true,
  },
})

const handleDeleteClick = () => {
  emit('deleted', vehicleId)
}
</script>

<template>
  <VButton @click="handleDeleteClick" class="del-button">Delete Vehicle</VButton>
</template>

<style scoped>
@reference "@/assets/main.css";

.del-button {
  @apply bg-rose-600 hover:bg-rose-800 text-white px-4  whitespace-nowrap;
}
</style>
