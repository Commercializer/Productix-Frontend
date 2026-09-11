import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DetailCta, DetailSection, EnablesList, Statement } from "@/components/landing/detail-sections";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { IndexHero } from "@/components/landing/index-hero";
import { Reveal } from "@/components/landing/reveal";
import { StubPage } from "@/components/landing/stub-page";
import { getIndustry, INDUSTRIES } from "@/content/industries";
import { getSolution } from "@/content/solutions";

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
  if (!industry) return { title: "Productix Industries" };
  if (!industry.seo) return { title: `${industry.name} | Productix Industries` };

  const canonical = `https://www.productix.io/industries/${slug}`;
  return {
    title: industry.seo.title,
    description: industry.seo.description,
    keywords: industry.seo.keywords,
    alternates: { canonical },
    openGraph: {
      title: industry.seo.ogTitle,
      description: industry.seo.ogDescription,
      url: canonical,
      images: [{ url: "/images/industries.jpg", alt: industry.seo.ogImageAlt }],
    },
  };
}

export default async function IndustryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  if (!industry.headline || !industry.intro || !industry.enables) {
    return (
      <div className="min-h-dvh bg-paper text-ink antialiased">
        <Header />
        <StubPage eyebrow={industry.group} title={industry.name} description={industry.description} icon={industry.icon} />
        <Footer />
      </div>
    );
  }

  const relevantSolutions = (industry.relevantSolutions ?? [])
    .map((s) => getSolution(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />

      <IndexHero eyebrow={industry.name} title={industry.headline} description={industry.intro} />

      <DetailSection bg="white">
        {industry.whyItMatters && (
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-dim">
              {industry.whyItMatters.heading}
            </span>
            <div className="mt-4 flex flex-col gap-3">
              {industry.whyItMatters.paragraphs.map((p) => (
                <p key={p} className="text-[15px] leading-[1.7] text-ink/60">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
        )}

        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          What Productix Enables
        </p>
        <div className="mx-auto mt-6 max-w-3xl">
          <EnablesList items={industry.enables} />
        </div>
      </DetailSection>

      {industry.closingStatement && (
        <DetailSection bg="cream" flip maxWidth="max-w-2xl">
          <Reveal className="flex flex-col items-center gap-4 text-center">
            <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-dim">
              {industry.closingStatement.heading}
            </span>
            <Statement>{industry.closingStatement.paragraph}</Statement>
          </Reveal>
        </DetailSection>
      )}

      {(relevantSolutions.length > 0 || industry.ctaLabel) && (
        <DetailSection bg={industry.closingStatement ? "white" : "cream"} flip={!industry.closingStatement} maxWidth="max-w-3xl">
          {relevantSolutions.length > 0 && (
            <>
              <p className="text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
                Relevant Solutions
              </p>
              <Reveal className="mt-6 flex flex-wrap justify-center gap-2">
                {relevantSolutions.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/solutions/${s.slug}`}
                    className="glass-light rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-ink/70 transition-colors hover:text-ink"
                  >
                    {s.name}
                  </Link>
                ))}
              </Reveal>
            </>
          )}
          {industry.ctaLabel && (
            <Reveal delay={100} className="mt-10 flex justify-center">
              <Link
                href="/book-a-demo"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[14px] font-semibold text-white transition-colors hover:bg-navy-deep"
              >
                {industry.ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          )}
        </DetailSection>
      )}

      <DetailCta
        title="Ready to Connect Your Products?"
        description="Explore how Productix can connect your products to trusted digital identity, compliance data, digital experiences and actionable intelligence."
        primary={{ label: "Book a Demo", href: "/book-a-demo" }}
        secondary={{ label: "Contact Us", href: "/company/contact" }}
      />

      <Footer />
    </div>
  );
}
