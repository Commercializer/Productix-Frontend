"use client";

import { useState } from "react";
import { X, Mail, Phone, Package as PackageIcon, Calendar, Tag } from "lucide-react";
import { useMessages, type Message } from "@/hooks/use-messages";
import { DashboardHeader } from "@/components/dashboard/header";

export default function MessagesPage() {
  const { messages, loading } = useMessages();
  const [selected, setSelected] = useState<Message | null>(null);

  return (
    <div className="page-content bg-(--ds-bg)">
      <DashboardHeader />
      <section className="section mt-0!">
        <h2 className="text-xl font-bold text-(--ds-text-primary) mb-6">Customer Feedbacks</h2>

        <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl overflow-hidden">
          {loading ? (
            <div className="skeleton-table p-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-row mb-4 h-[40px] rounded-lg" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-(--ds-text-secondary)">
              No feedbacks found.
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
                  {messages.map((msg) => (
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
                          <span className="text-(--ds-text-secondary)/60">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-(--ds-surface-2) text-(--ds-text-primary) uppercase tracking-tight">
                          {msg.type} {msg.feedbackType ? `- ${msg.feedbackType}` : ""}
                        </span>
                      </td>
                      <td className="p-4 text-(--ds-text-secondary)">{msg.productName}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-tight ${
                          msg.status === 'NEW' ? 'bg-primary/10 text-primary' :
                          msg.status === 'CLOSED' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                          'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                        }`}>
                          {msg.status}
                        </span>
                      </td>
                      <td className="p-4 text-(--ds-text-secondary) max-w-[200px] truncate" title={msg.description}>
                        {msg.description}
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

function FeedbackModal({ message, onClose }: { message: Message | null; onClose: () => void }) {
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
                <span className="text-(--ds-text-secondary)/60">—</span>
              )}
            </DetailRow>
            <DetailRow icon={<Phone size={15} />} label="Phone">
              {message.phoneNumber ? (
                <a href={`tel:${message.phoneNumber}`} className="text-(--ds-text-primary) hover:text-primary transition-colors">
                  {message.phoneNumber}
                </a>
              ) : (
                <span className="text-(--ds-text-secondary)/60">—</span>
              )}
            </DetailRow>
            <DetailRow icon={<PackageIcon size={15} />} label="Product">
              <span className="text-(--ds-text-primary)">{message.productName}</span>
            </DetailRow>
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
                {message.description || <span className="text-(--ds-text-secondary)/60">No message provided.</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

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
