"use client";

import { useState, useTransition } from "react";
import { deletePromptionAction } from "@/lib/admin/actions";

export interface AdminPromption {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  businessUsername: string;
  updatedAt: string;
  createdAt: string;
}

interface AdminPromptionTableProps {
  promptions: AdminPromption[];
  onRefresh: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdminPromptionTable({
  promptions,
  onRefresh,
}: AdminPromptionTableProps) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = promptions.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.companyName.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setConfirmDeleteId(null);
    startTransition(async () => {
      const result = await deletePromptionAction(id, true);
      if (result.error) setError(result.error);
      else onRefresh();
    });
  };

  const handleCopy = (slug: string) => {
    const url = `${window.location.origin}/preview/${slug}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      {error && (
        <div className="alert alert--error">
          {error}
          <button onClick={() => setError(null)} className="alert-close">✕</button>
        </div>
      )}

      <div className="table-container">
        <div className="table-toolbar">
          <div className="table-search-wrap">
            <svg className="table-search-icon" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="table-search"
              placeholder="Search promptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="admin-promption-search"
            />
          </div>
          <span className="table-count">{filtered.length} promptions</span>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th className="th">Name</th>
                <th className="th">Company</th>
                <th className="th">Link</th>
                <th className="th">Last Modified</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="table-empty">
                    {search ? "No promptions match." : "No promptions found."}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="tr">
                    <td className="td">
                      <div className="td-name">
                        <div className="td-avatar">
                          {p.title[0]?.toUpperCase()}
                        </div>
                        <span className="td-title">{p.title}</span>
                      </div>
                    </td>
                    <td className="td td-muted">{p.companyName}</td>
                    <td className="td">
                      <span className="td-link">/preview/{p.slug}</span>
                    </td>
                    <td className="td td-muted">{formatDate(p.updatedAt)}</td>
                    <td className="td">
                      <div className="td-actions">
                        {/* View link */}
                        <a
                          href={`/preview/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-btn action-btn--edit"
                          title="View"
                          id={`view-promption-${p.id}`}
                        >
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                        {/* Copy link */}
                        <button
                          className="action-btn action-btn--share"
                          title="Copy link"
                          onClick={() => handleCopy(p.slug)}
                          id={`copy-promption-${p.id}`}
                        >
                          {copied === p.slug ? (
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                          )}
                        </button>
                        {/* Delete */}
                        {confirmDeleteId === p.id ? (
                          <button
                            className="action-btn action-btn--confirm"
                            onClick={() => handleDelete(p.id)}
                            disabled={isPending}
                            title="Confirm delete"
                          >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            className="action-btn action-btn--delete"
                            onClick={() => setConfirmDeleteId(p.id)}
                            title="Delete"
                            id={`admin-delete-promption-${p.id}`}
                          >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
