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
import VStatusForm from '@/components/rentalbooking/VStatusForm.vue'
import EditStatusBookingView from '@/views/rentalbooking/EditStatusBookingView.vue'
import ChartBookingView from '@/views/rentalbooking/ChartBookingView.vue'
console.log("VITE_API_URL =", import.meta.env.VITE_API_URL)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/vehicles',
      name: 'vehicle',
      component: VehicleView
    },
    {
      path: '/vehicles/add',
      name: 'create-vehicle',
      component: CreateVehicleView
    },
    {
      path: '/vehicles/:id',
      name: 'detail-vehicle',
      component: DetailVehicleView
    },
    {
      path: '/vehicles/:id/edit',
      name: 'edit-vehicle',
      component: EditVehicleView
    },
{
  path: '/bookings',
  name: 'booking',
  component: RentalBookingView
},

{
  path: '/bookings/add',
  name: 'create-booking',
  component: CreateRentalBookingView
},

{
  path: '/bookings/create/addons',
  name: 'CreateBookingAddOns',
  component: CreateAddOnRentalBookingView
},

{
  path: '/bookings/:id/edit',
  name: 'edit-booking',
  component: EditRentalBookingView
},

{
  path: '/bookings/:id/update-addons',
  name: 'edit-booking-addons',
  component: EditAddOnBookingView
},

{
  path: '/bookings/:id/update-status',
  name: 'update-status',
  component:EditStatusBookingView
},

{
  path: '/bookings/:id',
  name: 'detail-booking',
  component: DetailRentalBookingView
},

    {
      path: '/bookings/statistics',
      name: 'statistics',
      component: ChartBookingView
    }
  ],
})

export default router
