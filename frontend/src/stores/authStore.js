// Keeps track of Session Users that have logged in
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: sessionStorage.getItem('auth_token') || null,
        role: sessionStorage.getItem('user_role') || null,
    }),
    
    actions: {
        login(token, role) {
            this.token = token;
            this.role = role;
            sessionStorage.setItem('auth_token', token);
            sessionStorage.setItem('user_role', role);
        },

        logout() {
            this.token = null;
            this.role = null;
            sessionStorage.removeItem('auth_token');
            sessionStorage.removeItem('user_role');
        },
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
        getRole: (state) => state.role || sessionStorage.getItem('user_role') || null,
        getToken: (state) => state.token || sessionStorage.getItem('auth_token') || null,
    },
});