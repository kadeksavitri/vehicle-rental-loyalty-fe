import { defineStore } from 'pinia'
import type { CreateRentalBookingRequest } from '@/interfaces/rentalbooking.interface'

export const useTempBookingStore = defineStore('tempBooking', {
  state: () => ({
    bookingData: null as CreateRentalBookingRequest | null
  }),

  actions: {
    setBooking(data: CreateRentalBookingRequest) {
      this.bookingData = data
    },

    clear() {
      this.bookingData = null
    }
  }
})
