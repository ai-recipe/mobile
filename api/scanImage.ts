const SCAN_IMAGE_WEBHOOK =
  "https://n8n-production-cf278.up.railway.app/webhook/scan-image";

export interface ScanImageResponse {
  ingredients: string[];
}

export interface ScanImageParams {
  imageUrl: string;
}

export async function scanImage({
  imageUrl,
}: ScanImageParams): Promise<ScanImageResponse> {
  // TODO: Replace with actual endpoint when available
  // For now, using mock data for development

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock response with Turkish ingredients
  return {
    ingredients: ["yumurta", "sucuk", "domates", "biber", "soğan", "peynir"],
  };

  /* Uncomment when actual endpoint is ready:
  const url = new URL(SCAN_IMAGE_WEBHOOK);
  url.searchParams.set("image_url", imageUrl);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Scan image failed: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as ScanImageResponse;
  return data;
  */
}
