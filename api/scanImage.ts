import { api } from "./axios";

// API Response Types
export interface DetectedIngredient {
  ingredientName: string;
  confidence: number;
}

export interface UploadImageResponse {
  requestId: string;
  detectedIngredients: DetectedIngredient[];
  processingTimeMs: number;
}

export interface JobStatus {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  detectionResults?: DetectedIngredient[];
  createdAt: string;
  completedAt?: string;
}

export interface AxiosResponse<T> {
  data: T;
}

export interface RecognitionUploadResponse {
  jobId: string;
}

export interface ScanImageParams {
  imageUri: string;
}

export interface ScanImageResponse {
  ingredients: string[];
  jobId: string;
}

export async function uploadImageForRecognition(
  imageUri: string,
): Promise<{ jobId: string }> {
  const formData = new FormData();

  const filename = imageUri.split("/").pop() || `image-${Date.now()}.jpg`;

  formData.append("image", {
    uri: imageUri,
    type: "image/jpeg",
    name: filename,
  } as any);

  try {
    const response = await api.post<AxiosResponse<RecognitionUploadResponse>>(
      "/recognition/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return {
      jobId: response.data.data.jobId,
    };
  } catch (error: any) {
    throw error?.response?.data?.message ?? error;
  }
}

