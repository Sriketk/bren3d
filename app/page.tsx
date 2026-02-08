"use client";

import { Download, Image, Sparkles, Upload } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-semibold text-4xl text-foreground tracking-tight sm:text-5xl md:text-6xl">
            Upload your product photos. Get a clean, realistic 3D model your
            customers can rotate.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            Built for e-commerce. No 3D skills required.
          </p>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-10"
            initial={{ opacity: 0, y: 8 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Link
              className={cn(buttonVariants({ size: "lg" }), "gap-2")}
              href="/upload"
            >
              <Upload aria-hidden className="size-5" />
              Start with your photos
            </Link>
          </motion.div>
        </motion.div>

        <motion.section
          animate={{ opacity: 1 }}
          className="mt-24 grid gap-10 sm:grid-cols-3"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {[
            {
              step: 1,
              icon: Image,
              title: "Upload 3–6 photos",
              description: "JPG or PNG from different angles.",
            },
            {
              step: 2,
              icon: Sparkles,
              title: "We process",
              description:
                "Background removal, 3D reconstruction, clean output.",
            },
            {
              step: 3,
              icon: Download,
              title: "Embed or download",
              description: "GLB for web and Shopify, USDZ for Apple.",
            },
          ].map((item, i) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card p-6 text-center shadow-sm"
              initial={{ opacity: 0, y: 12 }}
              key={item.step}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
            >
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon aria-hidden className="size-6" />
              </div>
              <h2 className="mt-4 font-semibold text-foreground">
                {item.title}
              </h2>
              <p className="mt-2 text-muted-foreground text-sm">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.section>
      </main>
    </div>
  );
}
