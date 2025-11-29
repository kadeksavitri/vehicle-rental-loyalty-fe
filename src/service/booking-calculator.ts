export const MS_PER_DAY = 1000 * 60 * 60 * 24

export function calculateDays(pick: string | Date, drop: string | Date): number {
  const pickDate = typeof pick === 'string' ? new Date(pick) : pick
  const dropDate = typeof drop === 'string' ? new Date(drop) : drop
  if (isNaN(pickDate.getTime()) || isNaN(dropDate.getTime())) return 1
  const diff = dropDate.getTime() - pickDate.getTime()
  const days = Math.max(1, Math.ceil(diff / MS_PER_DAY))
  return days
}

export function calculateBasePrice(dailyPrice: number, days: number): number {
  return Number((dailyPrice * Math.max(1, days)).toFixed(2))
}

export function calculateDriverFee(includeDriver: boolean, days: number, perDay = 100000): number {
  return includeDriver ? days * perDay : 0
}

export function calculateAddOnTotal(addOnIds: string[] = [], addOnCatalog: { id: string; price: number }[] = []): number {
  if (!addOnIds || addOnIds.length === 0) return 0
  const map = new Map(addOnCatalog.map(a => [a.id, a.price]))
  return addOnIds.reduce((sum, id) => sum + (map.get(id) ?? 0), 0)
}

export function previewVehiclePrice(dailyPrice: number, pick: string | Date, drop: string | Date, includeDriver = false, perDayDriver = 100000) {
  const days = calculateDays(pick, drop)
  const basePrice = calculateBasePrice(dailyPrice, days)
  const driverFee = calculateDriverFee(includeDriver, days, perDayDriver)
  const grandTotal = basePrice + driverFee

  return { days, basePrice, driverFee, grandTotal }
}

export default {
  calculateDays,
  calculateBasePrice,
  calculateDriverFee,
  calculateAddOnTotal,
  previewVehiclePrice,
}
