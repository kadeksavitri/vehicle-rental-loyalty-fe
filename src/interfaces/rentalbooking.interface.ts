// src/interfaces/rentalbooking.interface.ts

import type { Vehicle } from './vehicle.interface'


export interface RentalBooking {
  id: string
  vehicleId: string
  vehicle?: Vehicle 
  pickUpTime: string
  dropOffTime: string
  pickUpLocation: string
  dropOffLocation: string
  capacityNeeded?: number
  transmissionNeeded: string
  totalPrice: number
  includeDriver: boolean
  status: string 
  listOfAddOns?: RentalAddOn[]
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date | null
}

export interface RentalBookingRequest {
  id: string
  vehicleId: string
  vehicle?: Vehicle 
  pickUpTime: string
  dropOffTime: string
  pickUpLocation: string
  dropOffLocation: string
  capacityNeeded?: number
  transmissionNeeded: string
  totalPrice: number
  includeDriver: boolean
  status: string 
  listOfAddOns?: RentalAddOn[]
}

export interface RentalAddOn {
  id: string
  name: string
  price: number
  description?: string
}

export interface CreateRentalBookingRequest {
  vehicleId: string
  pickUpTime: string
  dropOffTime: string
  pickUpLocation: string
  dropOffLocation: string
  capacityNeeded: number
  transmissionNeeded: string
  totalPrice: number
  listOfAddOns?: string[] 
  includeDriver: boolean
}

export interface UpdateRentalBookingRequest {
  id: string
  vehicleId: string
  pickUpTime: string
  dropOffTime: string
  pickUpLocation: string
  dropOffLocation: string
  capacityNeeded: number
  transmissionNeeded: string
  totalPrice: number
  listOfAddOns?: string[]
  includeDriver: boolean
  status: string
}

export interface UpdateRentalBookingStatusRequest {
  id: string
  newStatus: string 
}

export interface UpdateRentalBookingAddOnRequest {
  id: string
  listOfAddOns: string[]
}

export interface DeleteRentalBookingRequest {
  id: string
}

export interface ChartRentalBookingRequest {
  period: 'Monthly' | 'Quarterly'
  year: number
}

