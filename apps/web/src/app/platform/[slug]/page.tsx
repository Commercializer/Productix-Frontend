import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { StubPage } from "@/components/landing/stub-page";
import { getPlatformPillar, PLATFORM_PILLARS } from "@/content/platform";

export function generateStaticParams() {
  return PLATFORM_PILLARS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pillar = getPlatformPillar(slug);
  return { title: pillar ? `${pillar.title} | Platform` : "Platform" };
}

export default async function PlatformDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pillar = getPlatformPillar(slug);
  if (!pillar) notFound();

  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />
      <StubPage
        eyebrow={pillar.name}
        title={pillar.title}
        description={pillar.description}
        keyTerms={pillar.keyTerms}
        icon={pillar.icon}
      />
      <Footer />
    </div>
  );
}
