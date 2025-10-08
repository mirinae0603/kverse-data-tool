import axios, {AxiosError} from "axios";
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

api.interceptors.request.use(
    config => {
        // You can add authorization headers or other custom headers here
        // For example, if you have a token stored in localStorage:
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    response => response,
    error => {
        if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            if (status === 401) {
                // Handle unauthorized access, e.g., redirect to login
                console.error("Unauthorized access - perhaps redirect to login?");
            } else if (status === 403) {
                // Handle forbidden access
                console.error("Forbidden access - you don't have permission to access this resource.");
            } else if (status === 500) {
                // Handle server errors
                console.error("Server error - please try again later.");
            }
        }
        return Promise.reject(error);
    }
);

export default api; 