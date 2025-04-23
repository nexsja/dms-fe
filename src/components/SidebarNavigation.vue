<template>
  <div class="sidebar-wrapper">
    <!-- Mobile overlay -->
    <div
        v-if="isOpen && isMobile"
        class="sidebar-overlay"
        @click="toggleSidebar"
    ></div>

    <!-- Sidebar toggle button (mobile) -->
    <Button
        v-if="isMobile"
        icon="pi pi-bars"
        class="sidebar-toggle p-button-rounded p-button-text"
        @click="toggleSidebar"
        aria-label="Toggle menu"
    />

    <!-- Sidebar container -->
    <aside
        class="sidebar"
        :class="{
        'sidebar-open': isOpen,
        'sidebar-closed': !isOpen,
        'sidebar-mobile': isMobile
      }"
    >
      <!-- Header with logo and collapse button -->
      <div class="sidebar-header">
        <div class="sidebar-logo" v-if="logo && isOpen">
          <img
              v-if="logo"
              :src="logo"
              alt="Logo"
              class="logo-image"
          />
          <h2 class="sidebar-title">{{ title }}</h2>
        </div>
        <Button
            v-if="!isMobile"
            :icon="isOpen ? 'pi pi-chevron-left' : 'pi pi-chevron-right'"
            class="p-button-rounded p-button-text p-button-sm"
            @click="toggleSidebar"
            aria-label="Collapse menu"
        />
      </div>

      <!-- Navigation menu -->
      <nav class="sidebar-nav">
        <ul class="sidebar-menu">
          <li
              v-for="route in routes"
              :key="route.path"
              class="sidebar-menu-item"
          >

            <!-- Route with children (submenu) -->
            <div v-if="route.children && route.children.length" class="sidebar-submenu-wrapper">
              <div
                  class="sidebar-menu-link sidebar-submenu-toggle"
                  :class="{ 'active': isRouteActive(route) }"
                  @click="toggleSubmenu(route)"
              >
                <i v-if="route.meta.icon" :class="`pi ${route.meta.icon}`"></i>
                <span v-if="isOpen" class="sidebar-menu-text">{{ route.name }}</span>
                <i
                    v-if="isOpen"
                    class="pi submenu-indicator"
                    :class="route.expanded ? 'pi-chevron-down' : 'pi-chevron-right'"
                ></i>
              </div>

              <!-- Submenu items -->
              <Transition name="submenu">
                <ul v-if="isOpen && route.expanded" class="sidebar-submenu">
                  <li
                      v-for="child in route.children"
                      :key="child.path"
                      class="sidebar-submenu-item"
                  >
                    <router-link
                        :to="child.path"
                        class="sidebar-menu-link"
                        :class="{ 'active': isRouteActive(child) }"
                        v-slot="{ navigate }"
                        custom
                    >
                      <a @click="navigate" :href="child.path" @click.prevent>
                        <i v-if="child.icon" :class="`pi ${child.icon}`"></i>
                        <span class="sidebar-menu-text">{{ child.name }}</span>
                      </a>
                    </router-link>
                  </li>
                </ul>
              </Transition>
            </div>

            <!-- Regular route (no children) -->
            <router-link
                v-else
                :to="route.path"
                class="sidebar-menu-link"
                :class="{ 'active': isRouteActive(route)}"
                v-slot="{ navigate }"
                custom
            >
              <a @click="navigate" :href="route.path" @click.prevent>
                <i v-if="route.meta.icon" :class="`pi ${route.meta.icon}`"></i>
                <span v-if="isOpen" class="sidebar-menu-text">{{ route.name }}</span>
                <Badge
                    v-if="isOpen && route.badge"
                    :value="route.badge"
                    class="sidebar-badge"
                    :severity="route.badgeType || 'info'"
                ></Badge>
              </a>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Footer slot for additional content -->
      <div v-if="$slots.footer" class="sidebar-footer">
        <slot name="footer"></slot>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import Button from 'primevue/button';
import Badge from 'primevue/badge';

// Props
const props = defineProps({
  // Array of route objects
  routes: {
    type: Array,
    required: true
  },
  // Default open state
  defaultOpen: {
    type: Boolean,
    default: true
  },
  // Sidebar title
  title: {
    type: String,
    default: 'Navigation'
  },
  // Logo URL
  logo: {
    type: String,
    default: ''
  },
  // Breakpoint for mobile view (in pixels)
  mobileBreakpoint: {
    type: Number,
    default: 768
  }
});

// Emits
const emit = defineEmits(['toggle']);

// State
const isOpen = ref(props.defaultOpen);
const isMobile = ref(false);
const route = useRoute();

// Process routes to add expanded property for submenus
const routes = ref(props.routes.map(route => ({
  ...route,
  expanded: false
})));

// Check if route is active
const isRouteActive = (item) => {
  if (route.path === item.path) return true;

  // Check if any child route is active
  if (item.children) {
    return item.children.some(child => route.path === child.path);
  }

  return false;
};

// Toggle sidebar open/closed
const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
  emit('toggle', isOpen.value);

  // On mobile, if opening the sidebar, add a class to prevent scrolling
  if (isMobile.value && isOpen.value) {
    document.body.classList.add('sidebar-open-body');
  } else {
    document.body.classList.remove('sidebar-open-body');
  }
};

// Toggle submenu expanded state
const toggleSubmenu = (item) => {
  if (!isOpen.value) {
    isOpen.value = true;
    emit('toggle', true);
  }

  item.expanded = !item.expanded;
};

// Check window size for responsive behavior
const checkWindowSize = () => {
  isMobile.value = window.innerWidth < props.mobileBreakpoint;

  // Auto-close sidebar on mobile
  if (isMobile.value && isOpen.value) {
    isOpen.value = false;
    emit('toggle', false);
  }
};

// Use a computed property to determine whether to attach or detach the event listener
const shouldAttachListener = computed(() => {
  return typeof window !== 'undefined';
});

// Lifecycle hooks
onMounted(() => {
  checkWindowSize();
  if (shouldAttachListener.value) {
    window.addEventListener('resize', checkWindowSize);
  }
});

onUnmounted(() => {
  if (shouldAttachListener.value) {
    window.removeEventListener('resize', checkWindowSize);
  }
  document.body.classList.remove('sidebar-open-body');
});

// Watch for route changes to close sidebar on mobile
watch(route, () => {
  if (isMobile.value && isOpen.value) {
    isOpen.value = false;
    emit('toggle', false);
    document.body.classList.remove('sidebar-open-body');
  }
});
</script>

<style scoped>
.sidebar-wrapper {
  position: relative;
  height: 100%;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background-color: var(--surface-overlay);
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: all 0.3s ease;
}

.sidebar-open {
  width: 250px;
}

.sidebar-closed {
  width: 60px;
}

.sidebar-mobile {
  transform: translateX(-100%);
}

.sidebar-mobile.sidebar-open {
  transform: translateX(0);
  width: 280px;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.sidebar-toggle {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 998;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.sidebar-logo-img {
  max-height: 30px;
  max-width: 100%;
}

.sidebar-title {
  margin: 0;
  font-size: 1.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu-item {
  margin-bottom: 0.25rem;
}

.sidebar-menu-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 4px;
  margin: 0 0.5rem;
  transition: all 0.2s ease;
  position: relative;
}

.sidebar-menu-link:hover {
  background-color: var(--surface-hover);
}

.sidebar-menu-link.active {
  background-color: var(--primary-color);
  color: var(--primary-color-text);
}

.sidebar-menu-link i {
  margin-right: 0.75rem;
  font-size: 1.1rem;
}

.sidebar-closed .sidebar-menu-link {
  justify-content: center;
  padding: 0.75rem;
}

.sidebar-menu-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-badge {
  margin-left: auto;
}

.sidebar-submenu-wrapper {
  position: relative;
}

.sidebar-submenu-toggle {
  cursor: pointer;
}

.submenu-indicator {
  margin-left: auto;
  transition: transform 0.2s ease;
}

.sidebar-submenu {
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0.25rem 1.5rem;
}

.sidebar-submenu-item {
  margin-bottom: 0.25rem;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--surface-border);
}

/* Transitions */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Prevent body scrolling when sidebar is open on mobile */
:global(.sidebar-open-body) {
  overflow: hidden;
}
</style>