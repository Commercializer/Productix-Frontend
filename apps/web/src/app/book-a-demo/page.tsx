import type { Metadata } from "next";

import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { LeadForm } from "@/components/landing/lead-form";

export const metadata: Metadata = {
  title: "Book a Demo",
  description: "Book a demo of the Productix connected product platform.",
};

export default function BookADemoPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />
      <section className="bg-cream px-6 pb-24 pt-40 md:pt-48">
        <div className="mx-auto max-w-lg">
          <div className="text-center">
            <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-accent-dim">
              Book a Demo
            </span>
            <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
              Ready Your Products for What&rsquo;s Next.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-[15.5px] leading-[1.7] text-ink/60">
              Build a connected digital foundation for your products,
              packaging and compliance requirements. Tell us about your team
              and we&rsquo;ll set up time to talk.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-ink/10 bg-white p-8">
            <LeadForm
              submitLabel="Book an assessment"
              successMessage="Thanks, we'll reach out to schedule your demo."
              fields={[
                { name: "name", label: "Full name", required: true },
                { name: "email", label: "Work email", type: "email", required: true },
                { name: "company", label: "Company", required: true },
                { name: "teamSize", label: "Team size" },
                { name: "message", label: "What are you looking to solve?", type: "textarea" },
              ]}
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
