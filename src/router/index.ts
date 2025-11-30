import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import VehicleView from '@/views/vehicle/VehicleView.vue'
import DetailVehicleView from '@/views/vehicle/DetailVehicleView.vue'
import EditVehicleView from '@/views/vehicle/EditVehicleView.vue'
import CreateVehicleView from '@/views/vehicle/CreateVehicleView.vue'
import RentalBookingView from '@/views/rentalbooking/RentalBookingView.vue'
import CreateRentalBookingView from '@/views/rentalbooking/CreateRentalBookingView.vue'
import DetailRentalBookingView from '@/views/rentalbooking/DetailRentalBookingView.vue'
import CreateAddOnRentalBookingView from '@/views/rentalbooking/CreateAddOnRentalBookingView.vue'
import EditRentalBookingView from '@/views/rentalbooking/EditRentalBookingView.vue'
import EditAddOnBookingView from '@/views/rentalbooking/EditAddOnBookingView.vue'
import EditStatusBookingView from '@/views/rentalbooking/EditStatusBookingView.vue'
import ChartBookingView from '@/views/rentalbooking/ChartBookingView.vue'
import LoyaltyDashboardView from '@/views/loyalty/LoyaltyDashboardView.vue'
import AvailableCouponsView from '@/views/loyalty/AvailableCouponsView.vue'
import PurchasedCouponsView from '@/views/loyalty/PurchasedCouponsView.vue'
import CouponListView from '@/views/loyalty/CouponListView.vue'
import CreateCouponView from '@/views/loyalty/CreateCouponView.vue'
import EditCouponView from '@/views/loyalty/EditCouponView.vue'

import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue' // masih place holder
import UnauthorizedView from '@/views/UnauthorizedView.vue'

import {
  canAccessProfile,
  isAuthenticated,
  canViewVehicles,
  canCreateVehicle,
  canUpdateVehicle,
  canViewBookings,
  canCreateBooking,
  canUpdateBooking,
  canUpdateBookingStatus,
  canAccessLoyalty,
} from '@/lib/rbac'
import { toast } from 'vue-sonner'

console.log('VITE_API_URL =', import.meta.env.VITE_API_URL)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: UnauthorizedView,
    },
    {
      path: '/vehicles',
      name: 'vehicle',
      component: VehicleView,
      meta: { requiresAuth: true, permission: 'canViewVehicles' },
    },
    {
      path: '/vehicles/add',
      name: 'create-vehicle',
      component: CreateVehicleView,
      meta: { requiresAuth: true, permission: 'canCreateVehicle' },
    },
    {
      path: '/vehicles/:id',
      name: 'detail-vehicle',
      component: DetailVehicleView,
      meta: { requiresAuth: true, permission: 'canViewVehicles' },
    },
    {
      path: '/vehicles/:id/edit',
      name: 'edit-vehicle',
      component: EditVehicleView,
      meta: { requiresAuth: true, permission: 'canUpdateVehicle' },
    },
    {
      path: '/bookings',
      name: 'booking',
      component: RentalBookingView,
      meta: { requiresAuth: true },
    },
    {
      path: '/bookings/add',
      name: 'create-booking',
      component: CreateRentalBookingView,
      meta: { requiresAuth: true, permission: 'canCreateBooking' },
    },
    {
      path: '/bookings/create/addons',
      name: 'CreateBookingAddOns',
      component: CreateAddOnRentalBookingView,
      meta: { requiresAuth: true, permission: 'canCreateBooking' },
    },
    {
      path: '/bookings/:id/edit',
      name: 'edit-booking',
      component: EditRentalBookingView,
      meta: { requiresAuth: true, permission: 'canUpdateBooking' },
    },
    {
      path: '/bookings/:id/update-addons',
      name: 'edit-booking-addons',
      component: EditAddOnBookingView,
      meta: { requiresAuth: true, permission: 'canUpdateBooking' },
    },
    {
      path: '/bookings/:id/update-status',
      name: 'update-status',
      component: EditStatusBookingView,
      meta: { requiresAuth: true, permission: 'canUpdateBookingStatus' },
    },
    {
      path: '/bookings/:id',
      name: 'detail-booking',
      component: DetailRentalBookingView,
      meta: { requiresAuth: true },
    },
    {
      path: '/bookings/statistics',
      name: 'statistics',
      component: ChartBookingView,
      meta: { requiresAuth: true },
    },
    {
      path: '/loyalty',
      name: 'loyalty',
      component: LoyaltyDashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/loyalty/available',
      name: 'loyalty-available',
      component: AvailableCouponsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/loyalty/purchased',
      name: 'loyalty-purchased',
      component: PurchasedCouponsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/loyalty/admin',
      name: 'loyalty-admin',
      component: CouponListView,
      meta: { requiresAuth: true },
    },
    {
      path: '/loyalty/admin/create',
      name: 'loyalty-admin-create',
      component: CreateCouponView,
      meta: { requiresAuth: true },
    },
    {
      path: '/loyalty/admin/edit/:id',
      name: 'loyalty-admin-edit',
      component: EditCouponView,
      meta: { requiresAuth: true },
    },
  ],
})

// Route guard for authentication and authorization
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const permission = to.meta.permission as string | undefined

  // Check authentication
  if (requiresAuth && !isAuthenticated()) {
    toast.error('Please login to access this page')
    return next('/login')
  }

  // Check specific permission
  if (permission) {
    const permissionFunctions: Record<string, () => boolean> = {
      canViewVehicles,
      canCreateVehicle,
      canUpdateVehicle,
      canCreateBooking,
      canUpdateBooking,
      canUpdateBookingStatus,
    }

    const hasPermission = permissionFunctions[permission]?.()

    if (!hasPermission) {
      toast.error('You do not have permission to access this page')
      return next('/unauthorized')
    }
  }

  next()
})

export default router
