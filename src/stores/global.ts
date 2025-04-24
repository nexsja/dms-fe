import { acceptHMRUpdate, defineStore } from 'pinia';
import type { Theme, User } from "@/types";

interface AppState {
    theme: Theme,
    sidebarVisible: boolean,

    user: User,

    setTheme: (theme: Theme) => void,
    setSidebarState: (state: boolean) => void,
}

export const useAppState = defineStore('app-state', {
    state: (): AppState => {
        return {
            theme: 'light',
            sidebarVisible: true
        }
    },

    actions: {
        setSidebarState(state: boolean) {
            this.sidebarVisible = state;
        },

        setTheme(theme: Theme) {
            this.theme = theme;

            const html = document.documentElement;

            // Update data-theme attribute and class
            html.setAttribute('data-theme', theme);

            if (theme === 'dark') {
                html.classList.add('dark');
                // In a real app, you would use the theme from @primefaces/lara-dark-blue
                document.documentElement.style.setProperty('--primary-color', '#3b82f6');
                document.documentElement.style.setProperty('--surface-ground', '#121212');
                document.documentElement.style.setProperty('--surface-card', '#1e1e1e');
                document.documentElement.style.setProperty('--text-color', '#f9f9f9');
            } else {
                html.classList.remove('dark');
                // In a real app, you would use the theme from @primefaces/lara-light-blue
                document.documentElement.style.setProperty('--primary-color', '#3b82f6');
                document.documentElement.style.setProperty('--surface-ground', '#f8f9fa');
                document.documentElement.style.setProperty('--surface-card', '#ffffff');
                document.documentElement.style.setProperty('--text-color', '#495057');
            }
        },
    },

    persist: true,

})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAppState, import.meta.hot))
}