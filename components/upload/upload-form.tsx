"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { submitUpload } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  UploadDropzone,
  UploadFileList,
  UploadRoot,
  UploadTrigger,
  UploadValidation,
} from "./upload";
import { useUpload } from "./upload-context";

function UploadFormInner() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { files } = useUpload();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    for (const f of files) {
      formData.append("images", f.file);
    }
    startTransition(async () => {
      const result = await submitUpload(formData);
      if ("jobId" in result) {
        router.push(`/jobs/${result.jobId}`);
      }
    });
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <UploadDropzone />
      <UploadFileList />
      <UploadValidation />
      <UploadTrigger disabled={isPending}>
        {isPending ? "Processing…" : "Create 3D model"}
      </UploadTrigger>
    </form>
  );
}

export function UploadForm() {
  return (
    <UploadRoot>
      <Card>
        <CardHeader>
          <CardTitle>Upload product photos</CardTitle>
          <CardDescription>
            Add 3–6 JPG or PNG images from different angles. We’ll build a
            rotatable 3D model.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadFormInner />
        </CardContent>
      </Card>
    </UploadRoot>
  );
}
