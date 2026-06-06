"use client";

import { useState, useTransition } from "react";
import { changePasswordAction } from "@/lib/account/actions";

export function ChangePasswordCard() {
  const [isPending, startTransition] = useTransition();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }

    startTransition(async () => {
      const result = await changePasswordAction(currentPassword, newPassword);
      if ("error" in result && result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        reset();
      }
    });
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-lg border border-(--ds-border) bg-(--ds-surface-2) text-[14px] outline-none focus:border-(--ds-text-secondary)";

  return (
    <div className="bg-(--ds-surface) border border-(--ds-border) rounded-xl p-8">
      <h3 className="text-lg font-semibold text-(--ds-text-primary) mb-6 tracking-tight">
        Change Password
      </h3>

      <form onSubmit={handleSubmit} className="max-w-md space-y-5">
        <div>
          <label htmlFor="cp-current" className="block text-[13px] font-medium text-(--ds-text-secondary) mb-2">
            Current password
          </label>
          <input
            id="cp-current"
            type={show ? "text" : "password"}
            className={inputCls}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
            disabled={isPending}
          />
        </div>

        <div>
          <label htmlFor="cp-new" className="block text-[13px] font-medium text-(--ds-text-secondary) mb-2">
            New password
          </label>
          <input
            id="cp-new"
            type={show ? "text" : "password"}
            className={inputCls}
            placeholder="Min. 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            disabled={isPending}
          />
        </div>

        <div>
          <label htmlFor="cp-confirm" className="block text-[13px] font-medium text-(--ds-text-secondary) mb-2">
            Confirm new password
          </label>
          <input
            id="cp-confirm"
            type={show ? "text" : "password"}
            className={inputCls}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
            disabled={isPending}
          />
        </div>

        <label className="flex items-center gap-2 text-[13px] text-(--ds-text-secondary) select-none cursor-pointer">
          <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
          Show passwords
        </label>

        {error && (
          <div className="text-[13px] text-red-600 dark:text-red-400" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="text-[13px] text-green-600 dark:text-green-400" role="status">
            Password updated successfully.
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-(--ds-text-primary) text-(--ds-surface) text-[14px] font-semibold disabled:opacity-60"
        >
          {isPending ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
