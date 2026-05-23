// QR "Social" source - scans of /s/<code> resolve to the same showcase page
// as /p/<code> but are tagged as SOCIAL in analytics so dashboards can split
// out social-share QR generation surfaces.
import { renderPublicPage } from "../../p/[slug]/page";

export { generateMetadata, generateViewport } from "../../p/[slug]/page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicPageSocial({ params }: PageProps) {
  const { slug: handle } = await params;
  return renderPublicPage(handle, "SOCIAL", "s");
}
