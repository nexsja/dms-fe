import axios from 'axios';
import { useMainStore } from "@/stores/mainStore.ts";
import { useAuthStore } from "@/stores/authStore.ts";
import { useAuth0 } from "@auth0/auth0-vue";

const API_URL = import.meta.env.VITE_DOCUMENT_STORE_URL;

export function useAuth() {
    const { getAccessTokenSilently, user } = useAuth0();
    const apiClient = axios.create({
        baseURL: API_URL
    });

    getAccessTokenSilently({
        authorizationParams: {
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        }
    }).then((token) => {
        apiClient.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        });
    })

    // function isAuthenticated(): boolean {
    //     return !!auth0.token;
    // }

    return {
        apiClient,
        // isAuthenticated
    };
}