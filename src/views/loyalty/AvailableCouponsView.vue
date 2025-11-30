<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useLoyaltyStore } from '@/stores/loyalty/loyalty.store'
import { useAuthStore } from '@/stores/auth/auth.store'
import VButton from '@/components/common/VButton.vue'
import VDataTable from '@/components/common/VDataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { isSuperadmin, isCustomer } from '@/lib/rbac'
import type { Coupon } from '@/interfaces/loyalty.interface'

const store = useLoyaltyStore()
const authStore = useAuthStore()
const customerId = authStore.user?.id ?? ''

const showPurchaseModal = ref(false)
const selectedCoupon = ref<Coupon | null>(null)
const userPoints = ref(0)

onMounted(async () => {
  await store.fetchAllCoupons()
  if (isCustomer() && customerId) {
    await store.fetchPoints(customerId)
    userPoints.value = store.points
  }
})

const columns: ColumnDef<any>[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Points', accessorKey: 'points' },
  { header: 'Discount %', accessorKey: 'percentOff' },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => null,
  },
]

const openPurchaseModal = (coupon: Coupon) => {
  selectedCoupon.value = coupon
  showPurchaseModal.value = true
}

const confirmPurchase = async () => {
  if (!selectedCoupon.value) return

  if (userPoints.value < selectedCoupon.value.points) {
    alert(
      `Insufficient points! You have ${userPoints.value} points but need ${selectedCoupon.value.points} points.`,
    )
    return
  }

  try {
    await store.purchaseCoupon(customerId, selectedCoupon.value.id)
    await store.fetchPoints(customerId)
    userPoints.value = store.points
    showPurchaseModal.value = false
    selectedCoupon.value = null
  } catch (error) {
    alert('Failed to purchase coupon. Please try again.')
  }
}

const cancelPurchase = () => {
  showPurchaseModal.value = false
  selectedCoupon.value = null
}
</script>

<template>
  <main class="pt-24 px-4">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-xl font-bold text-[#1aa546]">
          {{ isSuperadmin() ? 'Manage Coupons' : 'Available Coupons' }}
        </h2>
      </div>
      <div class="flex items-center gap-4">
        <router-link v-if="isSuperadmin()" to="/loyalty/admin/create">
          <VButton class="bg-[#1aa546] text-white px-6">Create Coupon</VButton>
        </router-link>
        <div v-if="isCustomer()" class="text-sm font-semibold text-gray-700">
          Your Points: <span class="text-[#1aa546]">{{ userPoints }}</span>
        </div>
      </div>
    </div>

    <VDataTable :data="store.coupons" :columns="columns">
      <template #cell="{ column, cell }">
        <template v-if="column.id === 'actions'">
          <router-link v-if="isSuperadmin()" :to="`/loyalty/admin/edit/${cell.row.original.id}`">
            <VButton class="bg-blue-600 text-white text-sm px-4 py-1">Edit</VButton>
          </router-link>
          <VButton
            v-else-if="isCustomer()"
            class="bg-[#1aa546] text-white text-sm px-4 py-1"
            @click="openPurchaseModal(cell.row.original)"
          >
            Purchase
          </VButton>
        </template>
        <template v-else>
          {{ cell.getValue() }}
        </template>
      </template>
    </VDataTable>

    <!-- Purchase Confirmation Modal -->
    <div
      v-if="showPurchaseModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold text-gray-800 mb-4">Confirm Purchase</h3>

        <div v-if="selectedCoupon" class="space-y-3 mb-6">
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-600">Coupon:</p>
            <p class="font-semibold text-gray-800">{{ selectedCoupon.name }}</p>
            <p class="text-sm text-gray-600 mt-2">{{ selectedCoupon.description }}</p>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Discount:</span>
            <span class="font-semibold text-[#1aa546]">{{ selectedCoupon.percentOff }}%</span>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Points Required:</span>
            <span class="font-semibold text-gray-800">{{ selectedCoupon.points }}</span>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Your Current Points:</span>
            <span
              class="font-semibold"
              :class="userPoints >= selectedCoupon.points ? 'text-[#1aa546]' : 'text-red-600'"
            >
              {{ userPoints }}
            </span>
          </div>

          <div
            v-if="userPoints < selectedCoupon.points"
            class="bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <p class="text-sm text-red-700">
              ⚠️ Insufficient points! You need {{ selectedCoupon.points - userPoints }} more points
              to purchase this coupon.
            </p>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="cancelPurchase"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            @click="confirmPurchase"
            :disabled="selectedCoupon && userPoints < selectedCoupon.points"
            class="flex-1 px-4 py-2 bg-[#1aa546] text-white rounded-lg hover:bg-[#147e35] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Purchase
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
