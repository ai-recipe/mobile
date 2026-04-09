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

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const response = await api.get(`/recognition/jobs/${jobId}`);
  return response.data?.data as JobStatus;
}

export async function pollJobStatus(
  jobId: string,
  maxAttempts: number = 60,
  intervalMs: number = 2000,
): Promise<JobStatus> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const response = await getJobStatus(jobId);

    if (response.status === "completed") {
      return response;
    }

    if (response.status === "failed") {
      throw new Error("Job failed");
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    attempts++;
  }

  throw new Error("Job polling timeout - maximum attempts reached");
}

/**
 * Main function to scan image and get ingredients
 * Handles the full flow: upload → poll for job completion → return ingredients
 */
export async function scanImage({
  imageUri,
}: ScanImageParams): Promise<ScanImageResponse> {
  try {
    const { jobId } = await uploadImageForRecognition(imageUri);

    const completedJob = await pollJobStatus(jobId);

    const ingredients =
      completedJob?.detectionResults?.map((ing) => ing.ingredientName) ?? [];

    return { ingredients, jobId };
  } catch (error: any) {
    console.log("error", JSON.stringify(error, null, 2));
    const backendMessage = error?.response?.data?.error?.message;
    const statusCode = error?.response?.data?.error?.statusCode;

    if (statusCode === 400 && error?.response?.data?.error?.errorCode) {
      throw new Error(backendMessage ?? "Kota aşıldı veya servis hatası");
    }

    throw new Error(
      error?.message ??
        backendMessage ??
        "Görüntü tarama başarısız, tekrar deneyin",
    );
  }
}
