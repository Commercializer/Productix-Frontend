"use client";

import { useState } from "react";
import { Facebook, Linkedin, MessageCircle, Instagram, Globe } from "lucide-react";

type Platform = "facebook" | "linkedin" | "whatsapp" | "instagram";

interface SocialPreviewProps {
  title: string;
  description: string;
  image: string;
  url: string;
  domain: string;
}

export function SocialPreview({ title, description, image, url, domain }: SocialPreviewProps) {
  const [platform, setPlatform] = useState<Platform>("facebook");

  const displayTitle = title || "Your Page Title";
  const displayDescription = description || "Your page description will appear here...";
  const displayImage = image || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

  return (
    <div className="bg-[var(--ds-surface)] border border-[var(--ds-border)] rounded-2xl overflow-hidden flex flex-col">
      {/* Header Tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-[var(--ds-border)] bg-[var(--ds-bg)]">
        <button
          type="button"
          onClick={() => setPlatform("facebook")}
          className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            platform === "facebook"
              ? "bg-[#1877F2]/10 text-[#1877F2]"
              : "text-[var(--ds-text-secondary)] hover:bg-[var(--ds-bg-hover)]"
          }`}
        >
          <Facebook size={14} />
          Facebook
        </button>
        <button
          type="button"
          onClick={() => setPlatform("linkedin")}
          className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            platform === "linkedin"
              ? "bg-[#0A66C2]/10 text-[#0A66C2]"
              : "text-[var(--ds-text-secondary)] hover:bg-[var(--ds-bg-hover)]"
          }`}
        >
          <Linkedin size={14} />
          LinkedIn
        </button>
        <button
          type="button"
          onClick={() => setPlatform("whatsapp")}
          className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            platform === "whatsapp"
              ? "bg-[#25D366]/10 text-[#25D366]"
              : "text-[var(--ds-text-secondary)] hover:bg-[var(--ds-bg-hover)]"
          }`}
        >
          <MessageCircle size={14} />
          WhatsApp
        </button>
        <button
          type="button"
          onClick={() => setPlatform("instagram")}
          className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            platform === "instagram"
              ? "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white"
              : "text-[var(--ds-text-secondary)] hover:bg-[var(--ds-bg-hover)]"
          }`}
        >
          <Instagram size={14} />
          Instagram DM
        </button>
      </div>

      {/* Preview Area */}
      <div className="bg-[#f0f2f5] dark:bg-[#18191a] p-4 flex-1 flex items-center justify-center min-h-[360px]">
        
        {/* Facebook Preview */}
        {platform === "facebook" && (
          <div className="w-full max-w-[500px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-[#242526] shadow-sm">
            <div className="relative aspect-[1.91/1] w-full bg-gray-200 dark:bg-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={displayImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <p className="text-[12px] uppercase text-gray-500 dark:text-[#b0b3b8] truncate mb-1">
                {domain}
              </p>
              <h3 className="font-semibold text-[16px] text-[#1c1e21] dark:text-[#e4e6eb] leading-tight mb-1 line-clamp-1">
                {displayTitle}
              </h3>
              <p className="text-[14px] text-[#606770] dark:text-[#b0b3b8] leading-snug line-clamp-1">
                {displayDescription}
              </p>
            </div>
          </div>
        )}

        {/* LinkedIn Preview */}
        {platform === "linkedin" && (
          <div className="w-full max-w-[520px] bg-white dark:bg-[#1d2226] border border-gray-200 dark:border-gray-700 shadow-sm rounded-sm overflow-hidden">
            <div className="relative aspect-[1.91/1] w-full bg-gray-200 dark:bg-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={displayImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="p-3 pb-4">
              <h3 className="font-semibold text-[16px] text-gray-900 dark:text-gray-100 leading-tight mb-0.5 line-clamp-2">
                {displayTitle}
              </h3>
              <p className="text-[12px] text-gray-500 dark:text-gray-400 truncate">
                {domain}
              </p>
            </div>
          </div>
        )}

        {/* WhatsApp Preview */}
        {platform === "whatsapp" && (
          <div className="w-full max-w-[400px]">
             <div className="bg-[#E1F6CB] dark:bg-[#005C4B] p-1.5 rounded-lg rounded-tr-none shadow-sm relative ml-auto w-fit max-w-full">
               <div className="absolute top-0 right-[-8px] w-0 h-0 border-t-[8px] border-t-[#E1F6CB] dark:border-t-[#005C4B] border-r-[8px] border-r-transparent"></div>
               <div className="bg-[#cfecd6] dark:bg-[#025143] rounded overflow-hidden flex flex-col max-w-[300px]">
                 <div className="relative aspect-[1.91/1] w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={displayImage} alt="Preview" className="w-full h-full object-cover" />
                 </div>
                 <div className="p-2 border-l-4 border-[#25D366]">
                    <h3 className="font-semibold text-[14px] text-gray-900 dark:text-gray-100 leading-tight line-clamp-1 mb-1">
                      {displayTitle}
                    </h3>
                    <p className="text-[13px] text-gray-600 dark:text-gray-300 leading-snug line-clamp-2 mb-1">
                      {displayDescription}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                      {domain}
                    </p>
                 </div>
               </div>
               <a href={url} className="text-[#027EB5] dark:text-[#53bdeb] text-[15px] underline mt-1 block px-1 truncate max-w-[300px] hover:text-[#027EB5]/80">
                 {url}
               </a>
             </div>
          </div>
        )}

        {/* Instagram DM Preview */}
        {platform === "instagram" && (
          <div className="w-full max-w-[300px]">
            <div className="bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="relative aspect-square w-full bg-gray-200 dark:bg-gray-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={displayImage} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-1 rounded-full flex items-center gap-1.5">
                    <Globe size={10} />
                    {domain}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-[#1a1a1a]">
                  <h3 className="font-semibold text-[15px] text-gray-900 dark:text-gray-100 leading-tight line-clamp-1">
                    {displayTitle}
                  </h3>
                  {description && (
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                      {displayDescription}
                    </p>
                  )}
                </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
