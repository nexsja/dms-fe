import type { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-vue";

export function useUsersApi() {

    const auth0 = useAuth0();

    const getCurrentUser = () => {
        if (!auth0.isAuthenticated) {
            return {
                name: '',
                email: '',
                avatar: '',
            }
        }
        const { user } = auth0;
        return {
            name: user.value?.name,
            email: user.value?.email,
            avatar: user.value?.avatar,
        } as User
    }

    return {
        getCurrentUser
    }
}