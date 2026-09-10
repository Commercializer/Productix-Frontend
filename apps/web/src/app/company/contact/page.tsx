import { Mail, Phone } from "lucide-react";
import type { Metadata } from "next";

import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { LeadForm } from "@/components/landing/lead-form";

const CONTACT_EMAIL = "sales@commercializer.global";
const CONTACT_PHONE_DISPLAY = "+94 77 465 3543";
const CONTACT_PHONE_HREF = "+94774653543";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Productix team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />
      <section className="bg-cream px-6 pb-24 pt-40 md:pt-48">
        <div className="mx-auto max-w-lg">
          <div className="text-center">
            <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-accent-dim">
              Company
            </span>
            <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
              Contact Us
            </h1>
            <p className="mx-auto mt-5 max-w-md text-[15.5px] leading-[1.7] text-ink/60">
              Tell us about your products, packaging or compliance
              requirements and a member of our team will be in touch.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-ink/10 bg-white p-8">
            <LeadForm
              submitLabel="Send message"
              successMessage="Thanks, we'll be in touch shortly."
              fields={[
                { name: "name", label: "Full name", required: true },
                { name: "email", label: "Work email", type: "email", required: true },
                { name: "company", label: "Company" },
                { name: "message", label: "Message", type: "textarea", required: true, placeholder: "How can we help?" },
              ]}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group flex items-center justify-center gap-2.5 rounded-full border border-ink/10 bg-white px-5 py-3 text-[13.5px] font-medium text-ink/70 transition-colors hover:border-ink/20 hover:text-ink"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
                <Mail className="h-4 w-4" />
              </span>
              {CONTACT_EMAIL}
            </a>
            <a
              href={`tel:${CONTACT_PHONE_HREF}`}
              className="group flex items-center justify-center gap-2.5 rounded-full border border-ink/10 bg-white px-5 py-3 text-[13.5px] font-medium text-ink/70 transition-colors hover:border-ink/20 hover:text-ink"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
                <Phone className="h-4 w-4" />
              </span>
              {CONTACT_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
