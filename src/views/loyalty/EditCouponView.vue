<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoyaltyStore } from '@/stores/loyalty/loyalty.store'
import VInput from '@/components/common/VInput.vue'
import VTextArea from '@/components/common/VTextArea.vue'
import VButton from '@/components/common/VButton.vue'
import type { UpdateCouponRequest } from '@/interfaces/loyalty.interface'

const store = useLoyaltyStore()
const route = useRoute()
const router = useRouter()

const id = route.params.id as string

const form = ref<UpdateCouponRequest>({
  name: '',
  description: '',
  points: 0,
  percentOff: 0
})

onMounted(async () => {
  await store.fetchAllCoupons()
  const c = store.coupons.find(c => c.id === id)

  if (!c) return

  form.value = {
    name: c.name,
    description: c.description,
    points: c.points,
    percentOff: c.percentOff
  }
})

const save = async () => {
  await store.updateCoupon(id, form.value)
  router.push('/loyalty/admin')
}
</script>

<template>
  <main class="pt-24 max-w-xl mx-auto px-4">
    <h2 class="text-xl font-bold text-[#1aa546] mb-4">Edit Coupon</h2>

    <div class="bg-white p-6 rounded-xl shadow flex flex-col gap-4">
      <VInput id="name" label="Name" v-model="form.name" />
      <VTextArea id="desc" label="Description" v-model="form.description" />
      <VInput id="points" type="number" label="Points" v-model="form.points" />
      <VInput id="percentOff" type="number" label="Percent Off" v-model="form.percentOff" />

      <VButton class="bg-[#1aa546] text-white" @click="save">Update</VButton>
    </div>
  </main>
</template>
