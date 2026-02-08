import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  JobStatusActions,
  JobStatusHeader,
  JobStatusProgress,
  JobStatusRoot,
  JobStatusWarnings,
} from "@/components/job-status/job-status";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getJob } from "@/lib/data";

interface JobPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Link
          className="mb-6 -ml-2 inline-flex h-8 items-center gap-2 rounded-md px-2.5 font-medium text-foreground text-sm hover:bg-muted hover:text-foreground"
          href="/upload"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Back to upload
        </Link>
        <JobStatusRoot job={job}>
          <Card>
            <CardHeader>
              <JobStatusHeader />
            </CardHeader>
            <CardContent className="space-y-6">
              <JobStatusProgress />
              <JobStatusWarnings />
              <JobStatusActions />
            </CardContent>
          </Card>
        </JobStatusRoot>
      </div>
    </div>
  );
}
