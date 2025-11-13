<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()

const getLinkClass = (path: string) => router.currentRoute.value.path.startsWith(path)
</script>

<template>
  <nav class="bg-white border-b border-gray-200 px-10 py-3 flex justify-between items-center font-sans">
    <RouterLink to="/" class="text-[#1aa546] font-bold text-lg hover:opacity-90 transition">
      Vehicle Rental App
    </RouterLink>

    <div class="flex space-x-8">
      <RouterLink to="/vehicles" class="font-semibold transition-colors":class="getLinkClass('/vehicles') ? 'text-[#1aa546]' : 'text-gray-600 hover:text-[#1aa546]'" > 
        Vehicles 
      </RouterLink>
      <RouterLink to="/bookings" class="font-semibold transition-colors" :class="getLinkClass('/bookings') ? 'text-[#1aa546]' : 'text-gray-600 hover:text-[#1aa546]'">
        Bookings
      </RouterLink>
    </div>
  </nav>
</template>
