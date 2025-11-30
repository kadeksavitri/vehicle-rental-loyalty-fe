import { defineStore } from 'pinia'
import apiClient from '@/lib/api'
import { toast } from 'vue-sonner'
import type { RentalAddOn } from '@/interfaces/addon.interface'

export const useAddOnStore = defineStore('addon', {
  state: () => ({
    addOns: [] as RentalAddOn[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchAddOns() {
      this.loading = true
      this.error = null

      try {
        const res = await apiClient.get('/addons')
        this.addOns = res.data ?? []
        return this.addOns
      } catch (err: any) {
        this.error = err.message
        toast.error('Gagal memuat add-ons: ' + err.message)
      } finally {
        this.loading = false
      }
    },
  },
})