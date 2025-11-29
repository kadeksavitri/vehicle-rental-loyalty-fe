import { defineStore } from 'pinia'
import axios from 'axios'
import { toast } from 'vue-sonner'
import type { Location } from '@/interfaces/location.interface'

const baseLocationUrl = import.meta.env.VITE_API_URL + '/locations'

export const useLocationStore = defineStore('location', {
  state: () => ({
    locations: [] as Location[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchLocations() {
      this.loading = true
      this.error = null

      try {
        const res = await axios.get(baseLocationUrl)
        this.locations = res.data ?? []
        return this.locations
      } catch (err: any) {
        this.error = err.message
        toast.error("Gagal memuat lokasi: " + err.message)
      } finally {
        this.loading = false
      }
    }
  }
})
