// QR "Link" source — scans of /l/<code> resolve to the same showcase page as
// /p/<code>. The distinct prefix lets us differentiate QR generation surfaces
// (link-style QRs) at the URL level for analytics or A/B testing later.
export { default, generateMetadata, generateViewport } from "../../p/[slug]/page";
