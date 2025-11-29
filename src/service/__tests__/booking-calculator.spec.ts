import { describe, it, expect } from 'vitest'
import { calculateDays, calculateBasePrice, calculateDriverFee, calculateAddOnTotal, previewVehiclePrice } from '../booking-calculator'

describe('booking-calculator', () => {
  it('calculateDays handles same moment as 1 day', () => {
    const now = new Date()
    expect(calculateDays(now, now)).toBe(1)
  })

  it('calculateDays rounds up partial days', () => {
    const pick = new Date('2025-11-01T08:00:00')
    const drop = new Date('2025-11-02T14:00:00') // 30 hours -> 2 days
    expect(calculateDays(pick, drop)).toBe(2)
  })

  it('calculateBasePrice multiplies correctly', () => {
    expect(calculateBasePrice(100000, 3)).toBe(300000)
  })

  it('calculateDriverFee returns 0 when not included', () => {
    expect(calculateDriverFee(false, 2)).toBe(0)
  })

  it('calculateDriverFee multiplies days', () => {
    expect(calculateDriverFee(true, 2)).toBe(200000)
  })

  it('calculateAddOnTotal sums prices from a catalog', () => {
    const catalog = [{ id: 'A1', price: 50000 }, { id: 'A2', price: 75000 }]
    expect(calculateAddOnTotal(['A1', 'A2'], catalog)).toBe(125000)
    expect(calculateAddOnTotal([], catalog)).toBe(0)
  })

  it('previewVehiclePrice returns correct composite values', () => {
    const pick = '2025-11-01T08:00:00'
    const drop = '2025-11-03T09:00:00' // 49 hours -> 3 days
    const res = previewVehiclePrice(100000, pick, drop, true)
    expect(res.days).toBe(3)
    expect(res.basePrice).toBe(300000)
    expect(res.driverFee).toBe(300000)
    expect(res.grandTotal).toBe(600000)
  })
})
