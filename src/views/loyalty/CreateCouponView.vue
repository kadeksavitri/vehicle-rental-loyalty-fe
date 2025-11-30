<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useLoyaltyStore } from '@/stores/loyalty/loyalty.store'
import VButton from '@/components/common/VButton.vue'
import VInput from '@/components/common/VInput.vue'
import VTextArea from '@/components/common/VTextArea.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useLoyaltyStore()

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

const submit = async () => {
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

  await store.createCoupon(payload)
  router.push('/loyalty/manage')
}
</script>

<template>
  <main class="pt-24 max-w-xl mx-auto px-4">
    <h2 class="text-xl font-bold text-[#1aa546] mb-4">Create New Coupon</h2>

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
          id="off"
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
        @click="submit"
      >
        Create
      </VButton>
    </div>
  </main>
</template>
