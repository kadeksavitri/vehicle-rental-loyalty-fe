import { defineStore } from 'pinia'
import axios from 'axios'
import { toast } from 'vue-sonner'
import type { RentalAddOn } from '@/interfaces/addon.interface'

const baseUrl = import.meta.env.VITE_API_URL + '/addons'

export const useAddOnStore = defineStore('addon', {
  state: () => ({
    addOns: [] as RentalAddOn[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchAddOns() {
      this.loading = true
      this.error = null

      try {
        const res = await axios.get(baseUrl)
        this.addOns = res.data ?? []
        return this.addOns
      } catch (err: any) {
        this.error = err.message
        toast.error("Gagal memuat add-ons: " + err.message)
      } finally {
        this.loading = false
      }
    }
  }
})
