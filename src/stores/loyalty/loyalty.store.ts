import { defineStore } from 'pinia'
import { toast } from 'vue-sonner'
import { loyaltyService } from '@/service/loyalty.service'
import type { CreateCouponRequest, UpdateCouponRequest } from '@/interfaces/loyalty.interface'

export const useLoyaltyStore = defineStore('loyalty', {
  state: () => ({
    coupons: [],
    purchasedCoupons: [],
    points: 0,
    loading: false
  }),

  actions: {
    async fetchPoints(customerId: string) {
      const res = await loyaltyService.getPoints(customerId)
      this.points = res.data.data.points
    },

    async fetchAllCoupons() {
      const res = await loyaltyService.getAllCoupons()
      this.coupons = res.data.data
    },

    async createCoupon(payload: CreateCouponRequest) {
    await loyaltyService.createCoupon(payload)
    toast.success('Coupon created')
    },

    async updateCoupon(id: string, payload: UpdateCouponRequest) {
    await loyaltyService.updateCoupon(id, payload)
    toast.success('Coupon updated')
    },

    async purchaseCoupon(customerId: string, couponId: string) {
    await loyaltyService.purchaseCoupon(customerId, { couponId })
    toast.success('Coupon purchased')
    },

    async fetchPurchasedCoupons(customerId: string) {
    const res = await loyaltyService.getPurchasedCoupons(customerId)
    this.purchasedCoupons = res.data.data
    },

  }
})
