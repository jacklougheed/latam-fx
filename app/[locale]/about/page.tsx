import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const a = getDictionary(locale).about;
  return pageMetadata({
    locale,
    path: "about",
    title: a.metaTitle,
    description: a.metaDescription,
  });
}

export default function Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const a = getDictionary(locale).about;
  return (
    <article className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-3xl font-extrabold tracking-tight">{a.h1}</h1>
      {a.body.map((para, i) => (
        <p key={i} className="leading-relaxed text-muted">
          {para}
        </p>
      ))}
    </article>
  );
}
