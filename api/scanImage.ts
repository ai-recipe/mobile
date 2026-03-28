import { api } from "./axios";

// API Response Types
export interface DetectedIngredient {
  name: string;
  confidence: number;
  matchedIngredientId: string;
}

export interface UploadImageResponse {
  requestId: string;
  detectedIngredients: DetectedIngredient[];
  processingTimeMs: number;
}

export interface JobStatus {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  imageUrl?: string;
  fileName?: string;
  errorMessage?: string;
  detectedIngredients?: DetectedIngredient[];
  createdAt: string;
  completedAt?: string;
}

export interface ScanImageParams {
  imageUri: string;
}

export interface ScanImageResponse {
  ingredients: string[];
  jobId: string;
}

/**
 * Upload an image for ingredient recognition
 * Returns a job ID that can be used to poll for results
 */
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
    const response = await api.post<UploadImageResponse>(
      "/recognition/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return {
      jobId: (response.data as any)?.data?.requestId ?? (response.data as any)?.requestId,
    };
  } catch (error: any) {
    throw error?.response?.data?.message ?? error;
  }
}

/**
 * Get the status of an image recognition job
 */
export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const response = await api.get(`/recognition/jobs/${jobId}`);
  return (response.data?.data ?? response.data) as JobStatus;
}

/**
 * Poll job status until completion or failure
 * @param jobId - The job ID to poll
 * @param maxAttempts - Maximum number of polling attempts (default: 60)
 * @param intervalMs - Polling interval in milliseconds (default: 2000)
 */
export async function pollJobStatus(
  jobId: string,
  maxAttempts: number = 60,
  intervalMs: number = 2000,
): Promise<JobStatus> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const status = await getJobStatus(jobId);

    if (status.status === "completed") {
      return status;
    }

    if (status.status === "failed") {
      throw new Error(status.errorMessage || "Job failed");
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
export async function scanImage({ imageUri }: ScanImageParams): Promise<ScanImageResponse> {
  try {
    const { jobId } = await uploadImageForRecognition(imageUri);

    const completedJob = await pollJobStatus(jobId);

    const ingredients = completedJob.detectedIngredients?.map((ing) => ing.name) ?? [];

    return { ingredients, jobId };
  } catch (error: any) {
    const backendMessage = error?.response?.data?.error?.message;
    const statusCode = error?.response?.data?.error?.statusCode;

    if (statusCode === 400 && error?.response?.data?.error?.errorCode) {
      throw new Error(backendMessage ?? 'Kota aşıldı veya servis hatası');
    }

    throw new Error(error?.message ?? backendMessage ?? 'Görüntü tarama başarısız, tekrar deneyin');
  }
}
