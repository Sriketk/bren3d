"use client";

import { createContext, type ReactNode, useContext } from "react";

interface ModelViewerContextValue {
  glbUrl: string;
  alt?: string;
}

const ModelViewerContext = createContext<ModelViewerContextValue | null>(null);

export function ModelViewerProvider({
  glbUrl,
  alt,
  children,
}: {
  glbUrl: string;
  alt?: string;
  children: ReactNode;
}) {
  return (
    <ModelViewerContext.Provider value={{ glbUrl, alt: alt ?? "3D model" }}>
      {children}
    </ModelViewerContext.Provider>
  );
}

export function useModelViewer() {
  const ctx = useContext(ModelViewerContext);
  if (!ctx) {
    throw new Error("useModelViewer must be used within ModelViewerProvider");
  }
  return ctx;
}
