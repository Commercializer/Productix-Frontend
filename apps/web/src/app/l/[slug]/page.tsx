// QR "Link" source - scans of /l/<code> resolve to the same showcase page as
// /p/<code> but are tagged as LINK in analytics so dashboards can split out
// link-style QR generation surfaces.
import { renderPublicPage } from "../../p/[slug]/page";

export { generateMetadata, generateViewport } from "../../p/[slug]/page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicPageLink({ params }: PageProps) {
  const { slug: handle } = await params;
  return renderPublicPage(handle, "LINK", "l");
}
