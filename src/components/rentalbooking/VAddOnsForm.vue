<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import VButton from '../common/VButton.vue'
import type { RentalAddOn, RentalBooking } from '@/interfaces/rentalbooking.interface'

const router = useRouter()

const props = defineProps<{
  booking: RentalBooking
  addons: RentalAddOn[]
  onSubmit: (updatedBooking: RentalBooking) => Promise<void>
  isEdit?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

// ✅ reactive copy dari booking agar tidak mutate langsung prop
const model = ref<RentalBooking>({ ...props.booking })

// semua id add-ons yang dicentang
const selectedAddOns = ref<string[]>(model.value.listOfAddOns?.map(a => a.id) || [])

// ketika checklist berubah → update model
watch(selectedAddOns, (val) => {
  model.value.listOfAddOns = props.addons.filter(a => val.includes(a.id))
})

// total harga add-ons terpilih
const addOnTotal = computed(() =>
  props.addons
    .filter(a => selectedAddOns.value.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0)
)

// submit handler
const handleSubmit = async () => {
  await props.onSubmit(model.value)
}

const handleBack = () => {
  router.push('/bookings/create')
}
</script>

<template>
  <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 font-sans">
    <h2 class="text-xl font-bold text-[#1aa546] mb-2">
      {{ props.isEdit ? 'Update Booking Add-Ons' : 'Choose Add-Ons for Your Booking' }}
    </h2>
    <div class="h-[2px] bg-[#1aa546] rounded mb-4"></div>

    <!-- Daftar Add-Ons -->
    <p class="font-semibold mb-3 text-gray-700">Choose Add-Ons</p>
    <div
      v-for="addon in props.addons"
      :key="addon.id"
      class="flex justify-between items-center border border-gray-200 rounded-lg px-4 py-2 mb-2 hover:bg-green-50 transition"
    >
      <label class="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          class="w-4 h-4 accent-[#1aa546]"
          :value="addon.id"
          v-model="selectedAddOns"
        />
        <span class="text-gray-700 font-medium">{{ addon.name }}</span>
      </label>
      <span class="text-[#1aa546] font-bold">
        Rp {{ addon.price.toLocaleString('id-ID') }}
      </span>
    </div>

    <!-- Total Add-On Price -->
    <div class="mt-4 text-right font-semibold text-gray-800">
      Add-On Total:
      <span class="text-[#1aa546]">Rp {{ addOnTotal.toLocaleString('id-ID') }}</span>
    </div>

    <!-- Tombol -->
    <div class="flex justify-between mt-6 gap-3">
      <VButton
        type="button"
        class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg w-full"
        @click="handleBack"
      >
        Previous
      </VButton>
      <VButton
        type="button"
        class="bg-[#1aa546] hover:bg-[#007f66] text-white font-semibold py-2 rounded-lg w-full"
        @click="handleSubmit"
      >
        {{ props.isEdit ? 'Save Changes' : 'Save Add-Ons' }}
      </VButton>
    </div>
  </div>
</template>

<style scoped>
input[type='checkbox'] {
  cursor: pointer;
}
</style>
