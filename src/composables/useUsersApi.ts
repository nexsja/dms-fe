import type { User } from "@/types";

export function useUsersApi() {

    const getCurrentUser = () => {

        return {
            id: 'ffa28d4c-5112-450b-bbba-ee91c159dd50',
            name: 'John Smith',
            email: 'john.smith@example.com',
            role: 'admin'
        } as User
    }

    return {
        getCurrentUser
    }
}