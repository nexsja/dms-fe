<!-- App.vue -->
<template>

  <main class="app-container">

    <SidebarNavigation
        :routes="routes"
        :defaultOpen="sidebarOpen"
        title="DocManager"
        :logo="logoUrl"
        @toggle="onSidebarToggle"
    >
      <template #footer>
        <Transition appear>
          <div class="user-info" v-if="sidebarOpen">
            <div class="user-details">
              <span class="user-name">John Doe</span>
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
import { ref, onMounted, watch } from 'vue';
import { useToast } from 'primevue/usetoast';

// Import PrimeVue components
import Card from 'primevue/card';
import Tab from 'primevue/tab';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Toast from 'primevue/toast';
import Header from "@/components/base/Header.vue";
import Footer from "@/components/base/Footer.vue";
import SidebarNavigation from "@/components/SidebarNavigation.vue";
import { useAppState } from "@/stores/global.ts";
import logoImage from "@/assets/images/logo.svg";
import Avatar from "primevue/avatar";

const logoUrl = ref(logoImage);

const toast = useToast();
const displayUploadDialog = ref(false);
const activeDocument = ref(null);
const store = useAppState();
const theme = store.theme;
const routes = [
  {path: '/', name: "Home", meta: { title: 'Dashboard', icon: 'pi pi-fw pi-home' }},
  {path: '/documents', name: "Documents", meta: { title: 'Documents', icon: 'pi pi-fw pi-file' }},
];

const viewDocument = (document) => {
  activeDocument.value = document;
};

const onSidebarToggle = (isVisible) => {
    store.setSidebarState(isVisible);
};

const sidebarOpen = ref(store.sidebarVisible);

watch(() => store.sidebarVisible, (newValue) => {
  sidebarOpen.value = newValue;
});

const onUpload = () => {
  displayUploadDialog.value = false;
  toast.add({ severity: 'success', summary: 'Success', detail: 'Document uploaded successfully', life: 3000 });
};

// Initialize theme
onMounted(() => {
  // Check for saved theme preference or system preference
  if (!theme && (window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    store.setTheme('dark');
  } else {
    store.setTheme(theme)
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