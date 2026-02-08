import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EmbedSnippetWithCopy } from "@/components/export/embed-snippet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EmbedPageProps {
  searchParams: Promise<{ model?: string }>;
}

export default async function EmbedPage({ searchParams }: EmbedPageProps) {
  const { model } = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const embedUrl = model
    ? `${baseUrl}/view/${model}`
    : `${baseUrl}/view/mock-id`;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Link
          className="mb-6 -ml-2 inline-flex h-8 items-center gap-2 rounded-md px-2.5 font-medium text-foreground text-sm hover:bg-muted hover:text-foreground"
          href={model ? `/view/${model}` : "/"}
        >
          <ArrowLeft aria-hidden className="size-4" />
          Back
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Shopify embed code</CardTitle>
            <CardDescription>
              Paste this snippet into your Shopify theme or product page to show
              the 3D model in an iframe.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmbedSnippetWithCopy embedUrl={embedUrl} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
