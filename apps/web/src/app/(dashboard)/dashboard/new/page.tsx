"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Package, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { createPromptionAction } from "@/lib/dashboard/actions";

export default function NewPromptionPage() {
  const router = useRouter();

  const [productName, setProductName] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!productName.trim()) {
      setError("Product name is required");
      return;
    }

    startTransition(async () => {
      const slug = crypto.randomUUID();

      const result = await createPromptionAction({
        productName: productName.trim(),
        slug,
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

  return (
    <div className="page-content bg-(--ds-bg) min-h-screen">
      <div className="max-w-xl mx-auto pt-16 px-4 pb-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#7dd3fc] to-[#0284c7] flex items-center justify-center text-white">
              <Sparkles size={20} />
            </div>
            <h1 className="text-2xl font-bold text-(--ds-text-primary)">
              Create New Product
            </h1>
          </div>
          <p className="text-[14px] text-(--ds-text-secondary) ml-[52px]">
            Give your product a name to get started. You can edit everything else in the editor.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-(--ds-surface) border border-(--ds-border) rounded-2xl p-8 space-y-6 flex flex-col shadow-xs">
            {/* Product Name */}
            <div>
              <label className="block text-[13px] font-semibold text-(--ds-text-primary) mb-2">
                Product Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Package
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--ds-text-muted)"
                />
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Super Widget Pro"
                  className="w-full h-[44px] pl-10 pr-4 rounded-xl border border-(--ds-border) bg-(--ds-bg) text-[14px] text-(--ds-text-primary) placeholder-(--ds-text-muted) focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-all"
                  autoFocus
                />
              </div>
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
              disabled={isPending || !productName.trim()}
              className="w-full h-[48px] bg-[#bae6fd] hover:bg-[#7dd3fc] text-[#0284c7] font-semibold text-[14px] rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/15 hover:shadow-sky-500/25"
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
      </div>
    </div>
  );
}
