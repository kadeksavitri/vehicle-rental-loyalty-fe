<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMaintenanceStore } from '@/stores/maintenance/maintenance.store'
import { useVehicleStore } from '@/stores/vehicle/vehicle.store'
import VButton from '@/components/common/VButton.vue'

const router = useRouter()
const store = useMaintenanceStore()
const vehicleStore = useVehicleStore()

const form = ref({ vehicleId: '', serviceDate: '', description: '', cost: '', vendorNote: '' })

onMounted(async () => {
  await vehicleStore.fetchVehicles()
})

const submit = async () => {
  // basic validation
  if (!form.value.vehicleId || !form.value.serviceDate) {
    alert('vehicleId and serviceDate are required')
    return
  }
  // check vehicle availability
  const v = vehicleStore.vehicles.find((x: any) => x.id === form.value.vehicleId)
  if (v && v.status !== 'Available') {
    alert('Vehicle harus berstatus Available untuk membuat maintenance record')
    return
  }

  await store.create({
    vehicleId: form.value.vehicleId,
    serviceDate: form.value.serviceDate,
    description: form.value.description,
    cost: Number(form.value.cost) || 0,
    vendorNote: form.value.vendorNote,
  })
  router.push('/maintenance')
}
</script>

<template>
  <main class="pt-24 px-4 max-w-2xl mx-auto">
    <h2 class="text-xl font-bold text-[#1aa546] mb-4">Create Maintenance</h2>
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

      <div class="flex gap-3">
        <VButton class="bg-gray-500 text-white" @click.prevent="() => router.push('/maintenance')"
          >Cancel</VButton
        >
        <VButton class="bg-[#1aa546] text-white" @click.prevent="submit">Create</VButton>
      </div>
    </div>
  </main>
</template>
