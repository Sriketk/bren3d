"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useModelViewer } from "./model-viewer-context";

export function ModelViewerCanvas({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { glbUrl, alt } = useModelViewer();

  return (
    <div
      className={cn("relative aspect-square w-full bg-white", className)}
      {...props}
    >
      {React.createElement("model-viewer", {
        alt,
        src: glbUrl,
        className: "h-full w-full",
        style: { backgroundColor: "#fff" },
        "camera-controls": true,
        "auto-rotate": true,
        "shadow-intensity": "1",
      })}
    </div>
  );
}
