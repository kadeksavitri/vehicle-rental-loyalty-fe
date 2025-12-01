<template>
  <main class="min-h-screen bg-gradient-to-br from-[#e8fbe8] to-white py-20 px-4">
    <div
      class="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-12 border border-white/40"
    >
      <!-- Title -->
      <h1 class="text-5xl font-extrabold text-gray-800 text-center tracking-tight">
        Welcome to
        <span class="text-[#1aa546]">Vehicle Rentals</span>
      </h1>

      <p class="text-gray-600 text-center mt-4 text-lg max-w-2xl mx-auto">
        Find and book your ideal vehicle easily. Quick, reliable, and ready for your next adventure.
      </p>

      <!-- Platform Statistics Title -->
      <h2 class="text-3xl text-center font-bold text-gray-800 mt-14 mb-8">Platform Overview</h2>

      <!-- Cards Row -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-center">
        <!-- Vehicles -->
        <div
          class="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center border border-gray-100 hover:shadow-xl transition cursor-pointer"
        >
          <div
            class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center shadow-inner"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/743/743131.png"
              alt="vehicle icon"
              class="w-12"
            />
          </div>
          <p class="text-gray-500 text-sm mt-4">Registered Vehicles</p>
          <p class="text-4xl font-extrabold text-gray-900 mt-1">
            {{ stats.vehicles }}
          </p>
        </div>

        <!-- Vendors -->
        <div
          class="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center border border-gray-100 hover:shadow-xl transition cursor-pointer"
        >
          <div
            class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center shadow-inner"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              alt="vendor icon"
              class="w-12"
            />
          </div>
          <p class="text-gray-500 text-sm mt-4">Registered Vendors</p>
          <p class="text-4xl font-extrabold text-gray-900 mt-1">
            {{ stats.vendors }}
          </p>
        </div>

        <!-- Bookings -->
        <div
          class="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center border border-gray-100 hover:shadow-xl transition cursor-pointer"
        >
          <div
            class="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center shadow-inner"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1828/1828673.png"
              alt="booking icon"
              class="w-12"
            />
          </div>
          <p class="text-gray-500 text-sm mt-4">Bookings Made</p>
          <p class="text-4xl font-extrabold text-gray-900 mt-1">
            {{ stats.bookings }}
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-14 flex justify-center gap-6">
        <button
          class="bg-[#1aa546] hover:bg-green-700 text-white px-10 py-4 rounded-2xl font-semibold shadow-lg transition transform hover:-translate-y-1"
          @click="goToVehicles"
        >
          See Vehicles
        </button>

        <button
          class="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-semibold shadow-lg transition transform hover:-translate-y-1"
          @click="goToBookings"
        >
          Book Rentals
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/lib/api'
import { toast } from 'vue-sonner'

const router = useRouter()

const stats = ref({
  vehicles: 0,
  vendors: 0,
  bookings: 0,
})

onMounted(async () => {
  try {
    const response = await apiClient.get('/public/statistics')
    const data = response.data.data

    stats.value.vehicles = data.registeredVehicles ?? 0
    stats.value.vendors = data.registeredVendors ?? 0
    stats.value.bookings = data.bookingsMade ?? 0
  } catch (error) {
    console.error('Failed to fetch statistics:', error)
    toast.error('Failed to load platform statistics')
  }
})

const goToVehicles = () => router.push('/vehicles')
const goToBookings = () => router.push('/bookings')
</script>

<style scoped></style>