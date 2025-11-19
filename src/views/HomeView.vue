<template>
  <main class="min-h-screen bg-[#e8fbe8] py-20 px-4">
    <div
      class="max-w-5xl mx-auto bg-white rounded-3xl shadow-lg p-12 text-center"
    >
      <!-- Title -->
      <h1 class="text-4xl font-bold text-gray-800">
        Welcome to
        <span class="text-[#1aa546]">Vehicle Rentals</span>
      </h1>

      <p class="text-gray-600 mt-4">
        Find and book your ideal vehicle easily. Quick, reliable, and ready
        for your next adventure!
      </p>

      <!-- Platform Statistics Title -->
      <h2 class="text-2xl font-bold text-gray-800 mt-10 mb-6">
        Platform Statistics
      </h2>

      <!-- Cards Row -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center items-center"
      >
        <!-- Vehicles -->
        <div
          class="bg-white border rounded-2xl shadow p-6 flex flex-col items-center"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/743/743131.png"
            alt="vehicle icon"
            class="w-12 mb-2"
          />
          <p class="text-gray-600 text-sm">Registered Vehicles</p>
          <p class="text-3xl font-bold text-gray-800">{{ stats.vehicles }}</p>
        </div>

        <!-- Vendors -->
        <div
          class="bg-white border rounded-2xl shadow p-6 flex flex-col items-center"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="vendor icon"
            class="w-12 mb-2"
          />
          <p class="text-gray-600 text-sm">Registered Vendors</p>
          <p class="text-3xl font-bold text-gray-800">{{ stats.vendors }}</p>
        </div>

        <!-- Bookings -->
        <div
          class="bg-white border rounded-2xl shadow p-6 flex flex-col items-center"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1828/1828673.png"
            alt="booking icon"
            class="w-12 mb-2"
          />
          <p class="text-gray-600 text-sm">Bookings Made</p>
          <p class="text-3xl font-bold text-gray-800">{{ stats.bookings }}</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-10 flex justify-center gap-6">
        <button
          class="bg-[#1aa546] hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition"
          @click="goToVehicles"
        >
          See Vehicles
        </button>

        <button
          class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md transition"
          @click="goToBookings"
        >
          Book Rentals
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useVehicleStore } from "@/stores/vehicle/vehicle.store";
import { useRentalBookingStore } from "@/stores/rentalbooking/rentalbooking.store";

const router = useRouter();
const vehicleStore = useVehicleStore();
const bookingStore = useRentalBookingStore();

const stats = ref({
  vehicles: 0,
  vendors: 5, // statis sesuai gambar
  bookings: 0,
});

onMounted(async () => {
  // Fetch vehicles
  const vehicles = await vehicleStore.fetchVehicles();
  stats.value.vehicles = vehicles?.length ?? 0;

  // Fetch bookings
  const bookings = await bookingStore.fetchRentalBookings();
  stats.value.bookings = bookings?.length ?? 0;
});

const goToVehicles = () => router.push("/vehicles");
const goToBookings = () => router.push("/bookings");
</script>

<style scoped>
</style>
