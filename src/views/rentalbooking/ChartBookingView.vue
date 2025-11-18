<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import VBookingChart from '@/components/rentalbooking/VBookingChart.vue'
import { toast } from 'vue-sonner'
import { useRentalBookingStore } from '@/stores/rentalbooking/rentalbooking.store'

const store = useRentalBookingStore()

const period = ref<'Monthly' | 'Quarterly'>('Quarterly')
const year = ref(new Date().getFullYear())

const labels = ref<string[]>([])
const values = ref<number[]>([])
const loading = ref(false)

async function loadChart() {
  loading.value = true
  labels.value = []
  values.value = []
  try {
    // Use store action which posts JSON body (backend expects @RequestBody)
    const data = await store.chartRentalBookings({ period: period.value, year: year.value })
    const items = data ?? []
    labels.value = items.map((d: any) => d[0])
    values.value = items.map((d: any) => Number(d[1] ?? 0))
  } catch (err: any) {
    const serverMessage = err?.response?.data?.message || err?.message
    const status = err?.response?.status
    if (serverMessage) {
      toast.error(`Failed to load chart data: ${serverMessage}`)
    } else if (status) {
      toast.error(`Failed to load chart data (status ${status})`)
    } else {
      toast.error('Failed to load chart data')
    }
    console.error('Chart load error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadChart)
watch([period, year], loadChart)
</script>

<template>
  <main class="w-full min-h-screen bg-gray-100 pt-8 pb-10 px-4 flex flex-col items-center">

    <h1 class="text-3xl font-bold text-[#1aa546] mb-6">
      Rental Booking Dashboard
    </h1>

    <!-- FILTERS -->
    <div class="bg-white rounded-xl shadow-md p-6 flex gap-6 items-center mb-10 w-full max-w-4xl justify-center">
      <div class="flex items-center gap-3">
        <label class="font-semibold">View By:</label>
        <select v-model="period" class="border border-gray-300 rounded px-3 py-1">
          <option value="Monthly">Monthly</option>
          <option value="Quarterly">Quarterly</option>
        </select>
      </div>

      <div class="flex items-center gap-3">
        <label class="font-semibold">Year:</label>
        <select v-model="year" class="border border-gray-300 rounded px-3 py-1">
          <option v-for="y in 50" :key="y" :value="2000 + y">
            {{ 2000 + y }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading">Loading chart...</div>

    <!-- CHART SECTION -->
    <div v-if="!loading" class="w-full max-w-4xl">
      
      <VBookingChart :labels="labels" :values="values" />

      <!-- TABLE -->
      <div class="bg-white mt-6 p-6 rounded-xl shadow-md">
        <h3 class="font-semibold text-lg mb-4">
          Booking Results ({{ period }}) for {{ year }}
        </h3>

        <table class="w-full text-center border-collapse">
          <thead class="font-bold bg-gray-100">
            <tr>
              <th v-for="label in labels" :key="label" class="py-2 border">
                {{ label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="value in values" :key="value" class="py-2 border">
                {{ value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

  </main>
</template>

<style scoped>
select {
  min-width: 120px;
}
</style>
