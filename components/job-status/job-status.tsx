"use client";

import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import type { Job } from "@/lib/types";
import { cn } from "@/lib/utils";
import { JobStatusProvider, useJobStatus } from "./job-status-context";

const STEPS: { key: Job["status"]; label: string }[] = [
  { key: "pending", label: "Uploaded" },
  { key: "processing", label: "Processing" },
  { key: "completed", label: "Ready" },
];

function JobStatusRoot({
  job,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { job: Job }) {
  return (
    <JobStatusProvider job={job}>
      <div className={cn(className)} {...props}>
        {children}
      </div>
    </JobStatusProvider>
  );
}

function JobStatusHeader({ className, ...props }: React.ComponentProps<"div">) {
  const { job } = useJobStatus();
  const date = new Date(job.createdAt).toLocaleString();
  return (
    <div className={cn("space-y-1", className)} {...props}>
      <h1 className="font-semibold text-xl">Job {job.id}</h1>
      <p className="text-muted-foreground text-sm">Started {date}</p>
    </div>
  );
}

function getStepState(
  i: number,
  activeIndex: number
): "pending" | "active" | "completed" {
  if (i < activeIndex) {
    return "completed";
  }
  if (i === activeIndex) {
    return "active";
  }
  return "pending";
}

function JobStatusProgress({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  const { job } = useJobStatus();
  const currentIndex = STEPS.findIndex((s) => s.key === job.status);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <nav aria-label="Processing steps" className={cn(className)} {...props}>
      <ol className="flex flex-col gap-2 sm:flex-row sm:gap-4">
        {STEPS.map((step, i) => (
          <JobStatusStep
            key={step.key}
            label={step.label}
            state={getStepState(i, activeIndex)}
            stepNumber={i + 1}
          />
        ))}
      </ol>
    </nav>
  );
}

function JobStatusStep({
  state,
  stepNumber,
  label,
  className,
  ...props
}: React.ComponentProps<"li"> & {
  state: "pending" | "active" | "completed";
  stepNumber: number;
  label: string;
}) {
  return (
    <li
      aria-current={state === "active" ? "step" : undefined}
      className={cn(
        "flex items-center gap-2",
        state === "active" && "text-primary",
        className
      )}
      data-state={state}
      {...props}
    >
      {state === "completed" && (
        <CheckCircle2 aria-hidden className="size-5 shrink-0 text-primary" />
      )}
      {state === "active" && (
        <Loader2
          aria-hidden
          className="size-5 shrink-0 animate-spin text-primary"
        />
      )}
      {state === "pending" && (
        <Circle aria-hidden className="size-5 shrink-0 text-muted-foreground" />
      )}
      <span className="font-medium text-sm">{label}</span>
    </li>
  );
}

function JobStatusWarnings({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { job } = useJobStatus();
  if (!job.warnings?.length) {
    return null;
  }
  return (
    <div
      aria-live="polite"
      className={cn(
        "rounded-md border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-amber-800 text-sm dark:text-amber-200",
        className
      )}
      role="alert"
      {...props}
    >
      <ul className="list-disc space-y-1 pl-4">
        {job.warnings.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
    </div>
  );
}

function JobStatusActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { job } = useJobStatus();
  const isReady = job.status === "completed";
  const isFailed = job.status === "failed";

  return (
    <div className={cn("flex flex-wrap gap-3", className)} {...props}>
      {isReady && (
        <Link
          className={cn(buttonVariants(), "inline-flex")}
          href={`/view/${job.id}`}
        >
          View 3D model
        </Link>
      )}
      {isFailed && (
        <Button disabled variant="outline">
          Retry (not implemented)
        </Button>
      )}
    </div>
  );
}

export {
  JobStatusRoot,
  JobStatusHeader,
  JobStatusProgress,
  JobStatusStep,
  JobStatusWarnings,
  JobStatusActions,
};
