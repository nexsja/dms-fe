// main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia'
import { VueQueryPlugin } from "vue-query";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import VuePdf from 'vue3-pdfjs'
import App from './App.vue';
import { createRouter } from './composables/useRoutes.js'

// Import PrimeVue core
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';
import './style.css';

// Import service components
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import { vueKeycloak } from "@josempgon/vue-keycloak";

const keycloakConfig = {
    config: {
        url: 'http://auth.dms.local',
        realm: 'dms',
        clientId: 'dms-fe',
    },
    initOptions: {
        flow: "implicit",
        onLoad: "check-sso",
        silentCheckSsoRedirectUri: `${location.origin}/sso/silent-check`
    }
}

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

await vueKeycloak.install(app, keycloakConfig)

app.use(pinia);
app.use(createRouter(app));
app.use(VueQueryPlugin);

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

app.use(VuePdf);
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');

