"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, ArrowRight, Sparkles, CheckCircle2, XCircle, Loader2, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { createPromptionAction, checkSlugAction, uploadImageAction } from "@/lib/dashboard/actions";
import { SocialPreview } from "@/components/dashboard/social-preview";

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
        router.push(`/editor?profileId=${result.profileId}`);
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
