"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  ArrowRight,
  Sparkles,
  Loader2,
  Layers,
  Tag,
  Building2,
  FileCheck2,
} from "lucide-react";
import {
  createPromptionAction,
  getCategoriesAction,
  getSubCategoriesAction,
  getBrandProfilesAction,
  createCategoryAction,
  createSubCategoryAction,
  createBrandProfileAction,
} from "@/lib/dashboard/actions";
import { ComboBox, type ComboBoxOption } from "@/components/dashboard/combo-box";
import { GtinField, GTIN_POLICY_OK, type GtinCheckState } from "@/components/dashboard/gtin-field";
import { useSettings } from "@/hooks/use-settings";

type Destination = "editor" | "dpp";

export default function NewPromptionPage() {
  const router = useRouter();
  const { settings } = useSettings();
  const requireValidGtin = settings?.requireValidGtin ?? false;

  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<string | null>(null);
  const [brandProfileId, setBrandProfileId] = useState<string | null>(null);

  const [gtin, setGtin] = useState("");
  const [gtinCheck, setGtinCheck] = useState<GtinCheckState>({ status: "idle" });

  const [categories, setCategories] = useState<ComboBoxOption[]>([]);
  const [subCategories, setSubCategories] = useState<ComboBoxOption[]>([]);
  const [brands, setBrands] = useState<ComboBoxOption[]>([]);

  const [loadingLookups, setLoadingLookups] = useState(true);
  const [loadingSubs, setLoadingSubs] = useState(false);

  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    (async () => {
      setLoadingLookups(true);
      const [catRes, brandRes] = await Promise.all([
        getCategoriesAction(),
        getBrandProfilesAction(),
      ]);
      if (!active) return;
      if ("items" in catRes && catRes.items) {
        setCategories(catRes.items.map((c) => ({ id: c.id, label: c.name })));
      }
      if ("items" in brandRes && brandRes.items) {
        setBrands(brandRes.items.map((b) => ({ id: b.id, label: b.brandName })));
      }
      setLoadingLookups(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setSubCategoryId(null);
    setSubCategories([]);
    if (!categoryId) return;
    let active = true;
    (async () => {
      setLoadingSubs(true);
      const res = await getSubCategoriesAction(categoryId);
      if (!active) return;
      if ("items" in res && res.items) {
        setSubCategories(res.items.map((s) => ({ id: s.id, label: s.name })));
      }
      setLoadingSubs(false);
    })();
    return () => {
      active = false;
    };
  }, [categoryId]);

  const handleCreateCategory = async (name: string): Promise<ComboBoxOption | null> => {
    const res = await createCategoryAction(name);
    if ("item" in res && res.item) {
      const opt = { id: res.item.id, label: res.item.name };
      setCategories((prev) => (prev.some((p) => p.id === opt.id) ? prev : [...prev, opt].sort((a, b) => a.label.localeCompare(b.label))));
      return opt;
    }
    return null;
  };

  const handleCreateSubCategory = async (name: string): Promise<ComboBoxOption | null> => {
    if (!categoryId) return null;
    const res = await createSubCategoryAction(categoryId, name);
    if ("item" in res && res.item) {
      const opt = { id: res.item.id, label: res.item.name };
      setSubCategories((prev) => (prev.some((p) => p.id === opt.id) ? prev : [...prev, opt].sort((a, b) => a.label.localeCompare(b.label))));
      return opt;
    }
    return null;
  };

  const handleCreateBrand = async (name: string): Promise<ComboBoxOption | null> => {
    const res = await createBrandProfileAction(name);
    if ("item" in res && res.item) {
      const opt = { id: res.item.id, label: res.item.brandName };
      setBrands((prev) => (prev.some((p) => p.id === opt.id) ? prev : [...prev, opt].sort((a, b) => a.label.localeCompare(b.label))));
      return opt;
    }
    return null;
  };

  const gtinSatisfiesPolicy = GTIN_POLICY_OK.includes(gtinCheck.status);
  const canSubmit =
    !!productName.trim() &&
    gtinCheck.status !== "checking" &&
    (!requireValidGtin || gtinSatisfiesPolicy);

  const createProduct = (destination: Destination) => {
    setError("");

    if (!productName.trim()) {
      setError("Product name is required");
      return;
    }
    if (requireValidGtin && !gtinSatisfiesPolicy) {
      setError("This company requires a valid GTIN before creating a product.");
      return;
    }

    startTransition(async () => {
      const slug = crypto.randomUUID();

      const result = await createPromptionAction({
        productName: productName.trim(),
        slug,
        categoryId,
        subCategoryId,
        brandProfileId,
        gtin: gtin.trim() || undefined,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      if (destination === "dpp" && "productId" in result && result.productId) {
        router.push(`/dashboard/products/${result.productId}/dpp`);
        return;
      }

      if ("profileId" in result && result.profileId) {
        router.push(`/editor?profileId=${result.profileId}`);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct("editor");
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

            {/* GTIN */}
            <GtinField
              value={gtin}
              onChange={setGtin}
              checkState={gtinCheck}
              onCheckStateChange={setGtinCheck}
              required={requireValidGtin}
            />

            {/* Category */}
            <div>
              <label className="block text-[13px] font-semibold text-(--ds-text-primary) mb-2">
                Category
              </label>
              <ComboBox
                options={categories}
                value={categoryId}
                onChange={setCategoryId}
                onCreate={handleCreateCategory}
                loading={loadingLookups}
                placeholder="Select a category"
                emptyHint="No categories yet - type to add one"
                icon={<Layers size={16} />}
              />
            </div>

            {/* Sub Category */}
            <div>
              <label className="block text-[13px] font-semibold text-(--ds-text-primary) mb-2">
                Sub Category
              </label>
              <ComboBox
                options={subCategories}
                value={subCategoryId}
                onChange={setSubCategoryId}
                onCreate={categoryId ? handleCreateSubCategory : undefined}
                loading={loadingSubs}
                disabled={!categoryId}
                placeholder={categoryId ? "Select a sub-category" : "Pick a category first"}
                emptyHint="No sub-categories yet - type to add one"
                icon={<Tag size={16} />}
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-[13px] font-semibold text-(--ds-text-primary) mb-2">
                Brand
              </label>
              <ComboBox
                options={brands}
                value={brandProfileId}
                onChange={setBrandProfileId}
                onCreate={handleCreateBrand}
                loading={loadingLookups}
                placeholder="Select a brand"
                emptyHint="No brands yet - type to add one"
                icon={<Building2 size={16} />}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-4 py-3 text-[13px] text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isPending || !canSubmit}
                className="flex-1 h-[48px] bg-[#bae6fd] hover:bg-[#7dd3fc] text-[#0284c7] font-semibold text-[14px] rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/15 hover:shadow-sky-500/25"
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
              <button
                type="button"
                onClick={() => createProduct("dpp")}
                disabled={isPending || !canSubmit}
                className="flex-1 h-[48px] bg-(--ds-surface) hover:bg-(--ds-bg) border border-(--ds-border) text-(--ds-text-primary) font-semibold text-[14px] rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <FileCheck2 size={16} />
                    Continue to DPP
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
