import { defineStore } from 'pinia'
import type { User } from '@/types/User';
import type { User as AuthUser } from '@auth0/auth0-spa-js/dist/typings/global';
import { jwtDecode, type JwtPayload } from "jwt-decode";

export type RootState = {
    user: User | null,
    error: string, // do something with error or lose it
    token: string | null,
    permissions: string[],
}

export const useAuthStore = defineStore('auth', {
    actions: {
        login(payload: AuthUser) {
            this.user = {
                email: payload.email,
                name: payload.nickname,
                avatar: payload.picture
            } as User
            this.error = ''
        },
        logout() {
            this.user = null
        },
        saveAndProcessToken(token: string) {
            const { permissions } = jwtDecode<JwtPayload & { permissions: [] }>(token)

            this.token = token;
            this.permissions = permissions
        },
        syncUser(user: AuthUser, isAuthenticated: boolean) {
            // the user has logged out -- log out and you're done
            if (!isAuthenticated && this.isAuthenticated) {
                this.logout()
            }

            // the user has logged in or the user changed...?
            else if ((isAuthenticated && !this.isAuthenticated) || (user?.email != this?.email)) {
                this.login(user)
            }
        },
    },

    state: () => ({
        user: null,
        error: '',
        token: null,
    } as RootState),

    getters: {
        email: (state: RootState): string => state.user?.email ?? '',
        name: (state: RootState): string => state.user?.name ?? '',
        avatar: (state: RootState): string => state.user?.avatar ?? '',
        isAuthenticated: (state: RootState): boolean => !!(state.user?.email),
        initials: (state: RootState): string => (state.user?.name ?? '').split(' ').map(word => word[0] || '').join('').toUpperCase(),
    }
})