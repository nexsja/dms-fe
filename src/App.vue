<!-- App.vue -->
<template>

  <div v-if="isLoading" class="loading-container">
    <div class="loading-spinner"></div>
  </div>

  <main v-else class="app-container">

    <SidebarNavigation
        :routes="routes"
        :defaultOpen="sidebarOpen"
        title="DocManager"
        :logo="logoUrl"
        @toggle="onSidebarToggle"
    >
      <template #footer v-if="isAuthenticated">
        <Transition appear>
          <div class="user-info" v-if="sidebarOpen">
            <div class="user-details">
              <span class="user-name">{{ authStore.email }}</span>
              <small class="user-role">Administrator</small>
            </div>
          </div>
        </Transition>
      </template>
    </SidebarNavigation>

    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <Header />
      <router-view />
      <Footer />
    </main>
  </main>
  <Toast />
</template>

<script setup>
import { ref, onMounted, watch, nextTick, getCurrentInstance, inject } from 'vue';

import Toast from 'primevue/toast';
import Header from "@/components/base/Header.vue";
import Footer from "@/components/base/Footer.vue";
import SidebarNavigation from "@/components/SidebarNavigation.vue";
import { useMainStore } from "@/stores/mainStore.ts";
import logoImage from "@/assets/images/logo.svg";
import { useAuth0 } from "@auth0/auth0-vue";
import { useAuthStore } from "@/stores/authStore.js";

const logoUrl = ref(logoImage);

const store = useMainStore();
const routes = [
  {path: '/', name: "Home", meta: { title: 'Dashboard', icon: 'pi pi-fw pi-home' }},
  {path: '/documents', name: "Documents", meta: { title: 'Documents', icon: 'pi pi-fw pi-file' }},
];

const onSidebarToggle = (isVisible) => {
    store.setSidebarState(isVisible);
};

const sidebarOpen = store.sidebarVisible;

const { isAuthenticated, isLoading, user: auth0User, getAccessTokenSilently, loginWithRedirect } = useAuth0();
const authStore = useAuthStore();


watch(auth0User, async (newUser) => {
  if (!isAuthenticated.value) {
    return
  }

  // try {
  //   await getAccessTokenSilently({
  //     authorizationParams: {
  //       audience: `${import.meta.env.VITE_AUTH0_AUDIENCE}`
  //     }
  //   }).then((token) => {
  //     console.log(token);
  //     authStore.saveAndProcessToken(token);
  //   })
  // } catch (e) {
  //   console.log(e);
  //   if (e.error === 'login_required') {
  //     // await loginWithRedirect();
  //   }
  //   if (e.error === 'consent_required') {
  //     // await loginWithRedirect();
  //   }
  //   throw e;
  // }
  //
  authStore.syncUser({...newUser}, isAuthenticated)
  //
  // await nextTick()
})

onMounted(() => {

  // Check for saved theme preference or system preference
  if (!store.theme && (window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    store.setTheme('dark');
  } else {
    store.setTheme(store.theme)
  }
});
</script>

<style scoped>
.user-details {
  display: flex;
  flex-direction: column;
  text-wrap: nowrap;
  margin-left: 10px;
}
</style>