"use client";

// Small QR badge shown in the passport header (see dpp-view.tsx), encoding
// this same page's own canonical URL - same `qrcode` package/toCanvas call
// as the dashboard's qr-modal.tsx. Client-rendered so it can read
// window.location.origin (respects a company's custom domain) instead of
// needing that plumbed through as server data just for this badge.
import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export function PassportQrCode({ gtin }: { gtin: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, `${window.location.origin}/01/${gtin}`, {
      width: 56,
      margin: 0,
      color: { dark: "#0f172a", light: "#ffffff" },
      errorCorrectionLevel: "M",
    });
  }, [gtin]);

  return (
    <div style={{ background: "#fff", borderRadius: 10, padding: 6, flexShrink: 0, lineHeight: 0 }}>
      <canvas ref={canvasRef} width={56} height={56} />
    </div>
  );
}
