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
    return { jobId: response.data.requestId };
  } catch (error) {
    console.log("uploadImageForRecognition error", error?.response?.message);
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
    console.log("pollJobStatus", jobId);
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
    /*const { detectedIngredients, requestId } = (await uploadImageForRecognition(
      imageUri,
    )) as any;*/
    const response = {
      data: {
        requestId: "500a3260-99b8-4164-86c7-181878f2f2ef",
        detectedIngredients: [
          {
            name: "pineapple",
            confidence: 0.95,
            matchedIngredientId: null,
          },
          {
            name: "blueberries",
            confidence: 0.95,
            matchedIngredientId: null,
          },
          {
            name: "eggs",
            confidence: 0.95,
            matchedIngredientId: null,
          },
          {
            name: "lettuce",
            confidence: 0.95,
            matchedIngredientId: null,
          },
          {
            name: "asparagus",
            confidence: 0.9,
            matchedIngredientId: null,
          },
          {
            name: "tomato",
            confidence: 0.95,
            matchedIngredientId: null,
          },
          {
            name: "cucumber",
            confidence: 0.9,
            matchedIngredientId: null,
          },
          {
            name: "cabbage",
            confidence: 0.9,
            matchedIngredientId: null,
          },
          {
            name: "bell pepper",
            confidence: 0.95,
            matchedIngredientId: null,
          },
          {
            name: "carrot",
            confidence: 0.9,
            matchedIngredientId: null,
          },
          {
            name: "cheese",
            confidence: 0.95,
            matchedIngredientId: null,
          },
          {
            name: "ground meat",
            confidence: 0.85,
            matchedIngredientId: null,
          },
          {
            name: "ice cream",
            confidence: 0.9,
            matchedIngredientId: null,
          },
        ],
        processingTimeMs: 8698,
      },
      statusCode: 200,
      timestamp: "2026-02-05T15:34:15.844Z",
    };
    const { detectedIngredients, requestId } = response.data;
    // Step 2: Poll for job completion
    //const jobStatus = await pollJobStatus(jobId);

    // Step 3: Extract ingredients from completed job
    const ingredients = detectedIngredients?.map((ing: any) => ing.name) || [];

    return {
      ingredients,
      jobId: requestId,
    };
  } catch (error: any) {
    console.log("scanImage error", error?.response?.data?.message);
    throw new Error(
      `Görüntü tarama başarısız: ${error?.response?.data?.message}`,
    );
  }
}
