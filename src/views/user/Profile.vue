<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
    <div class="w-full max-w-3xl p-8 space-y-6 bg-white rounded-lg shadow-lg">
      <!-- User profile -->
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-green-600 flex items-center justify-center rounded-full">
          <i class="pi pi-check text-white text-3xl"></i>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">Authenticated</h2>
        <p class="mt-2 text-sm text-gray-600">Welcome back, {{ user?.name || 'User' }}</p>
      </div>

      <!-- User information -->
      <div class="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900 mb-2">User Profile</h3>
        <pre class="text-xs overflow-auto max-h-96 bg-gray-100 p-3 rounded">
          <code>{{ user }}</code>
          <code>{{ decodedToken }}</code>
        </pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth.ts";

const auth = useAuth();

const user = auth.getCurrentUser();

const decodedToken = auth.decodedToken


</script>