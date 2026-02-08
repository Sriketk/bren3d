"use client";

import { Code } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModelViewerProvider } from "./model-viewer-context";

function ModelViewerRoot({
  glbUrl,
  alt,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & { glbUrl: string; alt?: string }) {
  return (
    <ModelViewerProvider alt={alt} glbUrl={glbUrl}>
      <div className={cn("space-y-6", className)} {...props}>
        {children}
      </div>
    </ModelViewerProvider>
  );
}

function ModelViewerHeader({
  title,
  className,
  ...props
}: React.ComponentProps<"div"> & { title?: string }) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      <h1 className="font-semibold text-xl">{title ?? "3D model"}</h1>
    </div>
  );
}

function ModelViewerActions({
  jobId,
  className,
  ...props
}: React.ComponentProps<"div"> & { jobId: string }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)} {...props}>
      <Link
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "inline-flex gap-2"
        )}
        href={`/embed?model=${jobId}`}
      >
        <Code aria-hidden className="size-4" />
        Get embed code
      </Link>
    </div>
  );
}

export { ModelViewerRoot, ModelViewerHeader, ModelViewerActions };
