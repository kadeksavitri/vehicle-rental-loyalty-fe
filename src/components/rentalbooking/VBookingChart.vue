<!-- components/rentalbooking/VBookingChart.vue -->
<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps<{
  labels: string[]
  values: number[]
}>()

const canvasEl = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

function renderChart() {
  if (!canvasEl.value) return
  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(canvasEl.value, {
    type: 'bar',
    data: {
      labels: props.labels,
      datasets: [
        {
          label: 'Reservations',
          data: props.values,
          backgroundColor: '#4ade80', // Tailwind green-400
          borderColor: '#22c55e',     // green-500
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      }
    }
  })
}

onMounted(renderChart)
watch(() => [props.labels, props.values], renderChart)
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-lg w-full">
    <canvas ref="canvasEl"></canvas>
  </div>
</template>
