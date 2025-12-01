export interface MaintenanceRecordResponseDTO {
  id: string
  vehicleId: string
  vehicleDisplay: string
  serviceDate: string
  description?: string
  cost?: number
  vendorNote?: string
  status: string
  createdAt: string
}

export interface CreateMaintenanceRequestDTO {
  vehicleId: string
  serviceDate: string
  description?: string
  cost?: number
  vendorNote?: string
}

export interface UpdateMaintenanceRequestDTO {
  id: string
  vehicleId: string
  serviceDate: string
  description?: string
  cost?: number
  vendorNote?: string
  status: string
}