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
 * Generate a unique idempotency key
 */
function generateIdempotencyKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Upload an image for ingredient recognition
 * Returns a job ID that can be used to poll for results
 */
export async function uploadImageForRecognition(
  imageUri: string,
): Promise<{ jobId: string }> {
  const formData = new FormData();

  // Extract filename from URI or generate one
  const filename = imageUri.split("/").pop() || `image-${Date.now()}.jpg`;

  console.log("filename", filename);
  console.log("imageUri", imageUri);
  // Create file object for upload
  formData.append("image", {
    uri: imageUri,
    type: "image/jpeg",
    name: filename,
  } as any);

  const idempotencyKey = generateIdempotencyKey();

  try {
    const response = await api.post<UploadImageResponse>(
      "/recognition/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "idempotency-key": idempotencyKey,
          "Idempotency-Key": idempotencyKey,
        },
      },
    );
    return { jobId: response.data.requestId };
  } catch (error) {
    console.log(
      "uploadImageForRecognition error",
      JSON.stringify(error, null, 2),
    );
    throw error;
  }
}

/**
 * Get the status of an image recognition job
 */
export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const response = await api.get<JobStatus>(`/recognition/jobs/${jobId}`);
  return response.data;
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
 * Handles the full flow: upload → poll → return ingredients
 */
export async function scanImage({
  imageUri,
}: ScanImageParams): Promise<ScanImageResponse> {
  try {
    // Step 1: Upload image and get job ID
    const { jobId } = await uploadImageForRecognition(imageUri);

    // Step 2: Poll for job completion
    const jobStatus = await pollJobStatus(jobId);

    // Step 3: Extract ingredients from completed job
    const ingredients =
      jobStatus.detectedIngredients?.map((ing) => ing.name) || [];

    return {
      ingredients,
      jobId,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Görüntü tarama başarısız: ${error.message}`);
    }
    throw new Error("Görüntü tarama başarısız");
  }
}
