import api from "@/api/client"
import { API_ENDPOINTS } from "@/api/endpoints"


interface LoginRequest {
    username: string,
    password: string
}

export const login = async (data:LoginRequest) => {
    const response = await api.post(`${API_ENDPOINTS.AUTH.LOGIN}`,data);
    return response.data;
}   