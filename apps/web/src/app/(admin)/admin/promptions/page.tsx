"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { listAllPromptionsAction } from "@/lib/admin/actions";
import {
  AdminPromptionTable,
  type AdminPromption,
} from "@/components/admin/promption-table";

export default function AdminPromptionsPage() {
  const [promptions, setPromptions] = useState<AdminPromption[]>([]);
  const [isPending, startTransition] = useTransition();

  const loadPromptions = useCallback(() => {
    startTransition(async () => {
      try {
        const data = await listAllPromptionsAction();
        setPromptions(data as AdminPromption[]);
      } catch (e) {
        console.error(e);
      }
    });
  }, []);

  useEffect(() => {
    loadPromptions();
  }, [loadPromptions]);

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">All Promptions</h1>
          <p className="page-sub">
            View and manage promptions across all companies
          </p>
        </div>
      </div>

      {isPending && promptions.length === 0 ? (
        <div className="skeleton-table">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-row" />
          ))}
        </div>
      ) : (
        <AdminPromptionTable
          promptions={promptions}
          onRefresh={loadPromptions}
        />
      )}
    </div>
  );
}
