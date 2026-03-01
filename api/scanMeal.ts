import { api } from "./axios";

export interface ScanUploadResponse {
  data: {
    scanId: string;
  };
}

export const uploadScanImage = async (
  imageUri: string,
): Promise<ScanUploadResponse> => {
  const formData = new FormData();
  formData.append("image", {
    uri: imageUri,
    type: "image/jpeg",
    name: "meal.jpg",
  } as any);

  const response = await api.post<ScanUploadResponse>(
    "/scan/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response.data;
};
