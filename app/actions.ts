"use server";

/**
 * Submit uploaded images and create a job. Skeleton: no implementation.
 */
export async function submitUpload(
  _formData: FormData
): Promise<{ jobId: string } | { error: string }> {
  // Skeleton: no implementation
  await Promise.resolve();
  return { jobId: "mock-id" };
}

/**
 * Request export URL for GLB or USDZ. Skeleton: no implementation.
 */
export async function requestExport(
  _jobId: string,
  _format: "glb" | "usdz"
): Promise<{ url?: string; error?: string }> {
  // Skeleton: no implementation
  await Promise.resolve();
  return {};
}
