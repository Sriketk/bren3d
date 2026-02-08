"use client";

import { Download } from "lucide-react";
import type React from "react";
import { useTransition } from "react";
import { requestExport } from "@/app/actions";
import { Button } from "@/components/ui/button";

export function ExportActionsRoot({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function ExportButton({
  jobId,
  format,
  className,
  asChild,
  ...props
}: React.ComponentProps<"button"> & {
  jobId: string;
  format: "glb" | "usdz";
  asChild?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await requestExport(jobId, format);
    });
  };

  const label = format === "glb" ? "Download GLB" : "Download USDZ";
  const ariaLabel = `Download ${format.toUpperCase()} format`;

  if (asChild && props.children) {
    return (
      <Button
        aria-label={ariaLabel}
        className={className}
        disabled={isPending}
        onClick={handleClick}
        size="sm"
        variant="outline"
        {...props}
      >
        {props.children}
      </Button>
    );
  }

  return (
    <Button
      aria-label={ariaLabel}
      className={className}
      disabled={isPending}
      onClick={handleClick}
      size="sm"
      variant="outline"
      {...props}
    >
      <Download aria-hidden className="mr-2 size-4" />
      {isPending ? "Preparing…" : label}
    </Button>
  );
}

export function ExportButtons({ jobId }: { jobId: string }) {
  return (
    <ExportActionsRoot className="flex flex-wrap gap-2">
      <ExportButton format="glb" jobId={jobId} />
      <ExportButton format="usdz" jobId={jobId} />
    </ExportActionsRoot>
  );
}
