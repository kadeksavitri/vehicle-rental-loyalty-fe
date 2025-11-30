<!-- <script setup lang="ts">
import { ref } from 'vue'
import { useLoyaltyStore } from '@/stores/loyalty/loyalty.store'
import VButton from '@/components/common/VButton.vue'
import VInput from '@/components/common/VInput.vue'
import VTextArea from '@/components/common/VTextArea.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useLoyaltyStore()

const form = ref({
  name: '',
  description: '',
  points: 0,
  percentOff: 0
})

const submit = async () => {
  await store.createCoupon(form.value)
  router.push('/loyalty/admin')
}
</script>

<template>
  <main class="pt-24 max-w-xl mx-auto px-4">
    <h2 class="text-xl font-bold text-[#1aa546] mb-4">Create New Coupon</h2>

    <div class="bg-white p-6 rounded-xl shadow flex flex-col gap-4">
      <VInput id="name" label="Name" v-model="form.name" />
      <VTextArea id="desc" label="Description" v-model="form.description" />
      <VInput id="points" type="number" label="Points" v-model="form.points" />
      <VInput id="off" type="number" label="Percent Off" v-model="form.percentOff" />

      <VButton class="bg-[#1aa546] text-white" @click="submit">Save</VButton>
    </div>
  </main>
</template> -->
