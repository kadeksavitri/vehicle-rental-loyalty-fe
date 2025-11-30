import { defineStore } from 'pinia'
import { maintenanceService } from '@/service/maintenance.service'
import type {
  MaintenanceRecordResponseDTO,
  CreateMaintenanceRequestDTO,
  UpdateMaintenanceRequestDTO,
} from '@/interfaces/maintenance.interface'

export const useMaintenanceStore = defineStore('maintenance', {
  state: () => ({
    records: [] as MaintenanceRecordResponseDTO[],
    record: null as MaintenanceRecordResponseDTO | null,
    loading: false,
  }),

  actions: {
    async fetchAll() {
      this.loading = true
      try {
        const res = await maintenanceService.getAll()
        this.records = res.data.data ?? []
      } finally {
        this.loading = false
      }
    },
    async fetchById(id: string) {
      this.loading = true
      try {
        const res = await maintenanceService.getById(id)
        this.record = res.data.data ?? null
      } finally {
        this.loading = false
      }
    },
    async create(payload: CreateMaintenanceRequestDTO) {
      const res = await maintenanceService.create(payload)
      return res
    },
    async update(id: string, payload: UpdateMaintenanceRequestDTO) {
      const res = await maintenanceService.update(id, payload)
      return res
    },
    async updateStatus(id: string, status: string) {
      const res = await maintenanceService.updateStatus(id, status)
      return res
    },
    async remove(id: string) {
      const res = await maintenanceService.delete(id)
      return res
    },
  },
})
