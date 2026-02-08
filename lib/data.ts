import type { Job } from "@/lib/types";

/**
 * Fetch job by id. Skeleton: returns mock data for UI development.
 */
export async function getJob(id: string): Promise<Job | null> {
  // Skeleton: no implementation
  await Promise.resolve();
  if (!id) {
    return null;
  }
  return {
    id,
    status: "completed",
    createdAt: new Date().toISOString(),
    outputGlbUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    outputUsdzUrl: undefined,
    warnings: [],
  };
}

/**
 * Fetch GLB URL for the 3D viewer. Skeleton: returns mock sample URL.
 */
export async function getViewerModel(
  id: string
): Promise<{ glbUrl: string } | null> {
  // Skeleton: no implementation
  await Promise.resolve();
  if (!id) {
    return null;
  }
  return {
    glbUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
  };
}
