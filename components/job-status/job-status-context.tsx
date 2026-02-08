"use client";

import { createContext, type ReactNode, useContext } from "react";
import type { Job } from "@/lib/types";

interface JobStatusContextValue {
  job: Job;
}

const JobStatusContext = createContext<JobStatusContextValue | null>(null);

export function JobStatusProvider({
  job,
  children,
}: {
  job: Job;
  children: ReactNode;
}) {
  return (
    <JobStatusContext.Provider value={{ job }}>
      {children}
    </JobStatusContext.Provider>
  );
}

export function useJobStatus() {
  const ctx = useContext(JobStatusContext);
  if (!ctx) {
    throw new Error("useJobStatus must be used within JobStatusProvider");
  }
  return ctx;
}
