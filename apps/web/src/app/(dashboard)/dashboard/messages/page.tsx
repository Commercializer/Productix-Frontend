"use client";

import { useMessages } from "@/hooks/use-messages";
import { DashboardHeader } from "@/components/dashboard/header";

export default function MessagesPage() {
  const { messages, loading } = useMessages();

  return (
    <div className="page-content bg-[var(--ds-bg)]">
      <DashboardHeader />
      <section className="section !mt-0">
        <h2 className="text-xl font-bold text-[var(--ds-text-primary)] mb-6">Customer Messages</h2>
        
        <div className="bg-white dark:bg-[#111] border border-[var(--ds-border)] rounded-xl overflow-hidden">
          {loading ? (
            <div className="skeleton-table p-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-row mb-4 h-[40px] rounded-lg" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-[var(--ds-text-secondary)]">
              No messages found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--ds-border)] text-[12px] uppercase tracking-wider text-[var(--ds-text-secondary)] bg-black/[0.02] dark:bg-white/[0.02]">
                    <th className="p-4 font-medium">Customer</th>
                    <th className="p-4 font-medium">Type</th>
                    <th className="p-4 font-medium">Product</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Message Preview</th>
                    <th className="p-4 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="text-[14px]">
                  {messages.map((msg) => (
                    <tr key={msg.id} className="border-b border-[var(--ds-border)] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-[var(--ds-text-primary)]">{msg.name}</div>
                        <div className="text-[12px] text-[var(--ds-text-secondary)]">{msg.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/5 dark:bg-white/10 text-[var(--ds-text-primary)] uppercase tracking-tight">
                          {msg.type} {msg.feedbackType ? `- ${msg.feedbackType}` : ""}
                        </span>
                      </td>
                      <td className="p-4 text-[var(--ds-text-secondary)]">{msg.productName}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-tight ${
                          msg.status === 'NEW' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                          msg.status === 'CLOSED' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                          'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                        }`}>
                          {msg.status}
                        </span>
                      </td>
                      <td className="p-4 text-[var(--ds-text-secondary)] max-w-[200px] truncate" title={msg.description}>
                        {msg.description}
                      </td>
                      <td className="p-4 text-[var(--ds-text-secondary)] text-right whitespace-nowrap">
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
    </div>
  );
}
