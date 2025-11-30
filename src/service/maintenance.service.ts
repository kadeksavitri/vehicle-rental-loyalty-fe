import apiClient from '@/lib/api'
import type {
  CreateMaintenanceRequestDTO,
  UpdateMaintenanceRequestDTO,
} from '@/interfaces/maintenance.interface'

const BASE = '/maintenance'

export const maintenanceService = {
  getAll() {
    return apiClient.get(`${BASE}`)
  },
  getById(id: string) {
    return apiClient.get(`${BASE}/${id}`)
  },
  create(payload: CreateMaintenanceRequestDTO) {
    return apiClient.post(`${BASE}/create`, payload)
  },
  update(id: string, payload: UpdateMaintenanceRequestDTO) {
    return apiClient.put(`${BASE}/update/${id}`, payload)
  },
  updateStatus(id: string, status: string) {
    return apiClient.put(`${BASE}/update-status/${id}`, { status })
  },
  delete(id: string) {
    return apiClient.delete(`${BASE}/delete/${id}`)
  },
}

export default maintenanceService
