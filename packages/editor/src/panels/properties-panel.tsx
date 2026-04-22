/* ─────────────────────────────────────────────
 * Block Settings Panel — Light theme
 *
 * Multilingual content editing: when a non-EN
 * locale is active, the panel shows the localized
 * values and a visual indicator of the active language.
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { MousePointer, ArrowUp, ArrowDown, Copy, Trash2, Globe } from "lucide-react";
import { useCanvasStore } from "../engine/canvas-store";
import { getElementDefinition } from "../elements/registry";
import { useTranslation } from "../i18n";
import { getLocalizedProps } from "../utils/localize-props";
import { CONTENT_LOCALE_META } from "@productix/types";

const BLOCK_LABELS: Record<string, string> = {
  text:"Product Text", heading:"Product Title", image:"Product Image", button:"CTA Button",
  card:"Feature Card", icon:"Icon", badge:"Badge", "social-group":"Social Links",
  "social-facebook":"Facebook", "social-instagram":"Instagram", "social-twitter":"X / Twitter",
  "social-linkedin":"LinkedIn", "social-youtube":"YouTube", "social-tiktok":"TikTok",
  "social-github":"GitHub", "social-whatsapp":"WhatsApp", "social-threads":"Threads",
  "social-website":"Website", "social-email":"Email", "social-phone":"Phone",
  "stat-card":"Key Stat", "promo-card":"Highlight Card", divider:"Divider",
  container:"Section Block", row:"Content Row", column:"Column",
};

export function PropertiesPanel() {
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const elements = useCanvasStore((s) => s.document.elements);
  const updateElementProps = useCanvasStore((s) => s.updateElementProps);
  const updateElement = useCanvasStore((s) => s.updateElement);
  const removeElement = useCanvasStore((s) => s.removeElement);
  const duplicateElement = useCanvasStore((s) => s.duplicateElement);
  const bringForward = useCanvasStore((s) => s.bringForward);
  const sendBackward = useCanvasStore((s) => s.sendBackward);
  const contentLocale = useCanvasStore((s) => s.contentLocale);
  const { t } = useTranslation();

  const localeMeta = CONTENT_LOCALE_META[contentLocale];
  const isNonEnglish = contentLocale !== "en";

  if (selectedIds.length === 0) {
    return (
      <div style={{ display:"flex",flexDirection:"column",height:"100%" }}>
        <div style={{ padding:"16px 20px 12px",borderBottom:"1px solid #f0f0f0" }}>
          <h2 style={{ fontSize:14,fontWeight:700,color:"#1e1e2e",margin:0 }}>{t("blockSettings.title")}</h2>
        </div>
        <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 24px" }}>
          <div style={{ marginBottom:12,opacity:0.2,display:"flex",justifyContent:"center" }}><MousePointer size={36} /></div>
          <p style={{ fontSize:13,color:"#9ca3af",textAlign:"center",fontWeight:500 }}>{t("blockSettings.noSelection")}</p>
          <p style={{ fontSize:11,color:"#d1d5db",textAlign:"center",marginTop:4 }}>{t("blockSettings.noSelectionHint")}</p>
        </div>
      </div>
    );
  }

  const selId = selectedIds[0];
  if (selectedIds.length > 1 || !selId) {
    return (
      <div style={{ display:"flex",flexDirection:"column",height:"100%" }}>
        <div style={{ padding:"16px 20px 12px",borderBottom:"1px solid #f0f0f0" }}>
          <h2 style={{ fontSize:14,fontWeight:700,color:"#1e1e2e",margin:0 }}>{t("blockSettings.title")}</h2>
        </div>
        <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px" }}>
          <p style={{ fontSize:13,color:"#9ca3af" }}>{selectedIds.length} blocks selected</p>
        </div>
      </div>
    );
  }

  const el = elements[selId];
  if (!el) return null;
  const def = getElementDefinition(el.type);
  if (!def) return null;
  const PropertyPanelComponent = def.propertyPanel;
  const blockLabel = BLOCK_LABELS[el.type] || def.label;

  // Get the effective props for the current content locale
  const effectiveProps = getLocalizedProps(el, contentLocale);

  return (
    <div style={{ display:"flex",flexDirection:"column",height:"100%" }}>
      <div style={{ padding:"16px 20px 12px",borderBottom:"1px solid #f0f0f0",display:"flex",alignItems:"center",gap:10 }}>
        <span style={{ width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:10,background:"#e0f2fe",color:"#0ea5e9" }}>{def.icon}</span>
        <div>
          <h2 style={{ fontSize:14,fontWeight:700,color:"#1e1e2e",margin:0 }}>{blockLabel}</h2>
          <p style={{ fontSize:10,color:"#9ca3af",margin:0 }}>{t("blockSettings.title")}</p>
        </div>
      </div>

      {/* Language indicator banner when editing non-EN */}
      {isNonEnglish && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          background: contentLocale === "si" ? "#fffbeb" : "#eff6ff",
          borderBottom: `1px solid ${contentLocale === "si" ? "#fde68a" : "#bfdbfe"}`,
        }}>
          <Globe size={12} style={{ color: contentLocale === "si" ? "#b45309" : "#2563eb", flexShrink: 0 }} />
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            color: contentLocale === "si" ? "#92400e" : "#1d4ed8",
          }}>
            {localeMeta.flag} Editing in {localeMeta.nativeLabel}
          </span>
          <span style={{ fontSize: 9, color: "#9ca3af", marginLeft: "auto" }}>
            EN fallback for empty fields
          </span>
        </div>
      )}

      <div style={{ flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:16 }}>
        <div>
          <h3 style={{ fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10 }}>{t("blockSettings.blockContent")}</h3>
          <PropertyPanelComponent props={effectiveProps} onChange={(changes) => updateElementProps(el.id, changes)} />
        </div>
        <div style={{ height:1,background:"#f0f0f0" }} />
        <div>
          <h3 style={{ fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10 }}>{t("blockSettings.appearance")}</h3>
          <label style={{ display:"block" }}>
            <span style={{ fontSize:11,color:"#6b7280",fontWeight:500 }}>{t("properties.opacity")}</span>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:4 }}>
              <input type="range" style={{ flex:1,accentColor:"#0ea5e9" }} value={el.opacity*100} onChange={(e) => updateElement(el.id, { opacity:Number(e.target.value)/100 })} min={0} max={100} />
              <span style={{ fontSize:11,color:"#9ca3af",width:32,textAlign:"right" }}>{Math.round(el.opacity*100)}%</span>
            </div>
          </label>
        </div>
        <div style={{ height:1,background:"#f0f0f0" }} />
        <div>
          <h3 style={{ fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10 }}>{t("blockSettings.blockOrder")}</h3>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:6 }}>
            <ActionBtn onClick={() => bringForward(el.id)}><ArrowUp size={12} style={{ marginRight:4 }} /> Move Up</ActionBtn>
            <ActionBtn onClick={() => sendBackward(el.id)}><ArrowDown size={12} style={{ marginRight:4 }} /> Move Down</ActionBtn>
          </div>
        </div>
        <div style={{ height:1,background:"#f0f0f0" }} />
        <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
          <ActionBtn onClick={() => duplicateElement(el.id)}><Copy size={12} style={{ marginRight:6 }} /> {t("properties.duplicate")}</ActionBtn>
          <ActionBtn onClick={() => removeElement(el.id)} danger><Trash2 size={12} style={{ marginRight:6 }} /> {t("properties.delete")}</ActionBtn>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean; }) {
  return (
    <button type="button" onClick={onClick}
      style={{ width:"100%",borderRadius:10,padding:"10px 14px",fontSize:12,fontWeight:600,border:"1px solid #f0f0f0",background:danger?"#fef2f2":"#fafafa",color:danger?"#ef4444":"#4b5563",cursor:"pointer",transition:"all 0.15s",textAlign:"left",display:"flex",alignItems:"center" }}
      onMouseEnter={(e) => { e.currentTarget.style.background=danger?"#fee2e2":"#f3f4f6"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background=danger?"#fef2f2":"#fafafa"; }}>
      {children}
    </button>
  );
}
