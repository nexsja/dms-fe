<template>
  <main class="app-container">

    <SidebarNavigation
        :routes="routes"
        :defaultOpen="sidebarOpen"
        title="DocManager"
        :logo="logoUrl"
        @toggle="onSidebarToggle"
    >
      <template #footer v-if="auth.isAuthenticated">
        <Transition appear>
          <div class="user-info" v-if="sidebarOpen">
            <div class="user-details">
              <span class="user-name">{{ currentUser.email }}</span>
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
import { ref, onMounted } from 'vue';

import Toast from 'primevue/toast';
import Header from "@/components/base/Header.vue";
import Footer from "@/components/base/Footer.vue";
import SidebarNavigation from "@/components/SidebarNavigation.vue";
import { useMainStore } from "@/stores/mainStore.ts";
import logoImage from "@/assets/images/logo.svg";
import { useAuth } from "@/composables/useAuth.js";

const logoUrl = ref(logoImage);

const store = useMainStore();
const auth = useAuth();
const currentUser = auth.getCurrentUser();

const routes = [
  {path: '/', name: "Home", meta: { title: 'Dashboard', icon: 'pi pi-fw pi-home' }},
  {path: '/documents', name: "Documents", meta: { title: 'Documents', icon: 'pi pi-fw pi-file' }},
];

const onSidebarToggle = (isVisible) => {
    store.setSidebarState(isVisible);
};

const sidebarOpen = store.sidebarVisible;

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