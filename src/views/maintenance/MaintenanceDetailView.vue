<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMaintenanceStore } from '@/stores/maintenance/maintenance.store'
import VButton from '@/components/common/VButton.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string
const store = useMaintenanceStore()

const confirmDelete = async () => {
  if (!confirm('Are you sure to delete this maintenance record?')) return
  await store.remove(id)
  router.push('/maintenance')
}

onMounted(async () => {
  await store.fetchById(id)
})
</script>

<template>
  <main class="pt-24 px-4 max-w-2xl mx-auto">
    <h2 class="text-xl font-bold text-[#1aa546] mb-4">Maintenance Detail</h2>
    <div v-if="store.record" class="bg-white p-6 rounded shadow">
      <p><strong>ID:</strong> {{ store.record.id }}</p>
      <p><strong>Vehicle:</strong> {{ store.record.vehicleDisplay }}</p>
      <p><strong>Service Date:</strong> {{ store.record.serviceDate }}</p>
      <p><strong>Description:</strong> {{ store.record.description }}</p>
      <p><strong>Cost:</strong> {{ store.record.cost }}</p>
      <p><strong>Vendor Note:</strong> {{ store.record.vendorNote }}</p>
      <p><strong>Status:</strong> {{ store.record.status }}</p>

      <div class="flex gap-3 mt-4">
        <VButton
          class="bg-yellow-500 text-white"
          @click="() => router.push(`/maintenance/${store.record.id}/edit`)"
          >Edit</VButton
        >
        <VButton class="bg-red-600 text-white" @click="confirmDelete">Delete</VButton>
      </div>
    </div>
    <div v-else class="text-gray-500">Loading...</div>
  </main>
</template>