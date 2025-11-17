import type { Vehicle, VehicleRequest } from '@/interfaces/vehicle.interface';

const vehicles: Vehicle[] = [
];

console.log("VITE_API_URL =", import.meta.env.VITE_API_URL)


function generateVehicleId(): string {
  const prefix = 'VEH'
  const lastVehicle = vehicles[vehicles.length - 1]
  if (!lastVehicle) return `${prefix}0001`

  const lastNumber = parseInt(lastVehicle.id.replace(prefix, '')) || 0
  const nextNumber = lastNumber + 1
  return `${prefix}${nextNumber.toString().padStart(4, '0')}`
}

export class VehicleService {
    private static instance: VehicleService;

    public static getInstance() {
        if (!VehicleService.instance) {
            VehicleService.instance = new VehicleService();
        }
        return VehicleService.instance;
    }

  createVehicle(vehicle: VehicleRequest): Vehicle {
    const newVehicle: Vehicle = {
        id: generateVehicleId(),
        rentalVendorId: vehicle.rentalVendorId,
        rentalVendorName: vehicle.rentalVendorName ?? 'Unknown Vendor',
        type: vehicle.type,
        brand: vehicle.brand ?? 'Unknown Brand',
        model: vehicle.model ?? 'Unknown Model',
        productionYear: vehicle.productionYear ?? new Date().getFullYear(),
        location: vehicle.location,
        licensePlate: vehicle.licensePlate,
        capacity: vehicle.capacity,
        transmission: vehicle.transmission,
        fuelType: vehicle.fuelType,
        price: vehicle.price,
        status: vehicle.status ?? 'Available',
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    vehicles.push(newVehicle)
    return newVehicle
    }


    getAllVehicles(): Vehicle[] {
        return vehicles;
    }

    getVehicle(id: string): Vehicle | undefined {
        return vehicles.find(vehicle => vehicle.id === id);
    }

    deleteVehicle(id: string): boolean {
        const v = this.getVehicle(id)
        if (!v) return false
        if (v.status === "In Use") throw new Error("Cannot delete In Use rented vehicle")
        v.status = "Unavailable"
        v.updatedAt = new Date()
        return true
    }


    updateVehicle(id: string, updatedVehicle: Partial<VehicleRequest>): Vehicle | undefined {
        const vehicle = this.getVehicle(id);
        if (vehicle) {
            Object.assign(vehicle, updatedVehicle);
            vehicle.updatedAt = new Date()
            return vehicle;
        }
        return undefined;
    }

  filterVehicles(keyword?: string, type?: string): Vehicle[] {
    return vehicles
      .filter((vehicle) => {
        const matchKeyword =
          !keyword ||
          vehicle.brand.toLowerCase().includes(keyword.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(keyword.toLowerCase()) ||
          vehicle.location.toLowerCase().includes(keyword.toLowerCase()) ||
          vehicle.licensePlate.toLowerCase().includes(keyword.toLowerCase())

        const matchType = !type || vehicle.type.toLowerCase() === type.toLowerCase()

        return matchKeyword && matchType
      })
      .sort(
        (a, b) =>
          b.createdAt.getTime() - a.createdAt.getTime() 
      )
  }

  sortVehicles(order: 'asc' | 'desc' = 'desc'): Vehicle[] {
    return [...vehicles].sort((a, b) =>
      order === 'asc'
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : b.createdAt.getTime() - a.createdAt.getTime()
    )
  }
}

export const vehicleService = VehicleService.getInstance();