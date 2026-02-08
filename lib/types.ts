/**
 * Job status for 3D conversion pipeline (UI-only phase: mock data only).
 */
export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface Job {
  id: string;
  status: JobStatus;
  createdAt: string;
  outputGlbUrl?: string;
  outputUsdzUrl?: string;
  warnings?: string[];
}
