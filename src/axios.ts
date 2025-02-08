import axios from "axios";
import router from "@/router";
import { useLoadingStore } from "@/stores/loadingStore";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/",
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
    (error) => {
        const loadingStore = useLoadingStore();
        loadingStore.stopLoading();

        if (error.response && error.response.status === 401) {
            if (router.currentRoute.value.name !== "signin") {
                router.push({ name: "signin" });
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
