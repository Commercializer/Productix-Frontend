"use client";

import { useState, useEffect, useCallback } from "react";
import { getCompanySettingsAction } from "@/lib/dashboard/actions";

export interface CompanySettings {
  id: string;
  name: string;
  email: string;
  businessUsername: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
  maximumProducts: number;
  maximumBrandProfiles: number;
  createdAt: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCompanySettingsAction();
      if (result.error) throw new Error(result.error);
      setSettings(result.company || null);
    } catch (err: any) {
      setError(err.message ?? "Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    refresh: fetchSettings,
  };
}
