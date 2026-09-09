import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { StubPage } from "@/components/landing/stub-page";
import { getIndustry, INDUSTRIES } from "@/content/industries";

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  return { title: industry ? `${industry.name} | Productix Industries` : "Productix Industries" };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />
      <StubPage
        eyebrow={industry.group}
        title={industry.name}
        description={industry.description}
        icon={industry.icon}
      />
      <Footer />
    </div>
  );
}
