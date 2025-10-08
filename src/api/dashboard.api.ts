import api from "./client"
import { API_ENDPOINTS } from "./endpoints"


export const uploadFile = async (formData: FormData) => {
    const response = await api.post(`${API_ENDPOINTS.DATA.UPLOAD_FILE}`, formData);
    return response.data;
}