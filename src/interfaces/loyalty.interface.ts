export interface LoyaltyAccount {
  customerId: string
  points: number
}

export interface Coupon {
  id: string
  name: string
  description: string
  points: number
  percentOff: number
  createdDate: string
  updatedDate: string
}

export interface CreateCouponRequest {
  name: string
  description: string
  points: number
  percentOff: number
}

export interface UpdateCouponRequest {
  name: string
  description: string
  points: number
  percentOff: number
}

export interface PurchasedCoupon {
  id: string
  code: string
  customerId: string
  couponId: string
  purchasedDate: string
  usedDate: string | null
}

export interface PurchaseCouponRequest {
  couponId: string
}
