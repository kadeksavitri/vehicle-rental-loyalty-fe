import type {  CreateRentalBookingRequest, DeleteRentalBookingRequest, RentalAddOn, RentalBooking, RentalBookingRequest, UpdateRentalBookingAddOnRequest, UpdateRentalBookingRequest, UpdateRentalBookingStatusRequest } from '@/interfaces/rentalbooking.interface';

const rentalBookings: RentalBooking[] = [];

const rentalAddOns: RentalAddOn[] = [
  { id: "ADD001", name: "GPS", price: 50000 },
  { id: "ADD002", name: "Child Seat", price: 80000 },
]

function generateRentalBookingId(): string {
  const prefix = 'VR'
  const lastRentalBooking = rentalBookings[rentalBookings.length - 1]
  if (!lastRentalBooking) return `${prefix}000001`

  const lastNumber = parseInt(lastRentalBooking.id.replace(prefix, '')) || 0
  const nextNumber = lastNumber + 1
  return `${prefix}${nextNumber.toString().padStart(4, '0')}`
}

export class RentalBookingService {
    private static instance: RentalBookingService;

    public static getInstance() {
        if (!RentalBookingService.instance) {
            RentalBookingService.instance = new RentalBookingService();
        }
        return RentalBookingService.instance;
    }

createRentalBooking(req: CreateRentalBookingRequest): RentalBooking {
  const addOns: RentalAddOn[] =
    req.listOfAddOns?.map((id) => rentalAddOns.find((a) => a.id === id)!) || []

  // hitung hari
  const pickUp = new Date(req.pickUpTime)
  const dropOff = new Date(req.dropOffTime)
  const days = Math.max(
    1,
    Math.ceil((dropOff.getTime() - pickUp.getTime()) / (1000 * 60 * 60 * 24))
  )

  // base price dihitung di service, bukan FE
  const basePrice = req.vehicleDailyPrice * days

  // driver fee
  const driverFee = req.includeDriver ? days * 100000 : 0

  // add-ons fee
  const addOnTotal = addOns.reduce((sum, a) => sum + (a?.price ?? 0), 0)

  // total akhir
  const total = basePrice + driverFee + addOnTotal

  const newBooking: RentalBooking = {
    ...req,
    id: generateRentalBookingId(),
    totalPrice: total,
    status: "Upcoming",
    listOfAddOns: addOns,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  rentalBookings.push(newBooking)
  return newBooking
}


    getAllRentalBookings(): RentalBooking[] {
        return rentalBookings.sort(
        (a, b) => b.createdAt!.getTime() - a.createdAt!.getTime()
        )
    }

    getRentalBooking(id: string): RentalBooking | undefined {
        return rentalBookings.find(booking => booking.id === id);
    }

    deleteRentalBooking(req: DeleteRentalBookingRequest): boolean {
        const index = rentalBookings.findIndex((b) => b.id === req.id)
        if (index === -1) return false

        const booking = rentalBookings[index]
        if (!booking || booking.status !== "Upcoming") return false

        rentalBookings.splice(index, 1)
        return true
    }


updateRentalBooking(req: UpdateRentalBookingRequest): RentalBooking | undefined {
  const booking = this.getRentalBooking(req.id)
  if (!booking) return undefined
  if (booking.status !== "Upcoming") return undefined

  const pickUp = new Date(req.pickUpTime)
  const dropOff = new Date(req.dropOffTime)
  const days = Math.max(
    1,
    Math.ceil((dropOff.getTime() - pickUp.getTime()) / (1000 * 60 * 60 * 24))
  )

  const addOns =
    req.listOfAddOns?.map(id => rentalAddOns.find(a => a.id === id)!) || []

  const basePrice = req.vehicleDailyPrice * days
  const driverFee = req.includeDriver ? days * 100000 : 0
  const addOnTotal = addOns.reduce((s, a) => s + (a?.price ?? 0), 0)
  const total = basePrice + driverFee + addOnTotal

  Object.assign(booking, req, {
    listOfAddOns: addOns,
    totalPrice: total,
    updatedAt: new Date(),
  })

  return booking
}


  updateRentalBookingStatus(req: UpdateRentalBookingStatusRequest): RentalBooking | undefined {
    const booking = this.getRentalBooking(req.id)
    if (!booking) return undefined

    const now = new Date()

    if (booking.status === "Done") return booking
    if (booking.status === "Upcoming" && req.newStatus === "Ongoing") {
      booking.status = "Ongoing"
    } else if (booking.status === "Ongoing" && req.newStatus === "Done") {
      const dropOff = new Date(booking.dropOffTime)
      let penalty = 0
      if (now.getTime() > dropOff.getTime()) {
        const hoursLate = Math.ceil(
          (now.getTime() - dropOff.getTime()) / (1000 * 60 * 60)
        )
        penalty = hoursLate * 20000
      }
      booking.status = "Done"
      booking.totalPrice += penalty
    }

    booking.updatedAt = new Date()
    return booking
  }

  updateRentalBookingAddOn(req: UpdateRentalBookingAddOnRequest): RentalBooking | undefined {
    const booking = this.getRentalBooking(req.id)
    if (!booking) return undefined
    if (booking.status !== "Upcoming") return undefined

    const addOns: RentalAddOn[] =
      req.listOfAddOns?.map((id) => rentalAddOns.find((a) => a.id === id)!) || []
    const addOnTotal = addOns.reduce((sum, a) => sum + (a?.price ?? 0), 0)
    booking.listOfAddOns = addOns
    booking.totalPrice += addOnTotal
    booking.updatedAt = new Date()
    return booking
  }

  previewVehiclePrice(vehicleDailyPrice: number, pick: string, drop: string) {
    const pickUp = new Date(pick);
    const dropOff = new Date(drop);
    const days = Math.max(
      1,
      Math.ceil((dropOff.getTime() - pickUp.getTime()) / (1000 * 60 * 60 * 24))
    );

    return {
      days,
      basePrice: vehicleDailyPrice * days,
      driverFee: 100000 * days,     // driver belum dipilih di step ini
      grandTotal: vehicleDailyPrice * days
    }
  }


// chartRentalBookings(req: ChartRentalBookingRequest): { label: string; count: number }[] {
//   const { period, year } = req
//   const result: { label: string; count: number }[] = []

//     if (period === "Quarterly") {
//     const labels = ["Q1", "Q2", "Q3", "Q4"]
//     const counts = [0, 0, 0, 0]

//     rentalBookings.forEach((b) => {
//         const created = b.createdAt
//         if (!created) return
//         if (created.getFullYear() === year) {
//         const quarter = Math.floor(created.getMonth() / 3)
//         if (quarter >= 0 && quarter < counts.length) {
//             counts[quarter] = (counts[quarter] ?? 0) + 1
//         }
//         }
//     })

//     labels.forEach((label, i) => result.push({ label, count: counts[i] }))
//     } else {
//     const labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
//     const counts = new Array(12).fill(0)

//     rentalBookings.forEach((b) => {
//         const created = b.createdAt
//         if (!created) return
//         if (created.getFullYear() === year) {
//         const month = created.getMonth()
//         counts[month] = (counts[month] ?? 0) + 1
//         }
//     })

//     labels.forEach((label, i) => result.push({ label, count: counts[i] }))
//     }
//   return result
// }

  sortRentalBookings(order: "asc" | "desc" = "desc"): RentalBooking[] {
    return [...rentalBookings].sort((a, b) =>
      order === "asc"
        ? a.createdAt!.getTime() - b.createdAt!.getTime()
        : b.createdAt!.getTime() - a.createdAt!.getTime()
    )
  }
}

export const rentalBookingService = RentalBookingService.getInstance()