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

export const getUploads = async () => {
    const response = await api.get(`${API_ENDPOINTS.DATA.GET_UPLOADS}`);
    return response.data;
}

export const getImagesForLabelling = async (uploadId: string,label: string) => {
    const response = await api.get(`${API_ENDPOINTS.DATA.GET_IMAGES_FOR_LABELLING(uploadId)}?label=${label}`);
    return response.data;
}

export const postLabelForImage = async (uploadId: string, data: PostLabelForImageRequest) => {
    const response = await api.post(`${API_ENDPOINTS.DATA.LABEL_IMAGE(uploadId)}`, data);
    return response.data;
}

export const getLabels = async () => {
    const response = await api.get(`${API_ENDPOINTS.DATA.GET_LABELS}`);
    return response.data;
}

export const getMarkdownForImages = async (uploadId:string) => {
    const response = await api.post(`${API_ENDPOINTS.DATA.GET_MD_FOR_IMAGES(uploadId)}`);
    return response.data;
}

export const getMarkdown = async (uploadId:string) => {
    const response = await api.get(`${API_ENDPOINTS.DATA.GET_MD(uploadId)}`);
    return response.data;
}

export const saveMarkdown = async (uploadId:string, data: SaveMarkdownRequest) => {
    const response = await api.post(`${API_ENDPOINTS.DATA.SAVE_MD(uploadId)}`, { image_url: data.image_url, edited_md: data.markdown });
    return response.data;
}

export const getImageDescriptions = async (uploadId:string) => {
    const response = await api.get(`${API_ENDPOINTS.DATA.GET_IMAGE_DESCRIPTIONS(uploadId)}`);
    return response.data;
}

export const getImageDescriptionStatus = async (uploadId:string) => {
    const response = await api.get(`${API_ENDPOINTS.DATA.GET_IMAGE_DESCRIPTIONS_STATUS(uploadId)}`);
    return response.data;
}

export const generateImageDescriptions = async (uploadId:string,input:string) => {
    const response = await api.post(`${API_ENDPOINTS.DATA.GENERAGE_IMAGE_DESCRIPTIONS(uploadId)}`,{topics:[input],Regen:true});
    return response.data;
}

export const saveCroppedImagesWithDescriptions = async (uploadId:string, data:any) => {
    const response = await api.post(`${API_ENDPOINTS.DATA.SAVE_CROPPED_IMAGE_WITH_DESCRIPTIONS(uploadId)}`,data);
    return response.data;
}

export const onCompleteProcess = async (uploadId:string) => {
    const response = await api.post(`${API_ENDPOINTS.DATA.ON_COMPLETE(uploadId)}`);
    return response.data;
}