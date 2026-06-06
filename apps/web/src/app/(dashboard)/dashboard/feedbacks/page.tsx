"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Mail, Phone, Package as PackageIcon, Calendar, Tag, Filter, Image as ImageIcon, ExternalLink, Download, MapPin, Layers, ListChecks } from "lucide-react";
import { useMessages, type Message } from "@/hooks/use-messages";
import { DashboardHeader } from "@/components/dashboard/header";

const URL_RE = /(https?:\/\/[^\s<>"')]+)/g;
const IMAGE_URL_RE = /\.(jpe?g|png|gif|webp|svg)(\?.*)?$/i;

function isImageUrl(url: string): boolean {
  if (IMAGE_URL_RE.test(url)) return true;
  // Anything uploaded via the public feedback upload route lives here.
  return /\/feedback-uploads\//i.test(url);
}

interface ParsedDescription {
  text: string;
  images: string[];
  links: string[];
}

function parseDescription(description: string): ParsedDescription {
  const images: string[] = [];
  const links: string[] = [];
  // Strip image URLs (and any "Label: " prefix on the same line they occupy) from the visible text,
  // but keep non-image URLs inline so they remain in context.
  const lines = description.split("\n");
  const cleaned: string[] = [];
  for (const line of lines) {
    const urls = line.match(URL_RE) ?? [];
    const imageUrlsOnLine = urls.filter(isImageUrl);
    if (imageUrlsOnLine.length > 0) {
      for (const u of imageUrlsOnLine) if (!images.includes(u)) images.push(u);
      // Drop the whole line if it's just "Label: <imageUrl>" with nothing else.
      let remaining = line;
      for (const u of imageUrlsOnLine) remaining = remaining.split(u).join("").trim();
      const stripped = remaining.replace(/^[^:]+:\s*$/, "").trim();
      if (stripped.length > 0) cleaned.push(stripped);
    } else {
      cleaned.push(line);
      for (const u of urls) if (!isImageUrl(u) && !links.includes(u)) links.push(u);
    }
  }
  return { text: cleaned.join("\n").replace(/\n{3,}/g, "\n\n").trim(), images, links };
}

function slugForFilename(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 60);
}

function formatDateForFilename(iso: string): string {
  // YYYY-MM-DD in the viewer's local timezone - matches what the table shows.
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "unknown-date";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildAttachmentFilename(
  productName: string,
  customerName: string,
  phone: string | null,
  createdAt: string,
  url: string,
  index: number,
  total: number,
): string {
  const product = slugForFilename(productName || "product") || "product";
  const customer = slugForFilename(customerName || "");
  // Phones often contain spaces, parens, dashes - keep just the digits (plus a leading +)
  // so the filename is compact and consistent.
  const phoneDigits = phone ? phone.replace(/[^\d+]/g, "").replace(/^\+/, "p").slice(0, 20) : "";
  const date = formatDateForFilename(createdAt);
  const extMatch = url.match(/\.([a-zA-Z0-9]{1,5})(?:\?.*)?$/);
  const ext = (extMatch?.[1] ?? "jpg").toLowerCase();
  const suffix = total > 1 ? `-${index + 1}` : "";
  const parts = [product, customer, phoneDigits, date].filter((p) => p.length > 0);
  return `${parts.join("-")}${suffix}.${ext}`;
}

function downloadHref(url: string, filename: string): string {
  const params = new URLSearchParams({ url, filename });
  return `/api/feedback/download?${params.toString()}`;
}

async function triggerDownload(url: string, filename: string) {
  // The proxy sets Content-Disposition: attachment, so navigating to it in the
  // current tab would still download cleanly - but using a temporary <a download>
  // keeps the dashboard tab in place and gives the browser the filename hint up front.
  const a = document.createElement("a");
  a.href = downloadHref(url, filename);
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function renderTextWithLinks(text: string): React.ReactNode[] {
  if (!text) return [];
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  const re = new RegExp(URL_RE.source, "g");
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) nodes.push(text.slice(lastIndex, m.index));
    nodes.push(
      <a
        key={`l-${key++}`}
        href={m[1]}
        target="_blank"
        rel="noreferrer"
        className="text-primary underline decoration-primary/30 hover:decoration-primary break-all"
      >
        {m[1]}
      </a>
    );
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

type TypeFilter = "ALL" | "FEEDBACK" | "INQUIRY";
type DateFilter = "ALL" | "TODAY" | "7D" | "30D" | "CUSTOM";

const EMOJI_SCALE = ["😠", "🙁", "😐", "🙂", "😄"];

/** Render a feedback answer's value in a type-appropriate way. */
function AnswerValue({ answer }: { answer: import("@/hooks/use-messages").FeedbackAnswer }) {
  const { fieldType, valueNumber, valueText, valueOptions } = answer;

  if (fieldType === "star" && valueNumber != null) {
    return (
      <span className="inline-flex items-center gap-0.5 text-amber-500">
        {"★".repeat(Math.round(valueNumber))}
        <span className="text-(--ds-text-secondary) text-[12px] ml-1">{valueNumber}</span>
      </span>
    );
  }
  if (fieldType === "emoji" && valueNumber != null) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="text-[18px] leading-none">{EMOJI_SCALE[Math.min(4, Math.max(0, Math.round(valueNumber) - 1))]}</span>
        <span className="text-(--ds-text-secondary) text-[12px]">{valueNumber}/5</span>
      </span>
    );
  }
  if (fieldType === "nps" && valueNumber != null) {
    return <span className="font-semibold text-(--ds-text-primary)">{valueNumber}<span className="text-(--ds-text-secondary) text-[12px] font-normal">/10</span></span>;
  }
  if ((fieldType === "slider" || fieldType === "number") && valueNumber != null) {
    return <span className="font-semibold text-(--ds-text-primary)">{valueNumber}</span>;
  }
  if ((fieldType === "select" || fieldType === "multiselect") && valueOptions.length > 0) {
    return (
      <span className="inline-flex flex-wrap gap-1">
        {valueOptions.map((v, i) => (
          <span key={i} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
            {v}
          </span>
        ))}
      </span>
    );
  }
  return <span className="text-(--ds-text-primary)">{valueText || "-"}</span>;
}

/** Compact star summary for an average rating (1-5). */
function RatingSummary({ value }: { value: number }) {
  const rounded = Math.round(value * 10) / 10;
  return (
    <span className="inline-flex items-center gap-1 text-amber-500" title={`${rounded} average rating`}>
      <span className="text-[14px]">★</span>
      <span className="font-semibold">{rounded}</span>
    </span>
  );
}

export default function MessagesPage() {
  const { messages, loading } = useMessages();
  const [selected, setSelected] = useState<Message | null>(null);
  const [productFilter, setProductFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [dateFilter, setDateFilter] = useState<DateFilter>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [branchFilter, setBranchFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  // Custom-selection filter: pick a select/multi-select field, then a value.
  const [customField, setCustomField] = useState<string>("ALL");
  const [customValue, setCustomValue] = useState<string>("ALL");

  const productOptions = useMemo(() => {
    const set = new Set<string>();
    messages.forEach((m) => {
      if (m.productName) set.add(m.productName);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [messages]);

  const branchOptions = useMemo(() => {
    const set = new Set<string>();
    messages.forEach((m) => m.branchName && set.add(m.branchName));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [messages]);

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    messages.forEach((m) => m.categoryName && set.add(m.categoryName));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [messages]);

  // Map each select/multi-select field label to the set of values seen across
  // all feedback, powering the two-step "custom selection" filter.
  const customSelections = useMemo(() => {
    const map = new Map<string, Set<string>>();
    messages.forEach((m) =>
      m.answers.forEach((a) => {
        if ((a.fieldType === "select" || a.fieldType === "multiselect") && a.valueOptions.length > 0) {
          if (!map.has(a.label)) map.set(a.label, new Set());
          a.valueOptions.forEach((v) => map.get(a.label)!.add(v));
        }
      }),
    );
    return map;
  }, [messages]);

  const customValueOptions = useMemo(() => {
    if (customField === "ALL") return [];
    return Array.from(customSelections.get(customField) ?? []).sort((a, b) => a.localeCompare(b));
  }, [customField, customSelections]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    return messages.filter((m) => {
      if (productFilter !== "ALL" && m.productName !== productFilter) return false;
      if (typeFilter !== "ALL" && m.type !== typeFilter) return false;
      if (branchFilter !== "ALL" && m.branchName !== branchFilter) return false;
      if (categoryFilter !== "ALL" && m.categoryName !== categoryFilter) return false;
      if (customField !== "ALL") {
        const matches = m.answers.filter((a) => a.label === customField && a.valueOptions.length > 0);
        if (matches.length === 0) return false;
        if (customValue !== "ALL" && !matches.some((a) => a.valueOptions.includes(customValue))) return false;
      }
      if (dateFilter !== "ALL") {
        const created = new Date(m.createdAt).getTime();
        if (dateFilter === "TODAY") {
          const start = new Date();
          start.setHours(0, 0, 0, 0);
          if (created < start.getTime()) return false;
        } else if (dateFilter === "7D" && now - created > 7 * dayMs) {
          return false;
        } else if (dateFilter === "30D" && now - created > 30 * dayMs) {
          return false;
        } else if (dateFilter === "CUSTOM") {
          if (dateFrom) {
            const from = new Date(dateFrom);
            from.setHours(0, 0, 0, 0);
            if (created < from.getTime()) return false;
          }
          if (dateTo) {
            const to = new Date(dateTo);
            to.setHours(23, 59, 59, 999);
            if (created > to.getTime()) return false;
          }
        }
      }
      return true;
    });
  }, [messages, productFilter, typeFilter, dateFilter, dateFrom, dateTo, branchFilter, categoryFilter, customField, customValue]);

  // Average rating across the currently-filtered feedback (1-5 scale).
  const avgRating = useMemo(() => {
    const scores = filtered.map((m) => m.ratingScore).filter((s): s is number => s != null);
    if (scores.length === 0) return null;
    return { value: scores.reduce((a, b) => a + b, 0) / scores.length, count: scores.length };
  }, [filtered]);

  const hasActiveFilter =
    productFilter !== "ALL" ||
    typeFilter !== "ALL" ||
    dateFilter !== "ALL" ||
    branchFilter !== "ALL" ||
    categoryFilter !== "ALL" ||
    customField !== "ALL";

  const clearFilters = () => {
    setProductFilter("ALL");
    setTypeFilter("ALL");
    setDateFilter("ALL");
    setDateFrom("");
    setDateTo("");
    setBranchFilter("ALL");
    setCategoryFilter("ALL");
    setCustomField("ALL");
    setCustomValue("ALL");
  };

  return (
    <div className="page-content bg-(--ds-bg)">
      <DashboardHeader />
      <section className="section mt-0!">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-(--ds-text-primary)">Customer Feedbacks</h2>
            {avgRating && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-[12px]">
                <RatingSummary value={avgRating.value} />
                <span className="text-(--ds-text-secondary)">· {avgRating.count} rated</span>
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-[12px] text-(--ds-text-secondary)">
              <Filter size={14} />
              <span>Filter</span>
            </div>
            <FilterSelect
              value={productFilter}
              onChange={setProductFilter}
              options={[
                { value: "ALL", label: "All products" },
                ...productOptions.map((p) => ({ value: p, label: p })),
              ]}
            />
            {branchOptions.length > 0 && (
              <FilterSelect
                value={branchFilter}
                onChange={setBranchFilter}
                options={[
                  { value: "ALL", label: "All branches" },
                  ...branchOptions.map((b) => ({ value: b, label: b })),
                ]}
              />
            )}
            {categoryOptions.length > 0 && (
              <FilterSelect
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={[
                  { value: "ALL", label: "All categories" },
                  ...categoryOptions.map((c) => ({ value: c, label: c })),
                ]}
              />
            )}
            {customSelections.size > 0 && (
              <>
                <FilterSelect
                  value={customField}
                  onChange={(v) => {
                    setCustomField(v);
                    setCustomValue("ALL");
                  }}
                  options={[
                    { value: "ALL", label: "All custom fields" },
                    ...Array.from(customSelections.keys()).map((k) => ({ value: k, label: k })),
                  ]}
                />
                {customField !== "ALL" && (
                  <FilterSelect
                    value={customValue}
                    onChange={setCustomValue}
                    options={[
                      { value: "ALL", label: "Any value" },
                      ...customValueOptions.map((v) => ({ value: v, label: v })),
                    ]}
                  />
                )}
              </>
            )}
            <FilterSelect
              value={typeFilter}
              onChange={(v) => setTypeFilter(v as TypeFilter)}
              options={[
                { value: "ALL", label: "All types" },
                { value: "FEEDBACK", label: "Feedback" },
                { value: "INQUIRY", label: "Inquiry" },
              ]}
            />
            <FilterSelect
              value={dateFilter}
              onChange={(v) => setDateFilter(v as DateFilter)}
              options={[
                { value: "ALL", label: "Any date" },
                { value: "TODAY", label: "Today" },
                { value: "7D", label: "Last 7 days" },
                { value: "30D", label: "Last 30 days" },
                { value: "CUSTOM", label: "Custom range" },
              ]}
            />
            {dateFilter === "CUSTOM" && (
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={dateFrom}
                  max={dateTo || undefined}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-[34px] px-2.5 rounded-lg border border-(--ds-border) bg-(--ds-surface) text-[13px] text-(--ds-text-primary) focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-colors"
                  aria-label="From date"
                />
                <span className="text-[12px] text-(--ds-text-secondary)">to</span>
                <input
                  type="date"
                  value={dateTo}
                  min={dateFrom || undefined}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-[34px] px-2.5 rounded-lg border border-(--ds-border) bg-(--ds-surface) text-[13px] text-(--ds-text-primary) focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-colors"
                  aria-label="To date"
                />
              </div>
            )}
            {hasActiveFilter && (
              <button
                onClick={clearFilters}
                className="h-[34px] px-2.5 rounded-lg text-[12px] text-(--ds-text-secondary) hover:text-(--ds-text-primary) hover:bg-(--ds-surface-2) transition-colors flex items-center gap-1"
              >
                <X size={13} />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl overflow-hidden">
          {loading ? (
            <div className="skeleton-table p-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-row mb-4 h-[40px] rounded-lg" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-(--ds-text-secondary)">
              {messages.length === 0
                ? "No feedbacks found."
                : "No feedbacks match the current filters."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-(--ds-border) text-[12px] uppercase tracking-wider text-(--ds-text-secondary) bg-(--ds-surface-2)">
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Phone</th>
                    <th className="p-4 font-medium">Type</th>
                    <th className="p-4 font-medium">Product</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Message Preview</th>
                    <th className="p-4 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="text-[14px]">
                  {filtered.map((msg) => (
                    <tr
                      key={msg.id}
                      onClick={() => setSelected(msg)}
                      className="border-b border-(--ds-border) hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                        <div className="font-medium text-(--ds-text-primary)">{msg.name}</div>
                        {msg.email && (
                          <div className="text-[12px] text-(--ds-text-secondary)">{msg.email}</div>
                        )}
                      </td>
                      <td className="p-4 text-(--ds-text-secondary) whitespace-nowrap">
                        {msg.phoneNumber ? (
                          <a
                            href={`tel:${msg.phoneNumber}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-primary transition-colors"
                          >
                            {msg.phoneNumber}
                          </a>
                        ) : (
                          <span className="text-(--ds-text-secondary)/60">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-(--ds-surface-2) text-(--ds-text-primary) uppercase tracking-tight">
                          {msg.type} {msg.feedbackType ? `- ${msg.feedbackType}` : ""}
                        </span>
                      </td>
                      <td className="p-4 text-(--ds-text-secondary)">
                        <div className="flex items-center gap-2">
                          <span>{msg.productName}</span>
                          {msg.ratingScore != null && <RatingSummary value={msg.ratingScore} />}
                        </div>
                        {msg.branchName && (
                          <div className="text-[12px] text-(--ds-text-secondary)/70">{msg.branchName}</div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-tight ${
                          msg.status === 'NEW' ? 'bg-primary/10 text-primary' :
                          msg.status === 'CLOSED' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                          'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                        }`}>
                          {msg.status}
                        </span>
                      </td>
                      <td className="p-4 text-(--ds-text-secondary) max-w-[240px]">
                        <MessagePreview description={msg.description} />
                      </td>
                      <td className="p-4 text-(--ds-text-secondary) text-right whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <FeedbackModal message={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-[34px] pl-3 pr-8 rounded-lg border border-(--ds-border) bg-(--ds-surface) text-[13px] text-(--ds-text-primary) focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-colors appearance-none bg-no-repeat bg-[right_0.6rem_center] bg-[length:0.7rem] cursor-pointer"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function FeedbackModal({ message, onClose }: { message: Message | null; onClose: () => void }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const parsed = useMemo(
    () => (message ? parseDescription(message.description ?? "") : { text: "", images: [], links: [] }),
    [message]
  );

  const attachments = useMemo(() => {
    if (!message) return [] as Array<{ url: string; filename: string }>;
    return parsed.images.map((url, i) => ({
      url,
      filename: buildAttachmentFilename(
        message.productName,
        message.name,
        message.phoneNumber,
        message.createdAt,
        url,
        i,
        parsed.images.length,
      ),
    }));
  }, [message, parsed.images]);

  // Reset lightbox whenever the parent modal closes.
  useEffect(() => {
    if (!message) setLightboxIndex(null);
  }, [message]);

  if (!message) return null;

  const statusClasses =
    message.status === "NEW"
      ? "bg-primary/10 text-primary"
      : message.status === "CLOSED"
      ? "bg-green-500/10 text-green-600 dark:text-green-400"
      : "bg-orange-500/10 text-orange-600 dark:text-orange-400";

  return (
    <>
      <div
        className="fixed inset-0 z-9998 bg-black/40 backdrop-blur-xs"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease" }}
      />
      <div
        className="fixed inset-0 z-9999 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-[520px] max-h-[90vh] overflow-y-auto rounded-2xl bg-(--ds-surface) shadow-2xl border border-(--ds-border)"
          onClick={(e) => e.stopPropagation()}
          style={{ animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-(--ds-border)">
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-(--ds-text-primary) truncate">
                {message.name}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-(--ds-surface-2) text-(--ds-text-primary) uppercase tracking-tight">
                  {message.type}
                  {message.feedbackType ? ` - ${message.feedbackType}` : ""}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-tight ${statusClasses}`}>
                  {message.status}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-(--ds-text-secondary) hover:text-(--ds-text-primary) hover:bg-(--ds-surface-2) transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            <DetailRow icon={<Mail size={15} />} label="Email">
              {message.email ? (
                <a href={`mailto:${message.email}`} className="text-(--ds-text-primary) hover:text-primary transition-colors">
                  {message.email}
                </a>
              ) : (
                <span className="text-(--ds-text-secondary)/60">-</span>
              )}
            </DetailRow>
            <DetailRow icon={<Phone size={15} />} label="Phone">
              {message.phoneNumber ? (
                <a href={`tel:${message.phoneNumber}`} className="text-(--ds-text-primary) hover:text-primary transition-colors">
                  {message.phoneNumber}
                </a>
              ) : (
                <span className="text-(--ds-text-secondary)/60">-</span>
              )}
            </DetailRow>
            <DetailRow icon={<PackageIcon size={15} />} label="Product">
              <span className="text-(--ds-text-primary)">{message.productName}</span>
            </DetailRow>
            {message.branchName && (
              <DetailRow icon={<MapPin size={15} />} label="Branch">
                <span className="text-(--ds-text-primary)">{message.branchName}</span>
              </DetailRow>
            )}
            {message.categoryName && (
              <DetailRow icon={<Layers size={15} />} label="Category">
                <span className="text-(--ds-text-primary)">{message.categoryName}</span>
              </DetailRow>
            )}
            {message.ratingScore != null && (
              <DetailRow icon={<Tag size={15} />} label="Average rating">
                <RatingSummary value={message.ratingScore} />
              </DetailRow>
            )}
            {message.feedbackType && (
              <DetailRow icon={<Tag size={15} />} label="Feedback type">
                <span className="text-(--ds-text-primary)">{message.feedbackType}</span>
              </DetailRow>
            )}
            <DetailRow icon={<Calendar size={15} />} label="Received">
              <span className="text-(--ds-text-primary)">
                {new Date(message.createdAt).toLocaleString()}
              </span>
            </DetailRow>

            <div className="pt-2">
              <div className="text-[11px] uppercase tracking-wider text-(--ds-text-secondary) font-medium mb-2">
                Message
              </div>
              <div className="rounded-xl bg-(--ds-surface-2) border border-(--ds-border) p-4 text-[14px] text-(--ds-text-primary) whitespace-pre-wrap break-words">
                {parsed.text ? (
                  renderTextWithLinks(parsed.text)
                ) : parsed.images.length === 0 ? (
                  <span className="text-(--ds-text-secondary)/60">No message provided.</span>
                ) : (
                  <span className="text-(--ds-text-secondary)/60">No written message - see attachments below.</span>
                )}
              </div>
            </div>

            {message.answers.length > 0 && (
              <div className="pt-1">
                <div className="text-[11px] uppercase tracking-wider text-(--ds-text-secondary) font-medium mb-2 flex items-center gap-1.5">
                  <ListChecks size={12} />
                  Responses ({message.answers.length})
                </div>
                <div className="rounded-xl border border-(--ds-border) divide-y divide-(--ds-border) overflow-hidden">
                  {message.answers.map((a, i) => (
                    <div key={`${a.fieldId}-${i}`} className="flex items-start justify-between gap-3 px-4 py-2.5">
                      <span className="text-[13px] text-(--ds-text-secondary) shrink-0">{a.label}</span>
                      <span className="text-[13px] text-right min-w-0">
                        <AnswerValue answer={a} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {attachments.length > 0 && (
              <div className="pt-1">
                <div className="text-[11px] uppercase tracking-wider text-(--ds-text-secondary) font-medium mb-2 flex items-center gap-1.5">
                  <ImageIcon size={12} />
                  Attachments ({attachments.length})
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {attachments.map((att, i) => (
                    <div
                      key={att.url}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-(--ds-border) bg-(--ds-surface-2) hover:border-primary/40 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setLightboxIndex(i)}
                        className="absolute inset-0 w-full h-full"
                        aria-label="View image"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={att.url}
                          alt={att.filename}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
                        />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          void triggerDownload(att.url, att.filename);
                        }}
                        title={`Download ${att.filename}`}
                        aria-label={`Download ${att.filename}`}
                        className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/55 hover:bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                      >
                        <Download size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {lightboxIndex !== null && attachments[lightboxIndex] && (
        <ImageLightbox
          url={attachments[lightboxIndex].url}
          filename={attachments[lightboxIndex].filename}
          onClose={() => setLightboxIndex(null)}
        />
      )}

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

function MessagePreview({ description }: { description: string }) {
  const parsed = useMemo(() => parseDescription(description ?? ""), [description]);
  const preview = parsed.text || (parsed.images.length > 0 ? "(image attached)" : "");
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="truncate flex-1" title={preview}>
        {preview || <span className="text-(--ds-text-secondary)/60">-</span>}
      </span>
      {parsed.images.length > 0 && (
        <span
          className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium"
          title={`${parsed.images.length} image attachment${parsed.images.length === 1 ? "" : "s"}`}
        >
          <ImageIcon size={11} />
          {parsed.images.length}
        </span>
      )}
    </div>
  );
}

function ImageLightbox({ url, filename, onClose }: { url: string; filename: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}
      style={{ animation: "fadeIn 0.18s ease" }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
      >
        <X size={18} />
      </button>
      <div
        className="absolute top-4 left-4 flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => void triggerDownload(url, filename)}
          title={`Download ${filename}`}
          className="px-3 h-10 rounded-full bg-white text-black hover:bg-white/90 text-[13px] font-semibold flex items-center gap-1.5 transition-colors shadow-md"
        >
          <Download size={14} />
          Download
        </button>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="px-3 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-[13px] font-medium flex items-center gap-1.5 transition-colors"
        >
          <ExternalLink size={14} />
          Open original
        </a>
      </div>
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/55 text-white/85 text-[12px] font-medium backdrop-blur-sm max-w-[80vw] truncate"
        title={filename}
        onClick={(e) => e.stopPropagation()}
      >
        {filename}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={filename}
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        style={{ animation: "slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)" }}
      />
    </div>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-[13px]">
      <div className="shrink-0 w-7 h-7 rounded-md bg-(--ds-surface-2) flex items-center justify-center text-(--ds-text-secondary)">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] uppercase tracking-wider text-(--ds-text-secondary) font-medium">
          {label}
        </div>
        <div className="mt-0.5 break-words">{children}</div>
      </div>
    </div>
  );
}
