import api from "./client"
import { API_ENDPOINTS } from "./endpoints"

interface PostLabelForImageRequest {
    imageUrl: string,
    label:string
}

export const uploadFile = async (formData: FormData) => {
    const response = await api.post(`${API_ENDPOINTS.DATA.UPLOAD_FILE}`, formData);
    return response.data;
}

export const getImagesForLabelling = async (label: string) => {
    const response = await api.get(`${API_ENDPOINTS.DATA.GET_IMAGES_FOR_LABELLING}?label=${label}`);
    return response.data;
}

export const postLabelForImage = async (data:PostLabelForImageRequest) => {
    const response = await api.post(`${API_ENDPOINTS.DATA.LABEL_IMAGE}`,data);
    return response.data;
}

export const getLabels = async () => {
    const response = await api.get(`${API_ENDPOINTS.DATA.GET_LABELS}`);
    return response.data;
}