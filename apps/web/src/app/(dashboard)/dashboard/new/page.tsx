"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Package, ArrowRight, Sparkles, CheckCircle2, XCircle, Loader2, Image as ImageIcon, Link as LinkIcon, LayoutTemplate, Check, Eye, X } from "lucide-react";
import { createPromptionAction, checkSlugAction, uploadImageAction } from "@/lib/dashboard/actions";
import { SocialPreview } from "@/components/dashboard/social-preview";
import { templates, PreviewRenderer } from "@productix/editor";
import type { Template } from "@productix/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60);
}

export default function NewPromptionPage() {
  const router = useRouter();
  
  // Form State
  const [productName, setProductName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  
  // UI State
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [autoSlug, setAutoSlug] = useState(true);
  
  // Slug Validation State
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);

  // Derive final slug for checking/submission
  const finalSlug = slug.replace(/-+$/g, "");

  // Debounced Slug Check
  useEffect(() => {
    if (!finalSlug) {
      setSlugAvailable(null);
      setCheckingSlug(false);
      return;
    }

    setCheckingSlug(true);
    setSlugAvailable(null);

    const timer = setTimeout(async () => {
      const res = await checkSlugAction(finalSlug);
      if (!res.error) {
        setSlugAvailable(res.available ?? null);
      }
      setCheckingSlug(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [finalSlug]);

  const handleNameChange = (value: string) => {
    setProductName(value);
    if (autoSlug) {
      setSlug(slugify(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setAutoSlug(false);
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+/g, "").substring(0, 60));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setImageUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImageAction(formData);
    
    if (result.error) {
      setImageUploadError(result.error);
    } else if (result.url) {
      setOgImageUrl(result.url);
    }
    
    setUploadingImage(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!productName.trim()) {
      setError("Product name is required");
      return;
    }
    if (!finalSlug) {
      setError("URL slug is required");
      return;
    }
    if (slugAvailable === false) {
      setError("This URL slug is already taken.");
      return;
    }

    startTransition(async () => {
      const result = await createPromptionAction({
        productName: productName.trim(),
        slug: finalSlug,
        description: description.trim(),
        metaDescription: metaDescription.trim() || undefined,
        ogImageUrl: ogImageUrl.trim() || undefined,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      if ("profileId" in result && result.profileId) {
        const editorUrl = selectedTemplate
          ? `/editor?profileId=${result.profileId}&template=${selectedTemplate}`
          : `/editor?profileId=${result.profileId}`;
        router.push(editorUrl);
      }
    });
  };

  // Derive the host domain dynamically if in browser
  const domain = typeof window !== 'undefined' ? window.location.host : 'productix.com';
  const previewUrl = `https://${domain}/p/${finalSlug || 'your-slug'}`;

  return (
    <div className="page-content bg-[var(--ds-bg)] min-h-screen">
      <div className="max-w-6xl mx-auto pt-8 px-4 pb-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7dd3fc] to-[#0284c7] flex items-center justify-center text-white">
              <Sparkles size={20} />
            </div>
            <h1 className="text-2xl font-bold text-[var(--ds-text-primary)]">
              Create New Product
            </h1>
          </div>
          <p className="text-[14px] text-[var(--ds-text-secondary)] ml-[52px]">
            Set up your product details, branding, and link preview before designing the page.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form Column */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Template Selector */}
            <div className="bg-[var(--ds-surface)] border border-[var(--ds-border)] rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <LayoutTemplate size={16} className="text-[var(--ds-text-secondary)]" />
                <h3 className="text-[13px] font-semibold text-[var(--ds-text-primary)]">Choose a Template</h3>
                <span className="text-[11px] text-[var(--ds-text-muted)] font-normal">(optional)</span>
              </div>
              <p className="text-[12px] text-[var(--ds-text-muted)] -mt-2">Start with a pre-designed template or create from scratch.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Blank option */}
                <button
                  type="button"
                  onClick={() => setSelectedTemplate(null)}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center hover:shadow-md ${
                    selectedTemplate === null
                      ? 'border-[#0284c7] bg-sky-50/50 dark:bg-sky-950/20 shadow-md'
                      : 'border-[var(--ds-border)] hover:border-gray-300'
                  }`}
                >
                  {selectedTemplate === null && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#0284c7] flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg">📄</div>
                  <span className="text-[12px] font-semibold text-[var(--ds-text-primary)]">Blank</span>
                  <span className="text-[10px] text-[var(--ds-text-muted)]">Start fresh</span>
                </button>

                {/* Template options */}
                {templates.map((t) => (
                  <div key={t.meta.id} className="relative group">
                    <button
                      type="button"
                      onClick={() => setSelectedTemplate(t.meta.id)}
                      className={`relative w-full flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center hover:shadow-md ${
                        selectedTemplate === t.meta.id
                          ? 'border-[#0284c7] bg-sky-50/50 dark:bg-sky-950/20 shadow-md'
                          : 'border-[var(--ds-border)] hover:border-gray-300'
                      }`}
                    >
                      {selectedTemplate === t.meta.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#0284c7] flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900 dark:to-blue-900 flex items-center justify-center text-lg">
                        {t.meta.category === 'marketing' ? '🥤' : t.meta.category === 'social' ? '📱' : t.meta.category === 'event' ? '🎉' : '✨'}
                      </div>
                      <span className="text-[12px] font-semibold text-[var(--ds-text-primary)] leading-tight">{t.meta.name}</span>
                      <span className="text-[10px] text-[var(--ds-text-muted)] line-clamp-2 leading-tight">{t.meta.category}</span>
                    </button>
                    {/* Preview eye button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplate(t);
                      }}
                      className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-black/60 dark:bg-white/15 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/80 dark:hover:bg-white/25 hover:scale-110 z-10"
                      title={`Preview ${t.meta.name}`}
                    >
                      <Eye size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ═══ Template Preview Modal ═══ */}
            {previewTemplate && (
              <div
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
                onClick={() => setPreviewTemplate(null)}
              >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md" style={{ animation: 'fadeIn 0.2s ease' }} />

                {/* Modal content */}
                <div
                  className="relative z-10 flex flex-col items-center gap-5 max-h-[95vh] w-full max-w-[520px]"
                  onClick={(e) => e.stopPropagation()}
                  style={{ animation: 'slideUp 0.25s ease' }}
                >
                  {/* Header bar */}
                  <div className="w-full flex items-center justify-between px-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-sm">
                        {previewTemplate.meta.category === 'marketing' ? '🥤' : previewTemplate.meta.category === 'social' ? '📱' : '✨'}
                      </div>
                      <div>
                        <h3 className="text-white text-sm font-bold">{previewTemplate.meta.name}</h3>
                        <p className="text-gray-400 text-[11px]">{previewTemplate.meta.description}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(null)}
                      className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Phone frame with preview */}
                  <div className="flex-1 overflow-y-auto w-full rounded-[2rem] no-scrollbar" style={{ maxHeight: 'calc(95vh - 140px)' }}>
                    <div
                      className="rounded-[2rem] overflow-hidden mx-auto"
                      style={{
                        maxWidth: 428,
                        boxShadow: '0 0 0 2px rgba(255,255,255,0.08), 0 25px 100px rgba(0,0,0,0.5)',
                      }}
                    >
                      {/* Status bar */}
                      <div className="bg-black flex items-center justify-between px-6 py-2 text-white text-[10px] font-semibold">
                        <span>9:41</span>
                        <div className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3C7.8 3 4.1 5 2 8l2.2 2.2C5.8 8.2 8.7 7 12 7s6.2 1.2 7.8 3.2L22 8c-2.1-3-5.8-5-10-5zm0 4c-3 0-5.7 1.3-7.5 3.5L6.7 12.7C7.9 11.4 9.8 10.5 12 10.5s4.1.9 5.3 2.2l2.2-2.2C17.7 8.3 15 7 12 7zm0 4c-1.9 0-3.6.8-4.8 2.1l2.2 2.2c.7-.7 1.6-1.1 2.6-1.1s1.9.4 2.6 1.1l2.2-2.2C15.6 11.8 13.9 11 12 11zm0 4c-.8 0-1.5.3-2 .9L12 18l2-2.1c-.5-.6-1.2-.9-2-.9z" />
                          </svg>
                          <svg className="w-5 h-3" fill="currentColor" viewBox="0 0 28 14">
                            <rect x="0.5" y="0.5" width="23" height="13" rx="2" stroke="currentColor" fill="none" strokeOpacity="0.35" />
                            <rect x="24.5" y="4" width="2.5" height="6" rx="1" fillOpacity="0.4" />
                            <rect x="2" y="2" width="19" height="10" rx="1" />
                          </svg>
                        </div>
                      </div>

                      {/* Rendered template */}
                      <PreviewRenderer document={previewTemplate.data} contentLocale="en" />

                      {/* Home indicator */}
                      <div className="bg-black flex justify-center py-2">
                        <div className="w-32 h-1 bg-white/30 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="w-full flex gap-3 px-1">
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(null)}
                      className="flex-1 h-11 rounded-xl border border-white/15 text-gray-300 text-sm font-medium hover:bg-white/5 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTemplate(previewTemplate.meta.id);
                        setPreviewTemplate(null);
                      }}
                      className="flex-[2] h-11 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-sky-500/25"
                    >
                      <Check size={16} />
                      Use This Template
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-[var(--ds-surface)] border border-[var(--ds-border)] rounded-2xl p-8 space-y-6 flex flex-col shadow-sm">
              
              {/* Product Name */}
              <div>
                <label className="block text-[13px] font-semibold text-[var(--ds-text-primary)] mb-2">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Package
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ds-text-muted)]"
                  />
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Super Widget Pro"
                    className="w-full h-[44px] pl-10 pr-4 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-bg)] text-[14px] text-[var(--ds-text-primary)] placeholder-[var(--ds-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all"
                    autoFocus
                  />
                </div>
              </div>

              {/* URL Slug with Availability Check */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[13px] font-semibold text-[var(--ds-text-primary)]">
                    URL Slug <span className="text-red-400">*</span>
                  </label>
                  {finalSlug && (
                    <div className="text-[12px] flex items-center gap-1.5">
                      {checkingSlug ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-gray-400" />
                          <span className="text-gray-500">Checking availability...</span>
                        </>
                      ) : slugAvailable === true ? (
                        <>
                          <CheckCircle2 size={14} className="text-green-500" />
                          <span className="text-green-600 dark:text-green-400">Available</span>
                        </>
                      ) : slugAvailable === false ? (
                        <>
                          <XCircle size={14} className="text-red-500" />
                          <span className="text-red-600 dark:text-red-400">Unavailable</span>
                        </>
                      ) : null}
                    </div>
                  )}
                </div>
                <div className={`flex items-center gap-0 rounded-xl border overflow-hidden bg-[var(--ds-bg)] transition-all ${
                  slugAvailable === false 
                    ? 'border-red-400 focus-within:ring-2 focus-within:ring-red-400/20' 
                    : slugAvailable === true 
                      ? 'border-green-400 focus-within:ring-2 focus-within:ring-green-400/20'
                      : 'border-[var(--ds-border)] focus-within:ring-2 focus-within:ring-[#0284c7]/20 focus-within:border-[#0284c7]'
                }`}>
                  <span className="px-3.5 h-[44px] flex items-center text-[13px] text-[var(--ds-text-muted)] bg-[var(--ds-surface)] border-r border-inherit whitespace-nowrap font-mono">
                    /p/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="super-widget-pro"
                    className="flex-1 h-[44px] px-3 text-[14px] text-[var(--ds-text-primary)] placeholder-[var(--ds-text-muted)] focus:outline-none font-mono bg-transparent"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-[var(--ds-text-muted)]">
                  Must be unique. Allowed characters: letters, numbers, and hyphens.
                </p>
              </div>

              <div className="w-full h-[1px] bg-[var(--ds-border)] my-2" />

              {/* internal Description */}
              <div>
                <label className="block text-[13px] font-semibold text-[var(--ds-text-primary)] mb-2">
                  Internal Description <span className="text-[var(--ds-text-muted)] font-normal">(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Notes for your team..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-bg)] text-[14px] text-[var(--ds-text-primary)] placeholder-[var(--ds-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all resize-none"
                />
              </div>

              {/* OG Meta Description */}
              <div>
                <label className="block text-[13px] font-semibold text-[var(--ds-text-primary)] mb-2">
                  Social Sharing Description <span className="text-[var(--ds-text-muted)] font-normal">(optional)</span>
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="This appears when your link is shared on Facebook, WhatsApp, etc."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-bg)] text-[14px] text-[var(--ds-text-primary)] placeholder-[var(--ds-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all resize-none"
                />
              </div>

              {/* OG Image URL */}
              <div>
                <label className="block text-[13px] font-semibold text-[var(--ds-text-primary)] mb-2">
                  Social Sharing Image <span className="text-[var(--ds-text-muted)] font-normal">(optional)</span>
                </label>
                
                <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                  {/* File Upload Button */}
                  <label className="flex-shrink-0 cursor-pointer h-[44px] px-4 rounded-xl border border-[var(--ds-border)] hover:bg-[var(--ds-bg-hover)] flex items-center justify-center transition-all bg-[var(--ds-bg)] text-[14px] text-[var(--ds-text-primary)] font-medium">
                    {uploadingImage ? (
                      <Loader2 size={16} className="text-[var(--ds-text-secondary)] animate-spin" />
                    ) : (
                      "Upload Local"
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                    />
                  </label>

                  <div className="hidden sm:flex items-center text-[var(--ds-text-muted)] text-[13px]">or</div>

                  <div className="relative flex-1 min-w-[200px]">
                    <ImageIcon
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ds-text-muted)]"
                    />
                    <input
                      type="text"
                      value={ogImageUrl}
                      onChange={(e) => setOgImageUrl(e.target.value)}
                      placeholder="Paste image URL..."
                      className="w-full h-[44px] pl-10 pr-4 rounded-xl border border-[var(--ds-border)] bg-[var(--ds-bg)] text-[14px] text-[var(--ds-text-primary)] placeholder-[var(--ds-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all"
                    />
                  </div>
                </div>
                {imageUploadError && (
                  <p className="mt-1.5 text-[12px] text-red-500">{imageUploadError}</p>
                )}
                <p className="mt-1.5 text-[11px] text-[var(--ds-text-muted)]">
                  For best results, upload or link an image that is 1200x630 pixels.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-4 py-3 text-[13px] text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending || !productName.trim() || !finalSlug || slugAvailable === false || checkingSlug}
                className="w-full h-[48px] bg-[#bae6fd] hover:bg-[#7dd3fc] text-[#0284c7] font-semibold text-[14px] rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/15 hover:shadow-sky-500/25 mt-4"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    Continue to Editor
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

            </div>
          </form>

          {/* Preview Column */}
          <div className="sticky top-8 flex flex-col gap-4 hidden lg:flex">
             <div className="flex items-center gap-2 px-1">
               <LinkIcon size={16} className="text-[var(--ds-text-secondary)]" />
               <h2 className="text-[14px] font-semibold text-[var(--ds-text-secondary)] uppercase tracking-wider">
                 Live Link Preview
               </h2>
             </div>
             <SocialPreview 
               title={productName}
               description={metaDescription}
               image={ogImageUrl}
               url={previewUrl}
               domain={domain}
             />
          </div>

        </div>
      </div>
    </div>
  );
}
