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
import { createAuth0 } from "@auth0/auth0-vue";

const auth0 = createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        redirect_uri: window.location.origin
    },
    cacheLocation: "memory"
});

auth0.checkSession({
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
}).finally(async () => {
    start()
})

const start = () => {
    const app = createApp(App);
    const pinia = createPinia();
    pinia.use(piniaPluginPersistedstate)

    app.use(auth0);
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
}

