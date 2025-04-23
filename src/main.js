// main.js
import { createApp, watch } from 'vue';
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import VuePdf from 'vue3-pdfjs'
import App from './App.vue';
import { appRouter } from './composables/useRoutes.js'

// Import PrimeVue core
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';
import './style.css';

// Import service components
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

// Create Vue app
const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

app.use(pinia);
app.use(appRouter);

// Use PrimeVue plugins with theme configuration
app.use(PrimeVue, {
    ripple: true,

    theme: {
        preset: Aura,
        options: {
            cssLayer: {
                name: 'primevue',
                order: 'theme, base, primevue'
            }
        }
    }
});

// Register additional services
app.use(VuePdf);
app.use(ToastService);
app.use(ConfirmationService);

// Mount app
app.mount('#app');