"use client";

/* ─────────────────────────────────────────────
 * Branch Manager - CRUD list for company branches.
 *
 * Branches are the physical locations customers pick
 * when submitting feedback, so feedback can be filtered
 * and segmented by location in the dashboard.
 * ──────────────────────────────────────────── */

import { useEffect, useState } from "react";
import { MapPin, Plus, Trash2, Pencil, Check, X, Loader2 } from "lucide-react";
import {
  getBranchesAction,
  createBranchAction,
  updateBranchAction,
  deleteBranchAction,
} from "@/lib/dashboard/actions";

interface Branch {
  id: string;
  name: string;
  city: string | null;
  address: string | null;
  isActive: boolean;
}

export function BranchManager() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New-branch form state
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [creating, setCreating] = useState(false);

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await getBranchesAction();
    if (res.error) setError(res.error);
    else setBranches(res.items ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || creating) return;
    setCreating(true);
    setError(null);
    const res = await createBranchAction({ name, city, address });
    if (res.error) {
      setError(res.error);
    } else if (res.item) {
      setBranches((prev) =>
        [...prev.filter((b) => b.id !== res.item!.id), res.item!].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setName("");
      setCity("");
      setAddress("");
    }
    setCreating(false);
  };

  const startEdit = (b: Branch) => {
    setEditingId(b.id);
    setEditName(b.name);
    setEditCity(b.city ?? "");
    setEditAddress(b.address ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim() || busyId) return;
    setBusyId(id);
    setError(null);
    const res = await updateBranchAction(id, { name: editName, city: editCity, address: editAddress });
    if (res.error) {
      setError(res.error);
    } else if (res.item) {
      setBranches((prev) =>
        prev.map((b) => (b.id === id ? res.item! : b)).sort((a, b) => a.name.localeCompare(b.name)),
      );
      setEditingId(null);
    }
    setBusyId(null);
  };

  const toggleActive = async (b: Branch) => {
    setBusyId(b.id);
    const res = await updateBranchAction(b.id, { isActive: !b.isActive });
    if (res.item) setBranches((prev) => prev.map((x) => (x.id === b.id ? res.item! : x)));
    setBusyId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this branch? Existing feedback will keep its history but lose the branch label.")) return;
    setBusyId(id);
    const res = await deleteBranchAction(id);
    if (res.error) setError(res.error);
    else setBranches((prev) => prev.filter((b) => b.id !== id));
    setBusyId(null);
  };

  const inputCls =
    "px-3 py-2 rounded-lg border border-(--ds-border) bg-(--ds-surface) text-[14px] text-(--ds-text-primary) focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] transition-colors";

  return (
    <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-8">
      <div className="flex items-center gap-2 mb-1">
        <MapPin size={18} className="text-(--ds-text-secondary)" />
        <h3 className="text-lg font-semibold text-(--ds-text-primary) tracking-tight">Branches</h3>
      </div>
      <p className="text-[13px] text-(--ds-text-secondary) mb-6">
        Locations customers can choose when leaving feedback. Used to filter and segment feedback by branch.
      </p>

      {/* Create form */}
      <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 mb-6">
        <input
          className={inputCls}
          placeholder="Branch name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={255}
        />
        <input className={inputCls} placeholder="City (optional)" value={city} onChange={(e) => setCity(e.target.value)} />
        <input
          className={inputCls}
          placeholder="Address (optional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button
          type="submit"
          disabled={!name.trim() || creating}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#0284c7] text-white text-[13px] font-semibold hover:bg-[#0369a1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {creating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
          Add
        </button>
      </form>

      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[13px]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="skeleton-row h-[44px] rounded-lg" />
          ))}
        </div>
      ) : branches.length === 0 ? (
        <div className="text-center text-(--ds-text-secondary) text-[14px] py-6">
          No branches yet. Add your first location above.
        </div>
      ) : (
        <ul className="divide-y divide-(--ds-border) border border-(--ds-border) rounded-lg overflow-hidden">
          {branches.map((b) => (
            <li key={b.id} className="flex items-center gap-3 px-4 py-3">
              {editingId === b.id ? (
                <>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input className={inputCls} value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" />
                    <input className={inputCls} value={editCity} onChange={(e) => setEditCity(e.target.value)} placeholder="City" />
                    <input className={inputCls} value={editAddress} onChange={(e) => setEditAddress(e.target.value)} placeholder="Address" />
                  </div>
                  <button
                    onClick={() => saveEdit(b.id)}
                    disabled={busyId === b.id}
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-colors"
                    aria-label="Save"
                  >
                    {busyId === b.id ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-(--ds-text-secondary) hover:bg-(--ds-surface-2) transition-colors"
                    aria-label="Cancel"
                  >
                    <X size={15} />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-(--ds-text-primary) truncate">{b.name}</span>
                      {!b.isActive && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-(--ds-surface-2) text-(--ds-text-secondary) text-[10px] font-medium uppercase tracking-tight">
                          Inactive
                        </span>
                      )}
                    </div>
                    {(b.city || b.address) && (
                      <div className="text-[12px] text-(--ds-text-secondary) truncate">
                        {[b.city, b.address].filter(Boolean).join(" · ")}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => toggleActive(b)}
                    disabled={busyId === b.id}
                    className="shrink-0 text-[12px] text-(--ds-text-secondary) hover:text-(--ds-text-primary) transition-colors px-2"
                  >
                    {b.isActive ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => startEdit(b)}
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-(--ds-text-secondary) hover:bg-(--ds-surface-2) transition-colors"
                    aria-label="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    disabled={busyId === b.id}
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                    aria-label="Delete"
                  >
                    {busyId === b.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
