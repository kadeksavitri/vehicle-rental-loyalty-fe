import axios from 'axios'
import type {
  LoyaltyAccount,
  Coupon,
  CreateCouponRequest,
  UpdateCouponRequest,
  PurchaseCouponRequest,
  PurchasedCoupon
} from '@/interfaces/loyalty.interface'

const BASE = import.meta.env.VITE_API_URL + '/loyalty'

export const loyaltyService = {
  getPoints(customerId: string) {
    return axios.get(`${BASE}/points/${customerId}`)
  },

  addPoints(customerId: string, points: number) {
    return axios.post(`${BASE}/points/add/${customerId}?points=${points}`)
  },

  getAllCoupons() {
    return axios.get(`${BASE}/coupons`)
  },

  createCoupon(payload: CreateCouponRequest) {
    return axios.post(`${BASE}/coupons`, payload)
  },

  updateCoupon(couponId: string, payload: UpdateCouponRequest) {
    return axios.put(`${BASE}/coupons/${couponId}`, payload)
  },

  purchaseCoupon(customerId: string, payload: PurchaseCouponRequest) {
    return axios.post(`${BASE}/purchase/${customerId}`, payload)
  },

  getPurchasedCoupons(customerId: string) {
    return axios.get(`${BASE}/purchased/${customerId}`)
  },

  useCoupon(code: string, customerId: string) {
    return axios.post(`${BASE}/use`, { code, customerId })
  }
}
