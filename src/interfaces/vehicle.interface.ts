export interface Vehicle {
  id: string
  rentalVendorId: number
  rentalVendorName: string // opsional, karena hanya muncul di response DTO
  type: string // Sedan, SUV, MPV, Luxury
  brand: string
  model: string
  productionYear: number
  location: string
  licensePlate: string
  capacity: number
  transmission: string // Manual / Automatic
  fuelType: string // Bensin, Diesel, Hybrid, Listrik
  price: number
  status: string // Available, In Use, Unavailable
  createdAt: Date; 
  updatedAt: Date;
}

export interface VehicleRequest {
  id: string
  rentalVendorId: number
  rentalVendorName: string // opsional, karena hanya muncul di response DTO
  type: string // Sedan, SUV, MPV, Luxury
  brand: string
  model: string
  productionYear: number
  location: string
  licensePlate: string
  capacity: number
  transmission: string // Manual / Automatic
  fuelType: string // Bensin, Diesel, Hybrid, Listrik
  price: number
  status: string // Available, In Use, Unavailable
}

export interface CreateVehicleRequest {
  rentalVendorId: number
  type: string
  brand: string
  model: string
  productionYear: number
  location: string
  licensePlate: string
  capacity: number
  transmission: string
  fuelType: string
  price: number
}

export interface UpdateVehicleRequest {
  id: string
  rentalVendorId: number
  rentalVendorName: string 
  type: string
  brand: string
  model: string
  productionYear: number
  location: string
  licensePlate: string
  capacity: number
  transmission: string
  fuelType: string
  price: number
  status: string
}




