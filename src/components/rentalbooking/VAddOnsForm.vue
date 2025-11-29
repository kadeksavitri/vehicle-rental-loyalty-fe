<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import VButton from '@/components/common/VButton.vue'
import type { RentalAddOn } from '@/interfaces/rentalbooking.interface'
import { normalizeAddOnIds } from '@/utils/addon-normalizer'

const props = defineProps<{
  bookingAddOns: string[]
  addons: RentalAddOn[]
  onSubmit: (updated: string[]) => Promise<void>
  isEdit?: boolean
}>()

const selectedAddOns = ref<string[]>(normalizeAddOnIds(props.bookingAddOns, props.addons))

watch(
  () => [props.bookingAddOns, props.addons],
  () => {
    selectedAddOns.value = normalizeAddOnIds(props.bookingAddOns, props.addons)
  },
  { deep: true }
)

const handleSubmit = async () => {
  await props.onSubmit(selectedAddOns.value)
}


const router = useRouter()
const route = useRoute()


const handleBack = () => router.push(`/bookings/${route.params.id}`)
</script>

<template>
  <div class="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-300 shadow-md px-10 py-10">

    <h2 class="text-xl font-bold text-[#1aa546] mb-6">
      {{ isEdit ? 'Update Booking Add-Ons' : 'Create a New Booking' }}
    </h2>

    <div class="border-b border-gray-500 -mt-6"></div>

    <div class="flex flex-col gap-3">
      <h2 class="text-lg font-bold text-gray-700 mt-6 ">Choose Add-Ons</h2>
      <div
        v-for="addon in addons"
        :key="addon.id"
        class="flex justify-between items-center border border-gray-300 rounded-lg px-5 py-3"
      >
        <label class="flex items-center gap-3">
          <input
            type="checkbox"
            :value="addon.id"
            v-model="selectedAddOns"
            class="w-4 h-4 accent-[#1aa546]"
          />
          <span>{{ addon.name }}</span>
        </label>

        <span class="text-[#1aa546] font-bold">
          Rp {{ addon.price.toLocaleString('id-ID') }}
        </span>
      </div>
    </div>

    <div class="flex gap-4 mt-8">
      <VButton class="w-full bg-gray-500 text-white" @click="handleBack">Cancel</VButton>
      <VButton class="w-full bg-[#1aa546] text-white" @click="handleSubmit">Save</VButton>
    </div>

  </div>
</template>
