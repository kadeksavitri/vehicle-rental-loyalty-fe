// src/interfaces/rentalbooking.interface.ts

export interface RentalBooking {
  id: string
  customerId: string
  vehicleId: string
  pickUpTime: string
  dropOffTime: string
  pickUpLocation: string
  dropOffLocation: string
  capacityNeeded: number
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
  pickUpTime: string
  dropOffTime: string
  pickUpLocation: string
  dropOffLocation: string
  capacityNeeded: number
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
}

export interface CreateRentalBookingRequest {
  customerId: string
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
  vehicleDailyPrice: number

}

export interface UpdateRentalBookingRequest {
  id: string
  customerId: string
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
  vehicleDailyPrice: number

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

