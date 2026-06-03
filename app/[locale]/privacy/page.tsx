import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const p = getDictionary(locale).privacy;
  return pageMetadata({
    locale,
    path: "privacy",
    title: p.metaTitle,
    description: p.metaDescription,
  });
}

export default function Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const p = getDictionary(locale).privacy;
  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">{p.h1}</h1>
      {p.sections.map((s, i) => (
        <section key={i} className="space-y-2">
          <h2 className="text-lg font-semibold text-white">{s.title}</h2>
          <p className="leading-relaxed text-muted">{s.body}</p>
        </section>
      ))}
    </article>
  );
}
