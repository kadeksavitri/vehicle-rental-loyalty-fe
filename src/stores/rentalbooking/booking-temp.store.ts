import { defineStore } from "pinia"
import type { CreateRentalBookingRequest } from "@/interfaces/rentalbooking.interface"

export const useTempBookingStore = defineStore("tempBooking", {
  state: () => ({
    bookingData: null as CreateRentalBookingRequest | null,
    selectedVehicle: null as any | null
  }),
  actions: {
    setBooking(data: CreateRentalBookingRequest) {
      this.bookingData = data
    },
    setSelectedVehicle(vehicle: any) {
      this.selectedVehicle = vehicle
    },
    clear() {
      this.bookingData = null
      this.selectedVehicle = null
    }
  }
})
