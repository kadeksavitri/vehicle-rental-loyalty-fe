<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <main class="w-full min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
      <div class="mb-6">
        <div class="text-6xl font-bold text-red-500 mb-2">401</div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Unauthorized</h1>
        <p class="text-gray-600">You do not have permission to access this page.</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          @click="goBack"
          class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
        >
          Go Back
        </button>
        <button
          @click="goHome"
          class="px-6 py-2 bg-[#1aa546] text-white rounded-lg hover:bg-[#147c35] font-medium transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  </main>
</template>