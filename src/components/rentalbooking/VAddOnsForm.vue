<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import VButton from '@/components/common/VButton.vue'

import type {
  RentalAddOn,
  CreateRentalBookingRequest
} from '@/interfaces/rentalbooking.interface'

const props = defineProps<{
  booking: CreateRentalBookingRequest
  addons: RentalAddOn[]
  onSubmit: (updatedBooking: CreateRentalBookingRequest) => Promise<void>
  isEdit?: boolean
}>()

const router = useRouter()

// MODEL BOOKING
const model = ref<CreateRentalBookingRequest>({ ...props.booking })

// SELECTED ADDONS (list of ID strings)
const selectedAddOns = ref<string[]>(
  Array.isArray(model.value.listOfAddOns)
    ? model.value.listOfAddOns
    : []
)

// sync checkbox → model
watch(selectedAddOns, (ids) => {
  model.value.listOfAddOns = ids
})

// submit data
const handleSubmit = async () => {
  await props.onSubmit(model.value)
}

const handleBack = () => {
  router.push('/bookings/create')
}
</script>

<template>
  <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-md px-10 py-10">

    <!-- TITLE -->
    <h2 class="text-xl font-bold text-[#1aa546] mb-6">
      Create a New Booking
    </h2>

    <p class="text-lg font-semibold text-gray-700 mb-4">Choose Add-Ons</p>

    <!-- ADD-ON LIST -->
    <div class="flex flex-col gap-3">
      <div
        v-for="addon in props.addons"
        :key="addon.id"
        class="flex justify-between items-center border border-gray-300 rounded-lg px-5 py-3 bg-white"
      >
        <label class="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            :value="addon.id"
            v-model="selectedAddOns"
            class="w-4 h-4 accent-[#1aa546]"
          />
          <span class="text-gray-700 font-medium">{{ addon.name }}</span>
        </label>

        <span class="text-[#1aa546] font-bold">
          Rp {{ addon.price.toLocaleString('id-ID') }},
        </span>
      </div>
    </div>

    <!-- BUTTONS -->
    <div class="flex gap-4 mt-8">
      <VButton
        class="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold"
        @click="handleBack"
      >
        Previous
      </VButton>

      <VButton
        class="w-full bg-[#1aa546] hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
        @click="handleSubmit"
      >
        Save
      </VButton>
    </div>

  </div>
</template>
