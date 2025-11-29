import type {  CreateRentalBookingRequest, DeleteRentalBookingRequest, RentalAddOn, RentalBooking, RentalBookingRequest, UpdateRentalBookingAddOnRequest, UpdateRentalBookingRequest, UpdateRentalBookingStatusRequest, ChartRentalBookingRequest } from '@/interfaces/rentalbooking.interface';
import { calculateDays, calculateBasePrice, calculateDriverFee, calculateAddOnTotal, previewVehiclePrice as calcPreview } from '@/service/booking-calculator'
import { v4 as uuidv4 } from 'uuid';

const rentalBookings: RentalBooking[] = [];

const rentalAddOns: RentalAddOn[] = [
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

  // hitung hari + harga menggunakan shared calculator
  const days = calculateDays(req.pickUpTime, req.dropOffTime)
  const basePrice = calculateBasePrice(req.vehicleDailyPrice, days)
  const driverFee = calculateDriverFee(req.includeDriver, days)
  const addOnTotal = calculateAddOnTotal(req.listOfAddOns ?? [], rentalAddOns)
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
  const booking = rentalBookings.find(b => b.id === id)
  if (!booking) return undefined

  booking.listOfAddOns = (booking.listOfAddOns ?? []).map(a => {
    const full = rentalAddOns.find(x => x.id === a.id)
    return full ? full : a
  })

  return booking
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

  const days = calculateDays(req.pickUpTime, req.dropOffTime)

  const addOns = req.listOfAddOns?.map(id => rentalAddOns.find(a => a.id === id)!) || []

  const basePrice = calculateBasePrice(req.vehicleDailyPrice, days)
  const driverFee = calculateDriverFee(req.includeDriver, days)
  const addOnTotal = calculateAddOnTotal(req.listOfAddOns ?? [], rentalAddOns)
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

    const addOns: RentalAddOn[] = req.listOfAddOns?.map((id) => rentalAddOns.find((a) => a.id === id)!) || []

    // recompute price: base + driver + addons
    const days = calculateDays(booking.pickUpTime, booking.dropOffTime)
    const basePrice = calculateBasePrice((booking as any).vehicleDailyPrice ?? 0, days)
    const driverFee = calculateDriverFee(booking.includeDriver, days)
    const addOnTotal = calculateAddOnTotal(req.listOfAddOns ?? [], rentalAddOns)

    booking.listOfAddOns = addOns
    booking.totalPrice = basePrice + driverFee + addOnTotal
    booking.updatedAt = new Date()
    return booking
  }

  previewVehiclePrice(vehicleDailyPrice: number, pick: string, drop: string, includeDriver = false) {
    return calcPreview(vehicleDailyPrice, pick, drop, includeDriver)
  }


chartRentalBookings(req: ChartRentalBookingRequest): { label: string; count: number }[] {
  const { period, year } = req
  const result: { label: string; count: number }[] = []

    if (period === "Quarterly") {
    const labels = ["Q1", "Q2", "Q3", "Q4"]
    const counts = [0, 0, 0, 0]

    rentalBookings.forEach((b) => {
        const created = b.createdAt
        if (!created) return
        if (created.getFullYear() === year) {
        const quarter = Math.floor(created.getMonth() / 3)
        if (quarter >= 0 && quarter < counts.length) {
            counts[quarter] = (counts[quarter] ?? 0) + 1
        }
        }
    })

    labels.forEach((label, i) => result.push({ label, count: counts[i] ?? 0 }))
    } else {
    const labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    const counts = new Array(12).fill(0)

    rentalBookings.forEach((b) => {
        const created = b.createdAt
        if (!created) return
        if (created.getFullYear() === year) {
        const month = created.getMonth()
        counts[month] = (counts[month] ?? 0) + 1
        }
    })

    labels.forEach((label, i) => result.push({ label, count: counts[i] }))
    }
  return result
}

  sortRentalBookings(order: "asc" | "desc" = "desc"): RentalBooking[] {
    return [...rentalBookings].sort((a, b) =>
      order === "asc"
        ? a.createdAt!.getTime() - b.createdAt!.getTime()
        : b.createdAt!.getTime() - a.createdAt!.getTime()
    )
  }
}

export const rentalBookingService = RentalBookingService.getInstance()