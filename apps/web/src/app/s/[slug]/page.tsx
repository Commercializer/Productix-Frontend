// QR "Social" source — scans of /s/<code> resolve to the same showcase page
// as /p/<code>. The distinct prefix lets us differentiate QR generation
// surfaces (social-share QRs) at the URL level for analytics or A/B testing.
export { default, generateMetadata, generateViewport } from "../../p/[slug]/page";
