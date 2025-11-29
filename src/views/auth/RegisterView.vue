<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Model data register
const profileModel = reactive({
  fullName: "",
  username: "",
  email: "",
  password: "",
  gender: "",
  role: ""
});

const handleRegister = async () => {
  console.log("REGISTER DATA:", profileModel);

  // await userProfileStore.createProfile(profileModel);
  router.push('/login');
};
</script>

<template>
  <main class="w-full min-h-screen bg-white pt-24 py-10 px-4 overflow-y-auto">
    <div 
      class="mx-auto w-full max-w-md bg-white shadow-lg ring-1 ring-gray-200/70 
             rounded-2xl p-6 md:p-8 flex flex-col gap-4"
    >
      <h1 class="text-[#1aa546] font-bold text-2xl text-center">Register</h1>

      <form @submit.prevent="handleRegister" class="flex flex-col gap-4">

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            v-model="profileModel.fullName"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-[#147c35]"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
          <input
            v-model="profileModel.username"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-[#147c35]"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            v-model="profileModel.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-[#147c35]"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            v-model="profileModel.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-[#147c35]"
            placeholder="Enter your password"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            v-model="profileModel.gender"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white
                   focus:outline-none focus:ring-2 focus:ring-[#147c35]"
          >
            <option value="" disabled>Select your gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select
            v-model="profileModel.role"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white
                   focus:outline-none focus:ring-2 focus:ring-[#147c35]"
          >
            <option value="" disabled>Select your role</option>
            <option value="CUSTOMER">Customer</option>
            <option value="FLIGHT">Flight Airline</option>
            <option value="ACCOMMODATION">Accommodation Owner</option>
            <option value="RENTAL_VENDOR">Rental Vendor</option>
            <option value="INSURANCE_PROVIDER">Insurance Provider</option>
            <option value="TOUR_PACKAGE_VENDOR">Tour Package Vendor</option>
          </select>
        </div>

        <button
          type="submit"
          class="w-full bg-[#1aa546] text-white py-2 px-4 rounded-lg 
                 hover:bg-[#147c35] focus:outline-none focus:ring-2 focus:ring-[#147c35]
                 font-medium"
        >
          Register
        </button>

        <p class="text-center text-sm text-gray-600 pt-2">
          Already have an account? 
          <RouterLink 
            to="/login" 
            class="text-[#1aa546] hover:text-[#147c35] font-medium"
          >
            Login here
          </RouterLink>
        </p>

      </form>
    </div>
  </main>
</template>
