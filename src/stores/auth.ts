import { defineStore } from "pinia";
import axios from "axios";

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    companyName?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

export const useAuthStore = defineStore("auth", {
    state: (): AuthState => ({
        user: null,
        token: localStorage.getItem("token") || null,
        isAuthenticated: !!localStorage.getItem("token"),
    }),

    getters: {
        getUser(state): User | null {
            return state.user;
        },
        getToken(state): string | null {
            return state.token;
        },
        isLoggedIn(state): boolean {
            return state.isAuthenticated;
        },
    },

    actions: {
        async login(email: string, password: string, isExternal = false): Promise<void> {
            try {
                const endpoint = isExternal
                    ? "/api/external/auth/login"
                    : "/api/internal/auth/login";

                const response = await axios.post<{ token: string; user: User }>(endpoint, {
                    email,
                    password,
                });

                this.token = response.data.token;
                this.isAuthenticated = true;
                this.user = response.data.user;

                localStorage.setItem("token", this.token);
                axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
            } catch (error: any) {
                console.error("Login error:", error.response?.data || error.message);
                throw error;
            }
        },

        async fetchUser(): Promise<void> {
            if (!this.token) return;

            try {
                const response = await axios.get<User>("/api/internal/auth/me");
                this.user = response.data;
            } catch (error: any) {
                console.error("Fetch user error:", error.response?.data || error.message);
                this.logout();
            }
        },

        logout(): void {
            this.token = null;
            this.user = null;
            this.isAuthenticated = false;

            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
        },
    },
});
