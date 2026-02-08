import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { UploadForm } from "@/components/upload/upload-form";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Link
          className="mb-6 -ml-2 inline-flex h-8 items-center gap-2 rounded-md px-2.5 font-medium text-foreground text-sm hover:bg-muted hover:text-foreground"
          href="/"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Back
        </Link>
        <UploadForm />
      </div>
    </div>
  );
}
