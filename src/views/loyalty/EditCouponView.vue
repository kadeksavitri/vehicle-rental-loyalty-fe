<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoyaltyStore } from '@/stores/loyalty/loyalty.store'
import VInput from '@/components/common/VInput.vue'
import VTextArea from '@/components/common/VTextArea.vue'
import VButton from '@/components/common/VButton.vue'

const store = useLoyaltyStore()
const route = useRoute()
const router = useRouter()

const id = route.params.id as string

const form = reactive({
  name: '',
  description: '',
  points: '',
  percentOff: '',
})

const touched = reactive({
  name: false,
  description: false,
  points: false,
  percentOff: false,
})

const errors = computed(() => ({
  name: !form.name.trim() ? 'Name is required' : '',
  description: !form.description.trim() ? 'Description is required' : '',
  points: !form.points || Number(form.points) <= 0 ? 'Points must be greater than 0' : '',
  percentOff:
    !form.percentOff || Number(form.percentOff) <= 0 ? 'Percent off must be greater than 0' : '',
}))

const isValid = computed(
  () =>
    Object.values(errors.value).every((err) => !err) &&
    form.name.trim() &&
    form.description.trim() &&
    form.points &&
    form.percentOff,
)

const markAllTouched = () => {
  touched.name = true
  touched.description = true
  touched.points = true
  touched.percentOff = true
}

onMounted(async () => {
  await store.fetchAllCoupons()
  const c = store.coupons.find((coupon: any) => coupon.id === id)

  if (!c) return

  form.name = c.name
  form.description = c.description
  form.points = String(c.points)
  form.percentOff = String(c.percentOff)
})

const save = async () => {
  markAllTouched()

  if (!isValid.value) {
    return
  }

  const payload = {
    name: form.name.trim(),
    description: form.description.trim(),
    points: Number(form.points),
    percentOff: Number(form.percentOff),
  }

  await store.updateCoupon(id, payload)
  router.push('/loyalty/manage')
}
</script>

<template>
  <main class="pt-24 max-w-xl mx-auto px-4">
    <h2 class="text-xl font-bold text-[#1aa546] mb-4">Edit Coupon</h2>

    <div class="bg-white p-6 rounded-xl shadow flex flex-col gap-4">
      <div>
        <VInput id="name" label="Name" v-model="form.name" @input="touched.name = true" />
        <p v-if="touched.name && errors.name" class="text-sm text-red-600 mt-1">
          {{ errors.name }}
        </p>
      </div>

      <div>
        <VTextArea
          id="desc"
          label="Description"
          v-model="form.description"
          @input="touched.description = true"
        />
        <p v-if="touched.description && errors.description" class="text-sm text-red-600 mt-1">
          {{ errors.description }}
        </p>
      </div>

      <div>
        <VInput
          id="points"
          type="number"
          label="Points"
          v-model="form.points"
          @input="touched.points = true"
        />
        <p v-if="touched.points && errors.points" class="text-sm text-red-600 mt-1">
          {{ errors.points }}
        </p>
      </div>

      <div>
        <VInput
          id="percentOff"
          type="number"
          label="Percent Off"
          v-model="form.percentOff"
          @input="touched.percentOff = true"
        />
        <p v-if="touched.percentOff && errors.percentOff" class="text-sm text-red-600 mt-1">
          {{ errors.percentOff }}
        </p>
      </div>

      <VButton
        class="bg-[#1aa546] text-white"
        :class="{ 'opacity-50 cursor-not-allowed': !isValid }"
        :disabled="!isValid"
        @click="save"
      >
        Update
      </VButton>
    </div>
  </main>
</template>