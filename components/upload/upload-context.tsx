"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ACCEPT = "image/jpeg,image/png";
const MIN_FILES = 3;
const MAX_FILES = 6;

export interface UploadFile {
  file: File;
  id: string;
  preview: string;
}

interface UploadContextValue {
  files: UploadFile[];
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  moveFile: (id: string, direction: "up" | "down") => void;
  validation: { valid: boolean; message?: string };
  clearFiles: () => void;
}

const UploadContext = createContext<UploadContextValue | null>(null);

function validateFiles(files: UploadFile[]): {
  valid: boolean;
  message?: string;
} {
  if (files.length < MIN_FILES) {
    return {
      valid: false,
      message: `Add at least ${MIN_FILES} images (${MIN_FILES - files.length} more).`,
    };
  }
  if (files.length > MAX_FILES) {
    return {
      valid: false,
      message: `Use at most ${MAX_FILES} images. Remove ${files.length - MAX_FILES}.`,
    };
  }
  const invalid = files.some(
    (f) => !["image/jpeg", "image/png"].includes(f.file.type)
  );
  if (invalid) {
    return { valid: false, message: "Only JPG and PNG are allowed." };
  }
  return { valid: true };
}

export function UploadProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const addFiles = useCallback((newFiles: File[]) => {
    const allowed = newFiles.filter((f) =>
      ["image/jpeg", "image/png"].includes(f.type)
    );
    setFiles((prev) => {
      const combined = [...prev];
      for (const file of allowed) {
        if (combined.length >= MAX_FILES) {
          break;
        }
        combined.push({
          file,
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          preview: URL.createObjectURL(file),
        });
      }
      return combined;
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item) {
        URL.revokeObjectURL(item.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const moveFile = useCallback((id: string, direction: "up" | "down") => {
    setFiles((prev) => {
      const i = prev.findIndex((f) => f.id === id);
      if (i === -1) {
        return prev;
      }
      if (direction === "up" && i === 0) {
        return prev;
      }
      if (direction === "down" && i === prev.length - 1) {
        return prev;
      }
      const next = [...prev];
      const j = direction === "up" ? i - 1 : i + 1;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }, []);

  const clearFiles = useCallback(() => {
    setFiles((prev) => {
      for (const f of prev) {
        URL.revokeObjectURL(f.preview);
      }
      return [];
    });
  }, []);

  const validation = useMemo(() => validateFiles(files), [files]);

  const value = useMemo<UploadContextValue>(
    () => ({
      files,
      addFiles,
      removeFile,
      moveFile,
      validation,
      clearFiles,
    }),
    [files, addFiles, removeFile, moveFile, validation, clearFiles]
  );

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
}

export function useUpload() {
  const ctx = useContext(UploadContext);
  if (!ctx) {
    throw new Error("useUpload must be used within UploadProvider");
  }
  return ctx;
}

export { ACCEPT, MIN_FILES, MAX_FILES };
