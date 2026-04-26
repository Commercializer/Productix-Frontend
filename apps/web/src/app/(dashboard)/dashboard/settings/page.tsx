"use client";

import { useSettings } from "@/hooks/use-settings";
import { DashboardHeader } from "@/components/dashboard/header";

export default function SettingsPage() {
  const { settings, loading } = useSettings();

  return (
    <div className="page-content bg-(--ds-bg)">
      <DashboardHeader />
      <section className="section mt-0! max-w-5xl">
        <h2 className="text-xl font-bold text-(--ds-text-primary) mb-6">Account Settings</h2>
        
        {loading ? (
          <div className="bg-white dark:bg-[#111] border border-(--ds-border) rounded-xl p-8 mb-6">
            <div className="skeleton-row mb-6 h-[24px] w-1/3 rounded" />
            <div className="skeleton-row mb-6 h-[24px] w-1/2 rounded" />
            <div className="skeleton-row h-[24px] w-1/4 rounded" />
          </div>
        ) : settings ? (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#111] border border-(--ds-border) rounded-xl p-8">
              <h3 className="text-lg font-semibold text-(--ds-text-primary) mb-6 tracking-tight">Organization Profile</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-medium text-(--ds-text-secondary) mb-2">Company Name</label>
                  <div className="px-4 py-2.5 rounded-lg border border-(--ds-border) bg-black/2 dark:bg-white/2 text-[14px]">
                    {settings.name}
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-(--ds-text-secondary) mb-2">Business Username</label>
                  <div className="px-4 py-2.5 rounded-lg border border-(--ds-border) bg-black/2 dark:bg-white/2 text-[14px]">
                    {settings.businessUsername}
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-(--ds-text-secondary) mb-2">Contact Email</label>
                  <div className="px-4 py-2.5 rounded-lg border border-(--ds-border) bg-black/2 dark:bg-white/2 text-[14px]">
                    {settings.email}
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-(--ds-text-secondary) mb-2">Joined Date</label>
                  <div className="px-4 py-2.5 rounded-lg border border-(--ds-border) bg-black/2 dark:bg-white/2 text-[14px]">
                    {new Date(settings.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111] border border-(--ds-border) rounded-xl p-8">
              <h3 className="text-lg font-semibold text-(--ds-text-primary) mb-6 tracking-tight">Subscription & Limits</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-[13px] font-medium text-(--ds-text-secondary) mb-2">Plan</label>
                  <div className="text-lg font-semibold text-(--ds-text-primary)">{settings.subscriptionPlan}</div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-(--ds-text-secondary) mb-2">Status</label>
                  <div>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-tight ${
                      settings.subscriptionStatus === 'ACTIVE' ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>
                      {settings.subscriptionStatus}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-(--ds-text-secondary) mb-2">Max Products</label>
                  <div className="text-lg font-semibold text-(--ds-text-primary)">{settings.maximumProducts}</div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-(--ds-text-secondary) mb-2">Max Brands</label>
                  <div className="text-lg font-semibold text-(--ds-text-primary)">{settings.maximumBrandProfiles}</div>
                </div>
              </div>
            </div>
            
          </div>
        ) : (
          <div className="bg-white dark:bg-[#111] border border-(--ds-border) rounded-xl p-8 text-center text-(--ds-text-secondary)">
            Failed to load settings.
          </div>
        )}
      </section>
    </div>
  );
}
