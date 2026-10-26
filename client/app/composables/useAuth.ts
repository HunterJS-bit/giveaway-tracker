import { useState, useCookie, useRuntimeConfig } from '#imports';

interface User {
    id: string;
    email: string;
    role: string;
}

export const useAuth = () => {
    const config = useRuntimeConfig();
    const token = useCookie<string | null>('auth_token', { maxAge: 60 * 60 * 24 * 7 });
    const user = useState<User | null>('auth_user', () => null);

    const checkAuthStatus = async () => {
        if (!token.value) {
            user.value = null;
            return;
        }

        try {
            const apiBase = config.public.apiBase || 'http://localhost:3000';
            const data = await $fetch<{ user: User }>(`${apiBase}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            });
            user.value = data.user;
        } catch (e) {
            token.value = null;
            user.value = null;
        }
    };

    const logout = () => {
        token.value = null;
        user.value = null;
        if (process.client) {
            window.location.href = '/';
        }
    };

    const setSession = (newToken: string, newUser: User) => {
        token.value = newToken;
        user.value = newUser;
    };

    return {
        user,
        token,
        isAuthenticated: computed(() => !!user.value) || false,
        isAdmin: computed(() => user.value?.role === 'admin') || false,
        checkAuthStatus,
        setSession,
        logout
    };
};
