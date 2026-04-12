"use client";

import { useEffect, useRef, useState } from "react";
import { X, Download, Copy, Check, ExternalLink } from "lucide-react";
import QRCode from "qrcode";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  slug: string;
}

export function QrModal({ isOpen, onClose, productName, slug }: QrModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/p/${slug}`;

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, publicUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    });
  }, [isOpen, publicUrl]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `${slug}-qr-code.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease" }}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-[400px] rounded-2xl bg-white dark:bg-[#1e293b] shadow-2xl border border-[#e2e8f0] dark:border-[#334155] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{ animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <div>
              <h3 className="text-lg font-bold text-[#0f172a] dark:text-white">
                QR Code
              </h3>
              <p className="text-[13px] text-[#64748b] dark:text-[#94a3b8] mt-0.5">
                {productName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-[#f1f5f9] dark:hover:bg-[#334155] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* QR Canvas */}
          <div className="px-6 py-6 flex flex-col items-center">
            <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-sm">
              <canvas ref={canvasRef} />
            </div>

            {/* URL Display */}
            <div className="mt-4 w-full px-3 py-2.5 rounded-lg bg-[#f8fafc] dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#334155] flex items-center gap-2">
              <span className="flex-1 text-[12px] font-mono text-[#64748b] dark:text-[#94a3b8] truncate">
                {publicUrl}
              </span>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-[#94a3b8] hover:text-[#0f172a] dark:hover:text-white hover:bg-white dark:hover:bg-[#1e293b] transition-colors"
                title="Copy URL"
              >
                {copied ? (
                  <Check size={14} className="text-emerald-500" />
                ) : (
                  <Copy size={14} />
                )}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 h-[42px] rounded-xl bg-[#0f172a] dark:bg-white text-white dark:text-[#0f172a] font-semibold text-[13px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Download size={15} />
              Download PNG
            </button>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-[42px] px-5 rounded-xl border border-[#e2e8f0] dark:border-[#334155] text-[#0f172a] dark:text-white font-semibold text-[13px] flex items-center justify-center gap-2 hover:bg-[#f8fafc] dark:hover:bg-[#334155] transition-colors"
            >
              <ExternalLink size={15} />
              Visit
            </a>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
