<script setup lang="ts">
import { Button, OverlayBadge, Avatar, Menu } from 'primevue';
import { computed, onMounted, ref } from "vue";
import logoImage from "@/assets/images/logo.svg";
import { useToast } from "primevue/usetoast";
import { useMainStore } from "@/stores/mainStore.ts";
import { useRouter } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";
import type { User } from "@/types";
import { useAuthStore } from "@/stores/authStore.ts";
import { storeToRefs } from "pinia";

interface HeaderProps {
  isAuthenticated: boolean;
}

const props = defineProps<HeaderProps>();
const router = useRouter();
const { logout } = useAuth0();

const toast = useToast();
const logoUrl = ref(logoImage);
const avatarUrl = "https://www.gravatar.com/avatar/05dfd4b41340d09cae045235eb0893c3?d=mp";

const store = useMainStore();
const authStore = useAuthStore();
const user = computed(() => authStore.user).value;

// const { user, isAuthenticated } = storeToRefs(authStore);
const theme = store.theme;

// User menu items
const userMenu = ref(null);
const userMenuItems = ref([
  {
    label: 'User Options',
    items: [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => navigateTo('profile')
      },
      {
        label: 'Projects',
        icon: 'pi pi-folder',
        command: () => navigateTo('projects')
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        command: () => navigateTo('settings')
      }
    ]
  },
  {
    separator: true
  }
]);

onMounted(() => {

  if (props.isAuthenticated) {
      userMenuItems.value.push(
          {
            label: 'Sign Out',
            icon: 'pi pi-sign-out',
            command: () => {
              signOut();
              logout({
                logoutParams: {
                  returnTo: window.location.origin
                }
              })
            }
          }
      )
    } else {
      userMenuItems.value.push(
          {
            label: 'Sign in',
            icon: 'pi pi-sign-in',
            command: () => {

              //loginWithPopup()
              router.push('/login')
            }
          }
      )
    }
})
// Menu toggle function
const toggleUserMenu = (event) => {
  userMenu.value.toggle(event);
};

// Navigation functions
const navigateTo = (route) => {
  router.push({ name: 'profile' });
  toast.add({ severity: 'info', summary: 'Navigation', detail: `Navigating to ${route}`, life: 3000 });
  // In a real app, you would use router.push(route)
};

const signOut = () => {
  toast.add({ severity: 'info', summary: 'Authentication', detail: 'Signing out...', life: 3000 });
  // In a real app, you would handle the sign-out process
};

const switchTheme = (newTheme: 'light' | 'dark') => {
  store.setTheme(newTheme);
};
</script>

<template>
  <div class="app-header">
    <div class="header-logo">
      <img :src="logoUrl" alt="DMS Logo" class="logo-image" />
      <span class="logo-text">DocManager</span>
    </div>

    <div class="header-actions">
      <Button label="Light" icon="pi pi-sun" @click="switchTheme('light')"
              class="p-button-text p-button-rounded mr-2"
              :class="{ 'p-button-plain': theme !== 'light' }" />
      <Button label="Dark" icon="pi pi-moon" @click="switchTheme('dark')"
              class="p-button-text p-button-rounded mr-3"
              :class="{ 'p-button-plain': theme !== 'dark' }" />

      <div class="user-profile">
        <OverlayBadge value="4" severity="danger" class="inline-flex">
          <Avatar :image="avatarUrl"
                  @click="toggleUserMenu"
                  size="large"
                  shape="circle"
                  class="user-avatar"
                  :label="authStore.initials"
                  style="background-color: var(--primary-color); color: white;" />
        </OverlayBadge>

        <Menu ref="userMenu"
              :model="userMenuItems"
              :popup="true" />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>