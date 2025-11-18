// // interfaces/rentalbooking.interface.ts

// export interface AddOnOption {
//   id: string
//   name: string
//   price: number
// }

// export interface RentalBooking {
//   id: string
//   vehicleId: string
//   vehicleBrand: string
//   vehicleType: string
//   pickUpTime: string
//   dropOffTime: string
//   pickUpLocation: string
//   dropOffLocation: string
//   capacityNeeded: number
//   transmissionNeeded: string
//   includeDriver: boolean
//   status: 'Upcoming' | 'Ongoing' | 'Done'
//   totalPrice: number
//   listOfAddOns: string[]
//   createdAt: string
//   updatedAt: string
// }

// export interface CreateRentalBookingRequest {
//   vehicleId: string
//   pickUpTime: string
//   dropOffTime: string
//   pickUpLocation: string
//   dropOffLocation: string
//   capacityNeeded: number
//   transmissionNeeded: string
//   includeDriver: boolean
//   totalPrice: number
//   listOfAddOns: string[]
// }

// export interface UpdateRentalBookingDetailsRequest {
//   id: string
//   vehicleId: string
//   pickUpTime: string
//   dropOffTime: string
//   pickUpLocation: string
//   dropOffLocation: string
//   capacityNeeded: number
//   transmissionNeeded: string
//   includeDriver: boolean
//   totalPrice: number
//   listOfAddOns: string[]
//   status: string
// }

// export interface UpdateBookingStatusRequest {
//   id: string
//   newStatus: string
// }

// export interface UpdateBookingAddOnRequest {
//   id: string
//   listOfAddOns: string[]
// }

// export interface DeleteBookingRequest {
//   id: string
// }

// export interface ChartBookingRequest {
//   period: 'Monthly' | 'Quarterly'
//   year: number
// }

// export interface ChartBookingResponse {
//   label: string
//   count: number
// }





// src/interfaces/rentalbooking.interface.ts

export interface RentalBooking {
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

