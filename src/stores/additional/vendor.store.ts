import { defineStore } from 'pinia'
import apiClient from '@/lib/api'
import { toast } from 'vue-sonner'
import type { RentalVendor } from '@/interfaces/vendor.interface'

export const useVendorStore = defineStore('vendor', {
  state: () => ({
    vendors: [] as RentalVendor[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchVendors() {
      this.loading = true
      this.error = null

      try {
        const res = await apiClient.get('/vendors')
        this.vendors = res.data ?? []
        return this.vendors
      } catch (err: any) {
        this.error = err.message
        toast.error('Gagal memuat vendor: ' + err.message)
      } finally {
        this.loading = false
      }
    },

    async getVendorById(id: number) {
      try {
        const res = await apiClient.get(`/vendors/${id}`)
        return res.data.data
      } catch (err: any) {
        toast.error('Vendor tidak ditemukan')
        return null
      }
    },
  },
})
