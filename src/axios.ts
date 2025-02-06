import axios from "axios";
import router from "@/router";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/",
    withCredentials: true,
    withXSRFToken: true,
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            router.push({ name: "signin" });
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
