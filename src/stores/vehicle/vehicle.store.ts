import type { CreateVehicleRequest, UpdateVehicleRequest, Vehicle } from '@/interfaces/vehicle.interface';
import type { CommonResponseInterface } from '@/interfaces/common.response.interface';
import { defineStore } from 'pinia';
import axios from 'axios';
import { toast } from 'vue-sonner';

const baseVehicleUrl = import.meta.env.VITE_API_URL + '/vehicles';

export const useVehicleStore = defineStore('vehicle', {
    state: () => ({
        vehicles: [] as Vehicle[],
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async fetchVehicles() {
            this.loading = true;
            this.error = null;

            try {
                const response = await axios.get<CommonResponseInterface<Vehicle[]>>(baseVehicleUrl);
                this.vehicles = response.data.data;
                if (this.vehicles.length === 0) {
                    toast.warning('Tidak ada kendaraan yang tersedia');
                }
                else {
                    toast.success('Kendaraan berhasil dimuat');
                }
                return response.data.data;
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat memuat kendaraan: ${this.error}`);
            } finally {
                this.loading = false;
            }
         },
    
    async getVehicle(id: string) {
        this.loading = true;
        this.error = null;

        try {
            const response = await axios.get<CommonResponseInterface<Vehicle>>(`${baseVehicleUrl}/${id}`);
            return response.data.data;
        } catch (error) {
            this.error = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Error saat memuat kendaraan: ${this.error}`);
            return null;
        } finally {
            this.loading = false;
        }
    },

    async createVehicle(vehicleData: CreateVehicleRequest) {
        this.loading = true;
        this.error = null;

        try {
            const response = await axios.post<CommonResponseInterface<Vehicle>>(`${baseVehicleUrl}/create`, vehicleData);
            if (response.status === 200 || response.status === 201) {
                this.vehicles.push(response.data.data);
                toast.success('Kendaraan berhasil dibuat');
                return response.data.data;
            } else if (response.status === 400) {
                toast.warning('Gagal membuat kendaraan: Data tidak valid');
            }
        } catch (error) {
            // try to surface server message if present
            const err: any = error
            const serverMsg = err?.response?.data?.message || err?.message || 'Unknown error'
            this.error = serverMsg
            if (err?.response?.status === 409 || /unique|constraint|license/i.test(serverMsg)) {
                toast.error('License plate key constraint tidak unik')
            } else {
                toast.error(`Error saat membuat kendaraan: ${serverMsg}`)
            }
            return null;
        } finally {
            this.loading = false;
        }
    },

async updateVehicle(vehicleData: UpdateVehicleRequest) {
  this.loading = true;
  this.error = null;

  try {
    const response = await axios.put<CommonResponseInterface<Vehicle>>(
      `${baseVehicleUrl}/update/${vehicleData.id}`,
      vehicleData
    );

    if (response.status === 200 || response.status === 201) {
      // replace existing data
      const idx = this.vehicles.findIndex(v => v.id === vehicleData.id);
      if (idx !== -1) {
        this.vehicles[idx] = response.data.data;
      }

      toast.success('Kendaraan berhasil diperbarui');
      return true;
    }

    toast.warning('Gagal memperbarui kendaraan');
    return false;

  } catch (error) {
        const err: any = error
        const serverMsg = err?.response?.data?.message || err?.message || 'Unknown error'
        this.error = serverMsg
        if (err?.response?.status === 409 || /unique|constraint|license/i.test(serverMsg)) {
            toast.error('License plate key constraint tidak unik')
        } else {
            // surface server-side validation / status errors (e.g., cannot change status)
            toast.error(`Error saat memperbarui kendaraan: ${serverMsg}`)
        }
    return false;
  } finally {
    this.loading = false;
  }
},



    async deleteVehicle(id: string) {
        this.loading = true;
        this.error = null;
        try {
            const response = await axios.delete<CommonResponseInterface<Vehicle>>(`${baseVehicleUrl}/delete/${id}`);
            if (response.status === 200 || response.status === 201) {
                this.vehicles = this.vehicles.filter(vehicle => vehicle.id !== id);
                toast.success('Kendaraan berhasil dihapus');
                return true;
            } else if (response.status === 400) {
                toast.warning('Gagal menghapus kendaraan: Data tidak valid');
            }
        } catch (error) {
            this.error = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Error saat menghapus kendaraan: ${this.error}`);
            return false;
        } finally {
            this.loading = false;
        }
    },
    }


});
