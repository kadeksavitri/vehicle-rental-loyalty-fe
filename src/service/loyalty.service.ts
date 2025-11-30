import apiClient from '@/lib/api'
import type {
  LoyaltyAccount,
  Coupon,
  CreateCouponRequest,
  UpdateCouponRequest,
  PurchaseCouponRequest,
  PurchasedCoupon,
} from '@/interfaces/loyalty.interface'

export const loyaltyService = {
  getPoints(customerId: string) {
    return apiClient.get(`/loyalty/points/${customerId}`)
  },

  addPoints(customerId: string, points: number) {
    return apiClient.post(`/loyalty/points/add/${customerId}?points=${points}`)
  },

  getAllCoupons() {
    return apiClient.get('/loyalty/coupons')
  },

  createCoupon(payload: CreateCouponRequest) {
    return apiClient.post('/loyalty/coupons', payload)
  },

  updateCoupon(couponId: string, payload: UpdateCouponRequest) {
    return apiClient.put(`/loyalty/coupons/${couponId}`, payload)
  },

  purchaseCoupon(customerId: string, payload: PurchaseCouponRequest) {
    return apiClient.post(`/loyalty/purchase/${customerId}`, payload)
  },

  getPurchasedCoupons(customerId: string) {
    return apiClient.get(`/loyalty/purchased/${customerId}`)
  },

  useCoupon(code: string, customerId: string) {
    return apiClient.post('/loyalty/use', { code, customerId })
  },
}