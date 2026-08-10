import Link from "next/link";
import { ReactNode } from "react";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <Link href="/" className="text-sm font-bold text-black/50 hover:text-black">
        &larr; FPWC
      </Link>
      <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-black/40">
        Last updated {updated}
      </p>
      <div className="prose-legal mt-8 space-y-6 text-sm leading-relaxed text-black/80">
        {children}
      </div>
    </div>
  );
}
