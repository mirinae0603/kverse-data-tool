import api from "./client"
import { API_ENDPOINTS } from "./endpoints"

interface PostLabelForImageRequest {
    image_url: string,
    label: string
}

interface SaveMarkdownRequest {
    image_url: string,
    markdown: string
}

export const uploadFile = async (formData: FormData) => {
    const response = await api.post(`${API_ENDPOINTS.DATA.UPLOAD_FILE}`, formData);
    return response.data;
}

export const getImagesForLabelling = async (label: string) => {
    const response = await api.get(`${API_ENDPOINTS.DATA.GET_IMAGES_FOR_LABELLING}?label=${label}`);
    return response.data;
}

export const postLabelForImage = async (data: PostLabelForImageRequest) => {
    const response = await api.post(`${API_ENDPOINTS.DATA.LABEL_IMAGE}`, data);
    return response.data;
}

export const getLabels = async () => {
    const response = await api.get(`${API_ENDPOINTS.DATA.GET_LABELS}`);
    return response.data;
}

export const getMarkdownForImages = async (label: string) => {
    const response = await api.post(`${API_ENDPOINTS.DATA.GET_MD_FOR_IMAGES}`);
    return response.data;
}

export const getMarkdown = async () => {
    const response = await api.get(`${API_ENDPOINTS.DATA.GET_MD}`);
    return response.data;
}

export const saveMarkdown = async (data: SaveMarkdownRequest) => {
    const response = await api.post(`${API_ENDPOINTS.DATA.SAVE_MD}`, { image_url: data.image_url, edited_md: data.markdown });
    return response.data;
}

export const getImageDescriptions = async () => {
    const response = await api.get(`${API_ENDPOINTS.DATA.GET_IMAGE_DESCRIPTIONS}`);
    return response.data;
}

export const getImageDescriptionStatus = async () => {
    const response = await api.get(`${API_ENDPOINTS.DATA.GET_IMAGE_DESCRIPTIONS_STATUS}`);
    return response.data;
}

export const generateImageDescriptions = async (input:string) => {
    const response = await api.post(`${API_ENDPOINTS.DATA.GENERAGE_IMAGE_DESCRIPTIONS}`,{topics:[input],Regen:true});
    return response.data;
}