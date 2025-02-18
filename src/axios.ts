import axios from "axios";
import router from "@/router";
import { useLoadingStore } from "@/stores/loadingStore";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/api/",
    withCredentials: true,
    withXSRFToken: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const loadingStore = useLoadingStore();
        loadingStore.startLoading();
        return config;
    },
    (error) => {
        const loadingStore = useLoadingStore();
        loadingStore.stopLoading();
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        const loadingStore = useLoadingStore();
        loadingStore.stopLoading();
        return response;
    },
    async (error) => {
        const loadingStore = useLoadingStore();
        loadingStore.stopLoading();

        if (error.response && error.response.status === 419) {
            try {
                await axios.get(import.meta.env.VITE_API_BASE_URL + "/sanctum/csrf-cookie", {
                    withCredentials: true,
                });

                return axiosInstance(error.config);
            } catch (csrfError) {
                return Promise.reject(csrfError);
            }
        }

        if (error.response && error.response.status === 401) {
            if (router.currentRoute.value.name !== "signin") {
                router.push({ name: "signin" });
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
