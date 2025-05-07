<script setup lang="ts">
import { ref } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { Button } from 'primevue';

const auth0 = useAuth0();
const isLoading = ref(false);

// Login method
const login = async () => {
  isLoading.value = true;
  try {
    await auth0.loginWithRedirect({
      // authorizationParams: {
      //   prompt: "none",
      //   audience: `${import.meta.env.VITE_AUTH0_AUDIENCE}`
      // }
    });
  } catch (error) {
    console.error('Auth0 login error:', error);
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
      <!-- Logo/Brand -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-indigo-600 flex items-center justify-center rounded-full">
          <i class="pi pi-shield text-white text-3xl"></i>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">Welcome</h2>
        <p class="mt-2 text-sm text-gray-600">Secure login powered by Auth0</p>
      </div>

      <!-- Auth0 login button -->
      <div class="mt-8">
        <Button
            @click="login"
            label="Sign in with Auth0"
            icon="pi pi-lock"
            class="w-full p-button-primary text-lg py-3"
            :loading="isLoading"
        />
      </div>

      <!-- Security info -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Secure authentication</span>
          </div>
        </div>

        <div class="mt-6 text-center">
          <div class="flex justify-center space-x-6">
            <div class="flex flex-col items-center">
              <i class="pi pi-shield text-indigo-600 text-xl mb-2"></i>
              <span class="text-xs text-gray-600">Advanced Security</span>
            </div>
            <div class="flex flex-col items-center">
              <i class="pi pi-sync text-indigo-600 text-xl mb-2"></i>
              <span class="text-xs text-gray-600">Single Sign-On</span>
            </div>
            <div class="flex flex-col items-center">
              <i class="pi pi-lock text-indigo-600 text-xl mb-2"></i>
              <span class="text-xs text-gray-600">Data Protection</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Help text -->
      <div class="text-center mt-8">
        <p class="text-sm text-gray-600">
          Need help? <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Contact support</a>
        </p>
      </div>
    </div>
  </div>
</template>