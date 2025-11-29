import type { RentalAddOn } from '@/interfaces/rentalbooking.interface'

export type AddOnEntry = string | RentalAddOn | null | undefined

export function normalizeAddOnIds(bookingAddOns: AddOnEntry[] = [], addonsList: RentalAddOn[] = []): string[] {
  return bookingAddOns
    .map((entry) => {
      if (!entry) return ''
      const value = typeof entry === 'string' ? entry : (entry as RentalAddOn).id ?? (entry as RentalAddOn).name

      const foundById = addonsList.find((a) => a.id === value)
      if (foundById) return foundById.id
      const foundByName = addonsList.find((a) => a.name === value)
      if (foundByName) return foundByName.id
      return value
    })
    .filter((v) => !!v) as string[]
}
