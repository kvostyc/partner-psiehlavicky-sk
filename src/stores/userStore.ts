import axiosInstance from "@/axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

interface User {
    name: string;
    email: string;
}

export const useUserStore = defineStore("user", () => {
    const user = ref<User | null>(null);
    const router = useRouter();

    const getUser = async () => {
        try {
            const response = await axiosInstance.get<User>("/user");
            user.value = response.data;
        } catch (error) {
            user.value = null;
        }
    };

    const logout = async () => {
        await axiosInstance.post("/logout");
        user.value = null;
        router.push({ name: "signin" });
    };

    return { user, getUser, logout };
});
