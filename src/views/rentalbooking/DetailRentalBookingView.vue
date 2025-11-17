<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { useRentalBookingStore } from '@/stores/rentalbooking/rentalbooking.store'
import VButton from '@/components/common/VButton.vue'
import type { RentalBooking } from '@/interfaces/rentalbooking.interface'

const route = useRoute()
const router = useRouter()
const rentalBookingStore = useRentalBookingStore()

const { id: bookingId } = route.params as { id: string }

const rentalbooking = ref(undefined as undefined | RentalBooking)
const showAddOnModal = ref(false)

const getRentalBooking = async () => {
  const getRentalBookingResponse = await rentalBookingStore.getRentalBooking(bookingId)
  rentalbooking.value = getRentalBookingResponse ?? undefined
}

onMounted(async () => {
  await getRentalBooking()
  if (!rentalbooking.value) {
    toast.error('Booking not found')
    router.replace('/bookings')
  }
})

const canUpdateDetails = computed(() => rentalbooking.value?.status === 'Upcoming')
const canUpdateAddons = computed(() => rentalbooking.value?.status === 'Upcoming')
const canUpdateStatus = computed(() =>
  rentalbooking.value?.status === 'Upcoming' || rentalbooking.value?.status === 'Ongoing'
)
const canCancel = computed(() => rentalbooking.value?.status === 'Upcoming')

</script>

<template>
  <main class="w-full min-h-screen bg-gray-100 pt-24 py-10 px-4 flex justify-center">
    <div class="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8">

      <!-- HEADER -->
      <div class="flex justify-between items-center border-b pb-4 mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Booking Details</h2>

        <div class="flex gap-3">
          <!-- Update Details -->
          <VButton
            v-if="canUpdateDetails"
            color="success"
            label="Update Details"
            @click="router.push(`/bookings/${rentalbooking?.id}/update-details`)"
          />

          <!-- Update Add-ons -->
          <VButton
            v-if="canUpdateAddons"
            color="info"
            label="Update Add-Ons"
            @click="router.push(`/bookings/${rentalbooking?.id}/update-addons`)"
          />

          <!-- Update Status -->
          <VButton
            v-if="canUpdateStatus"
            color="warning"
            label="Update Status"
            @click="router.push(`/bookings/${rentalbooking?.id}/update-status`)"
          />

          <!-- Cancel -->
          <VButton
            v-if="canCancel"
            color="danger"
            label="Cancel"
            @click="router.push(`/bookings/${rentalbooking?.id}/delete`)"
          />
        </div>
      </div>

      <!-- DETAILS GRID -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 text-gray-700">

        <!-- LEFT -->
        <div>
          <p>
            <strong>Booking ID</strong><br />
            <span class="text-green-600 font-semibold">{{ rentalbooking?.id }}</span>
          </p>

          <p>
            <strong>Pick-up Time</strong><br />
            <span class="text-green-600 font-semibold">
              {{ new Date(rentalbooking?.pickUpTime!).toLocaleString() }}
            </span>
          </p>

          <p>
            <strong>Pick-up Location</strong><br />
            <span class="text-green-600 font-semibold">{{ rentalbooking?.pickUpLocation }}</span>
          </p>

          <p>
            <strong>Include Driver?</strong><br />
            <span>{{ rentalbooking?.includeDriver ? 'Yes' : 'No' }}</span>
          </p>

          <p>
            <strong>Total Price</strong><br />
            <span class="text-green-600 font-semibold">
              Rp {{ rentalbooking?.totalPrice.toLocaleString('id-ID') }}
            </span>
          </p>
        </div>

        <!-- RIGHT -->
        <div>
          <p>
            <strong>Vehicle ID</strong><br />
            <span
              class="text-green-600 font-semibold underline cursor-pointer"
              @click="router.push(`/vehicles/${rentalbooking?.vehicleId}`)"
            >
              {{ rentalbooking?.vehicleId }}
            </span>
          </p>

          <p>
            <strong>Drop-off Time</strong><br />
            <span class="text-green-600 font-semibold">
              {{ new Date(rentalbooking?.dropOffTime!).toLocaleString() }}
            </span>
          </p>

          <p>
            <strong>Drop-off Location</strong><br />
            <span class="text-green-600 font-semibold">{{ rentalbooking?.dropOffLocation }}</span>
          </p>

          <p>
            <strong>Status</strong><br />
            <span class="text-green-600 font-semibold">{{ rentalbooking?.status }}</span>
          </p>
        </div>
      </div>

      <!-- BOTTOM BUTTONS -->
      <div class="mt-10 flex flex-col gap-4">
        <VButton
          label="View Add-Ons"
          color="dark"
          class="w-full"
          @click="showAddOnModal = true"
        />

        <VButton
          label="Back"
          color="secondary"
          class="w-full"
          @click="router.push('/bookings')"
        />
      </div>
    </div>

    <!-- MODAL ADD-ONS -->
    <div
      v-if="showAddOnModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
      @click.self="showAddOnModal = false"
    >
      <div class="bg-white p-6 rounded-xl w-full max-w-xl shadow-lg">
        <div class="flex justify-between items-center border-b pb-3 mb-3">
          <h3 class="text-xl font-semibold">Included Add-Ons</h3>
          <button class="text-gray-500 text-2xl" @click="showAddOnModal = false">&times;</button>
        </div>

        <ul class="list-disc pl-5 text-gray-700" v-if="rentalbooking?.listOfAddOns?.length">
          <li v-for="addon in rentalbooking.listOfAddOns" :key="addon.id">
            {{ addon.name }} – Rp {{ addon.price.toLocaleString('id-ID') }}
          </li>
        </ul>

        <p v-else class="text-gray-500 italic">No add-ons included.</p>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
