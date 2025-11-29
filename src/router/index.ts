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

import { canAccessProfile, isAuthenticated } from '@/lib/rbac'
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
      path: '/vehicles',
      name: 'vehicle',
      component: VehicleView,
    },
    {
      path: '/vehicles/add',
      name: 'create-vehicle',
      component: CreateVehicleView,
    },
    {
      path: '/vehicles/:id',
      name: 'detail-vehicle',
      component: DetailVehicleView,
    },
    {
      path: '/vehicles/:id/edit',
      name: 'edit-vehicle',
      component: EditVehicleView,
    },
    {
      path: '/bookings',
      name: 'booking',
      component: RentalBookingView,
    },
    {
      path: '/bookings/add',
      name: 'create-booking',
      component: CreateRentalBookingView,
    },
    {
      path: '/bookings/create/addons',
      name: 'CreateBookingAddOns',
      component: CreateAddOnRentalBookingView,
    },
    {
      path: '/bookings/:id/edit',
      name: 'edit-booking',
      component: EditRentalBookingView,
    },
    {
      path: '/bookings/:id/update-addons',
      name: 'edit-booking-addons',
      component: EditAddOnBookingView,
    },
    {
      path: '/bookings/:id/update-status',
      name: 'update-status',
      component: EditStatusBookingView,
    },
    {
      path: '/bookings/:id',
      name: 'detail-booking',
      component: DetailRentalBookingView,
    },
    {
      path: '/bookings/statistics',
      name: 'statistics',
      component: ChartBookingView,
    },
    {
      path: '/loyalty',
      name: 'loyalty',
      component: LoyaltyDashboardView,
    },
    {
      path: '/loyalty/available',
      name: 'loyalty-available',
      component: AvailableCouponsView,
    },
    {
      path: '/loyalty/purchased',
      name: 'loyalty-purchased',
      component: PurchasedCouponsView,
    },
    {
      path: '/loyalty/admin',
      name: 'loyalty-admin',
      component: CouponListView,
    },
    {
      path: '/loyalty/admin/create',
      name: 'loyalty-admin-create',
      component: CreateCouponView,
    },
    {
      path: '/loyalty/admin/edit/:id',
      name: 'loyalty-admin-edit',
      component: EditCouponView,
    },
  ],
})



// router.beforeEach((to, _, next) => {
//   const publicPaths = new Set(['/', '/login', '/register']);
//   const protectedPaths = ['/profiles', '/profiles/add', '/posts'];
//   const auth = isAuthenticated();

//   if (!auth && protectedPaths.some(p => to.path.startsWith(p)) && !publicPaths.has(to.path)) {
//     toast.error('Token expired, please log in again');
//     return next('/login');
//   }

//   if (publicPaths.has(to.path)) return next();

//   if (to.path === '/profiles' && !isAdmin()) {
//     toast.error('Forbidden');
//     return next('/');
//   }

//   if (to.path === '/profiles/add' && !isAdmin()) {
//     toast.error('Forbidden');
//     return next('/');
//   }

//   if (to.path.startsWith('/profiles/') && to.params.id && !canAccessProfile(String(to.params.id))) {
//     toast.error('Forbidden');
//     return next('/');
//   }

//   next();
// });


export default router
