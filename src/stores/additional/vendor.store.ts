import { defineStore } from 'pinia'
import axios from 'axios'
import { toast } from 'vue-sonner'
import type { RentalVendor } from '@/interfaces/vendor.interface'

const baseUrl = import.meta.env.VITE_API_URL + '/vendors'

export const useVendorStore = defineStore('vendor', {
  state: () => ({
    vendors: [] as RentalVendor[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchVendors() {
      this.loading = true
      this.error = null

      try {
        const res = await axios.get(baseUrl)
        this.vendors = res.data ?? []
        return this.vendors
      } catch (err: any) {
        this.error = err.message
        toast.error("Gagal memuat vendor: " + err.message)
      } finally {
        this.loading = false
      }
    },

    async getVendorById(id: number) {
      try {
        const res = await axios.get(`${baseUrl}/${id}`)
        return res.data.data
      } catch (err: any) {
        toast.error("Vendor tidak ditemukan")
        return null
      }
    }
  }
})
