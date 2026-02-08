import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";
import { ExportButtons } from "@/components/export/export-actions";
import {
  ModelViewerActions,
  ModelViewerHeader,
  ModelViewerRoot,
} from "@/components/model-viewer/model-viewer";
import { ModelViewerCanvas } from "@/components/model-viewer/model-viewer-canvas";
import { Card, CardContent } from "@/components/ui/card";
import { getViewerModel } from "@/lib/data";

interface ViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewPage({ params }: ViewPageProps) {
  const { id } = await params;
  const model = await getViewerModel(id);
  if (!model) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Script
        src="https://unpkg.com/@google/model-viewer@4.1.0/dist/model-viewer.min.js"
        strategy="lazyOnload"
      />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          className="mb-6 -ml-2 inline-flex h-8 items-center gap-2 rounded-md px-2.5 font-medium text-foreground text-sm hover:bg-muted hover:text-foreground"
          href={`/jobs/${id}`}
        >
          <ArrowLeft aria-hidden className="size-4" />
          Back to job
        </Link>
        <ModelViewerRoot alt="Product 3D model" glbUrl={model.glbUrl}>
          <Card>
            <CardContent className="pt-6">
              <ModelViewerHeader title="Your 3D model" />
              <div className="mt-4">
                <ModelViewerCanvas />
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <ExportButtons jobId={id} />
                <ModelViewerActions jobId={id} />
              </div>
            </CardContent>
          </Card>
        </ModelViewerRoot>
      </div>
    </div>
  );
}
