export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: "/login"
    },
    DATA: {
        UPLOAD_FILE: "/upload_pdf",
        GET_UPLOADS: "/get_all_uploads",
        GET_IMAGES_FOR_LABELLING: (uploadId:string) => `/get_images_by_label/${uploadId}`,
        LABEL_IMAGE: (uploadId:string) => `/label_image/${uploadId}`,
        GET_LABELS: "/get_all_labels",
        GET_MD_FOR_IMAGES: (uploadId:string) => `/get_md_from_images/${uploadId}`,
        GET_MD: (uploadId:string) => `/md/${uploadId}`,
        SAVE_MD: (uploadId:string) => `/save_eddited_md/${uploadId}`,
        GET_IMAGE_DESCRIPTIONS: (uploadId:string) => `/get_image_descriptions${uploadId}`,
        GET_IMAGE_DESCRIPTIONS_STATUS: (uploadId:string) => `/get_image_descriptions/status${uploadId}`,
        GENERAGE_IMAGE_DESCRIPTIONS: (uploadId:string) => `/get_image_descriptions/generate${uploadId}`,
        SAVE_CROPPED_IMAGE_WITH_DESCRIPTIONS: (uploadId:string) => `/extract_diagrams${uploadId}`,
        ON_COMPLETE: (uploadId:string) => `/process_and_upload_to_vdb/${uploadId}`
    }
}