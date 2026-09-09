import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { StubPage } from "@/components/landing/stub-page";
import { getSolution, SOLUTIONS } from "@/content/solutions";

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  return { title: solution ? `${solution.title} | Productix Solutions` : "Productix Solutions" };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />
      <StubPage
        eyebrow={solution.name}
        title={solution.title}
        description={solution.description}
        keyTerms={solution.keyTerms}
        icon={solution.icon}
      />
      <Footer />
    </div>
  );
}
