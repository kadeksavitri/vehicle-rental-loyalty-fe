// // stores/rentalbooking/booking.store.ts

import type { CreateRentalBookingRequest, DeleteRentalBookingRequest, RentalBooking, UpdateRentalBookingAddOnRequest, UpdateRentalBookingStatusRequest } from '@/interfaces/rentalbooking.interface';
import type { CommonResponseInterface } from '@/interfaces/common.response.interface';
import { defineStore } from 'pinia';
import axios from 'axios';
import { toast } from 'vue-sonner';

const baseRentalBookingUrl = import.meta.env.VITE_API_URL + '/bookings';

export const useRentalBookingStore = defineStore('rentalbooking', {
    state: () => ({
        rentalBookings: [] as RentalBooking[],
        loading: false, 
        error: null as string | null,
    }),

    actions: {
        async fetchRentalBookings(rentalVendorId?: string, status?: string, vehicleId?: string) {
            this.loading = true;
            this.error = null;

            try {
                const response = await axios.get<CommonResponseInterface<RentalBooking[]>>(baseRentalBookingUrl);
                this.rentalBookings = response.data.data ?? [];
                return this.rentalBookings;

            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat memuat rental booking: ${this.error}`);
            } finally {
                this.loading = false;
            }
        },

        async getRentalBooking(id: string) {
            this.loading = true;
            this.error = null;

            try {
                const response = await axios.get<CommonResponseInterface<RentalBooking>>(`${baseRentalBookingUrl}/${id}`);
                return response.data.data;
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat memuat rental booking: ${this.error}`);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async createRentalBooking(rentalBookingData: CreateRentalBookingRequest) {
            this.loading = true;
            this.error = null;

            try {
                const response = await axios.post<CommonResponseInterface<RentalBooking>>(`${baseRentalBookingUrl}/create`, rentalBookingData);
                if (response.status === 200 || response.status === 201) {
                    this.rentalBookings.push(response.data.data);
                    toast.success('Rental booking berhasil dibuat');
                    return response.data.data;
                } else if (response.status === 400) {
                    toast.warning('Gagal membuat rental booking: Data tidak valid');
                }
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat membuat rental booking: ${this.error}`);
                return null;
            } finally {
                this.loading = false;
            }
        },

        async updateRentalBooking(rentalBookingData: RentalBooking) {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.put<CommonResponseInterface<RentalBooking>>(`${baseRentalBookingUrl}/update-details`,rentalBookingData)
                if (response.status === 200 || response.status === 201) {
                    this.rentalBookings.push(response.data.data);
                    toast.success('Rental booking berhasil diperbarui');
                    return response.data.data;
                } else if (response.status === 400) {
                    toast.warning('Gagal memperbarui rental booking: Data tidak valid');
                }
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat memperbarui rental booking: ${this.error}`);
                return null;
            } finally {
                this.loading = false;
            }
        }, 

        async updateRentalBookingStatus(bookingStatusData: UpdateRentalBookingStatusRequest) {
            this.loading = true;
            this.error = null;

            try {
                const response = await axios.put<CommonResponseInterface<RentalBooking>>(`${baseRentalBookingUrl}/update-status`, bookingStatusData);
                if (response.status === 200 || response.status === 201) {
                    const idx = this.rentalBookings.findIndex(b => b.id === response.data.data.id)
                    if (idx !== -1) {
                    this.rentalBookings[idx] = response.data.data
                    }
                    toast.success('Status booking berhasil diperbarui');
                    return response.data.data;
                } else if (response.status === 400) {
                    toast.warning('Gagal memperbarui status: Data tidak valid');
                }
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat memperbarui status  booking: ${this.error}`);
                return null;
            } finally {
                this.loading = false;
            }
        }, 

        async updateRentalBookingAddOns(bookingAddOnsData: UpdateRentalBookingAddOnRequest) {
            this.loading = true;
            this.error = null;
        
            try {
                const response = await axios.put<CommonResponseInterface<RentalBooking>>(`${baseRentalBookingUrl}/update-addons`, bookingAddOnsData);
                if (response.status === 200 || response.status === 201) {
                    this.rentalBookings.push(response.data.data);
                    toast.success('Add Ons booking berhasil diperbarui');
                    return response.data.data;
                } else if (response.status === 400) {
                    toast.warning('Gagal memperbarui Add Ons: Data tidak valid');
                }
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat memperbarui Add Ons: ${this.error}`);
                return null;
            } finally {
                this.loading = false;
            }
        }, 

        async deleteRentalBooking(deleteData: DeleteRentalBookingRequest): Promise<boolean> {
            this.loading = true;
            this.error = null;

            try {
                const response = await axios.delete<CommonResponseInterface<RentalBooking>>(`${baseRentalBookingUrl}/${deleteData.id}/delete`, { data: deleteData });
                if (response.status === 200 || response.status === 201) {
                    this.rentalBookings = this.rentalBookings.filter((b) => b.id !== deleteData.id);
                    toast.success('Rental booking berhasil dihapus');
                    return true;
                } else if (response.status === 400) {
                    toast.warning('Gagal menghapus rental booking: Data tidak valid');
                }
            } catch (error) {
                this.error = error instanceof Error ? error.message : 'Unknown error';
                toast.error(`Error saat menghapus rental booking: ${this.error}`);
                return false;
            } finally {
                this.loading = false;
            }
            return false
        },

        async chartRentalBookings(data: { period: string; year: number }) {
        this.loading = true;
        try {
            const res = await axios.get<CommonResponseInterface<{ label: string; count: number }[]>>(
            `${baseRentalBookingUrl}/chart`,
            { params: data }
            );
            return res.data.data;
        } catch (err) {
            // Prefer server-provided message to bubble up to the caller
            const serverMessage = (err as any)?.response?.data?.message
            if (serverMessage) {
                // rethrow with server message so view can display it
                throw new Error(serverMessage)
            }
            toast.error('Gagal memuat data chart');
            throw err
        } finally {
            this.loading = false;
        }
        },
    }

})