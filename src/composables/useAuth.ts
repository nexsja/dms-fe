import axios from 'axios';
import { useMainStore } from "@/stores/mainStore.ts";
import { useAuthStore } from "@/stores/authStore.ts";

const API_URL = import.meta.env.VITE_DOCUMENT_STORE_URL;

export function useAuth() {
    const appState = useAuthStore();

    const apiClient = axios.create({
        baseURL: API_URL
    });

    apiClient.interceptors.request.use(config => {
        if (appState.token) {
            config.headers.Authorization = `Bearer ${appState.token}`;
        }
        return config;
    });

    function isAuthenticated(): boolean {
        return !!appState.token;
    }

    return {
        apiClient,
        isAuthenticated
    };
}