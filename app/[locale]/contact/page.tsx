import type { Metadata } from "next";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/config";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Metadata {
  const c = getDictionary(locale).contact;
  return pageMetadata({
    locale,
    path: "contact",
    title: c.metaTitle,
    description: c.metaDescription,
  });
}

export default function Page({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const c = getDictionary(locale).contact;
  return (
    <article className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-3xl font-extrabold tracking-tight">{c.h1}</h1>
      <p className="leading-relaxed text-muted">{c.intro}</p>
      <div className="rounded-2xl border border-white/10 bg-card p-6">
        <div className="text-sm text-muted">{c.emailLabel}</div>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-xl font-semibold text-secondary-bright underline"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </article>
  );
}
