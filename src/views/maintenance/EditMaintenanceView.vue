<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMaintenanceStore } from '@/stores/maintenance/maintenance.store'
import { useVehicleStore } from '@/stores/vehicle/vehicle.store'
import VButton from '@/components/common/VButton.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string
const store = useMaintenanceStore()
const vehicleStore = useVehicleStore()

const form = ref({
  id: '',
  vehicleId: '',
  serviceDate: '',
  description: '',
  cost: '',
  vendorNote: '',
  status: '',
})

onMounted(async () => {
  await vehicleStore.fetchVehicles()
  await store.fetchById(id)
  if (store.record) {
    form.value = {
      id: store.record.id,
      vehicleId: store.record.vehicleId,
      serviceDate: store.record.serviceDate,
      description: store.record.description ?? '',
      cost: String(store.record.cost ?? ''),
      vendorNote: store.record.vendorNote ?? '',
      status: store.record.status,
    }
  }
})

const submit = async () => {
  if (!form.value.vehicleId || !form.value.serviceDate) {
    alert('vehicleId and serviceDate are required')
    return
  }
  if (!confirm('Are you sure want to update this maintenance record?')) return

  await store.update(id, {
    id: form.value.id,
    vehicleId: form.value.vehicleId,
    serviceDate: form.value.serviceDate,
    description: form.value.description,
    cost: Number(form.value.cost) || 0,
    vendorNote: form.value.vendorNote,
    status: form.value.status,
  })
  router.push(`/maintenance/${id}`)
}
</script>

<template>
  <main class="pt-24 px-4 max-w-2xl mx-auto">
    <h2 class="text-xl font-bold text-[#1aa546] mb-4">Edit Maintenance</h2>
    <div class="bg-white p-6 rounded shadow">
      <label class="block mb-2">Vehicle</label>
      <select v-model="form.vehicleId" class="border px-3 py-2 w-full mb-3">
        <option value="">-- Select Vehicle --</option>
        <option v-for="v in vehicleStore.vehicles" :key="v.id" :value="v.id">
          {{ v.id }} - {{ v.licensePlate }}
        </option>
      </select>

      <label class="block mb-2">Service Date</label>
      <input
        type="datetime-local"
        v-model="form.serviceDate"
        class="border px-3 py-2 w-full mb-3"
      />

      <label class="block mb-2">Description</label>
      <textarea v-model="form.description" class="border px-3 py-2 w-full mb-3"></textarea>

      <label class="block mb-2">Cost</label>
      <input type="number" v-model="form.cost" class="border px-3 py-2 w-full mb-3" />

      <label class="block mb-2">Vendor Note</label>
      <textarea v-model="form.vendorNote" class="border px-3 py-2 w-full mb-3"></textarea>

      <label class="block mb-2">Status</label>
      <select v-model="form.status" class="border px-3 py-2 w-full mb-3">
        <option>Ongoing</option>
        <option>Completed</option>
      </select>

      <div class="flex gap-3">
        <VButton
          class="bg-gray-500 text-white"
          @click.prevent="() => router.push(`/maintenance/${id}`)"
          >Cancel</VButton
        >
        <VButton class="bg-[#1aa546] text-white" @click.prevent="submit">Update</VButton>
      </div>
    </div>
  </main>
</template>
