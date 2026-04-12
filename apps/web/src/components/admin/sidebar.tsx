"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

const navItems = [
  {
    href: "/admin",
    label: "Home",
    exact: true,
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    href: "/admin/promptions",
    label: "Promptions",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(false); // collapsed by default

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setExpanded(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);

  return (
    <>
      {/* Mobile header bar */}
      <div className="admin-mobile-header">
        <button
          className="admin-hamburger"
          onClick={toggleMobile}
          aria-label="Toggle menu"
          id="admin-hamburger-btn"
        >
          <span className={`admin-hamburger-line ${mobileOpen ? "admin-hamburger-line--open" : ""}`} />
          <span className={`admin-hamburger-line ${mobileOpen ? "admin-hamburger-line--open" : ""}`} />
          <span className={`admin-hamburger-line ${mobileOpen ? "admin-hamburger-line--open" : ""}`} />
        </button>
        <div className="admin-mobile-logo">
          <div className="admin-mobile-logo-icon">A</div>
          <span className="admin-mobile-logo-text">Admin</span>
        </div>
        <div className="admin-mobile-avatar" title={user?.email}>
          {user?.email?.[0]?.toUpperCase() ?? "A"}
        </div>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${expanded ? "admin-sidebar--expanded" : ""} ${mobileOpen ? "admin-sidebar--open" : ""}`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {/* Logo + toggle */}
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-logo-icon">A</div>
          <span className="admin-sidebar-logo-text">Admin Panel</span>
        </div>



        {/* Nav */}
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-sidebar-nav-item ${isActive ? "admin-sidebar-nav-item--active" : ""}`}
                title={item.label}
                id={`admin-nav-${item.label.toLowerCase()}`}
              >
                <span className="admin-sidebar-nav-icon">{item.icon}</span>
                <span className="admin-sidebar-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar-footer">
          <button onClick={signOut} className="admin-sidebar-signout" title="Sign out" id="admin-signout-btn">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="admin-sidebar-nav-label">Sign out</span>
          </button>
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-avatar" title={user?.email}>
              {user?.email?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="admin-sidebar-user-info">
              <span className="admin-sidebar-user-role">Super Admin</span>
              <span className="admin-sidebar-user-email">{user?.email ?? "admin@example.com"}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
