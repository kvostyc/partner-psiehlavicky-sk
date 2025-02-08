import axiosInstance from "@/axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

interface User {
    id: number;
    name: string;
    email: string;
}

export const useUserStore = defineStore("user", () => {
    const user = ref<User | null>(null);
    const roles = ref<string[]>([]);
    const permissions = ref<string[]>([]);
    const router = useRouter();

    const getUser = async () => {
        try {
            const response = await axiosInstance.get<{ user: User; roles: string[]; permissions: string[] }>("/user");
            user.value = response.data.user;
            roles.value = response.data.roles;
            permissions.value = response.data.permissions;
        } catch (error) {
            user.value = null;
            roles.value = [];
            permissions.value = [];
        }
    };

    const hasRole = (role: string): boolean => {
        return roles.value.includes(role);
    };

    const hasPermission = (permission: string): boolean => {
        return permissions.value.includes(permission);
    };

    const logout = async () => {
        await axiosInstance.post("/logout");
        user.value = null;
        roles.value = [];
        permissions.value = [];
        router.push({ name: "signin" });
    };

    return { user, roles, permissions, getUser, hasRole, hasPermission, logout };
});
