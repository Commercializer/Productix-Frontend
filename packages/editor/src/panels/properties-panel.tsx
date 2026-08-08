/* ─────────────────────────────────────────────
 * Block Settings Panel - Light theme
 *
 * Multilingual content editing: when a non-EN
 * locale is active, the panel shows the localized
 * values and a visual indicator of the active language.
 * ──────────────────────────────────────────── */

"use client";

import React from "react";
import { MousePointer, ArrowUp, ArrowDown, Copy, Trash2, Globe, Link as LinkIcon, TriangleAlert } from "lucide-react";
import { useCanvasStore } from "../engine/canvas-store";
import { getElementDefinition } from "../elements/registry";
import { useTranslation } from "../i18n";
import { getLocalizedProps } from "../utils/localize-props";
import { getContentLocaleMeta } from "@productix/types";

const BLOCK_LABELS: Record<string, string> = {
  text:"Product Text", heading:"Product Title", image:"Product Image", button:"CTA Button",
  card:"Feature Card", icon:"Icon", badge:"Badge", "social-group":"Social Links",
  "social-facebook":"Facebook", "social-instagram":"Instagram", "social-twitter":"X / Twitter",
  "social-linkedin":"LinkedIn", "social-youtube":"YouTube", "social-tiktok":"TikTok",
  "social-github":"GitHub", "social-whatsapp":"WhatsApp", "social-threads":"Threads",
  "social-website":"Website", "social-email":"Email", "social-phone":"Phone",
  "whatsapp-button":"WhatsApp Chat",
  "stat-card":"Key Stat", "promo-card":"Highlight Card", divider:"Divider",
  container:"Section Block", row:"Content Row", column:"Column",
};

export function PropertiesPanel() {
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const elements = useCanvasStore((s) => s.document.elements);
  const productHasGtin = useCanvasStore((s) => s.productHasGtin);
  const updateElementProps = useCanvasStore((s) => s.updateElementProps);
  const updateElement = useCanvasStore((s) => s.updateElement);
  const updateElementTransform = useCanvasStore((s) => s.updateElementTransform);
  const removeElement = useCanvasStore((s) => s.removeElement);
  const duplicateElement = useCanvasStore((s) => s.duplicateElement);
  const bringForward = useCanvasStore((s) => s.bringForward);
  const sendBackward = useCanvasStore((s) => s.sendBackward);
  const contentLocale = useCanvasStore((s) => s.contentLocale);
  const { t } = useTranslation();

  const localeMeta = getContentLocaleMeta(contentLocale);
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
    // Check if all selected elements share the same group
    const selectedEls = selectedIds.map((id) => elements[id]).filter(Boolean);
    const commonGroupId = selectedEls[0]?.groupId;
    const allSameGroup = commonGroupId && selectedEls.every((el) => el?.groupId === commonGroupId);
    const groupInfo = allSameGroup ? useCanvasStore.getState().document.groups?.[commonGroupId] : null;

    return (
      <div style={{ display:"flex",flexDirection:"column",height:"100%" }}>
        <div style={{ padding:"16px 20px 12px",borderBottom:"1px solid #f0f0f0" }}>
          <h2 style={{ fontSize:14,fontWeight:700,color:"#1e1e2e",margin:0 }}>{t("blockSettings.title")}</h2>
        </div>
        <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 24px",gap:12 }}>
          <div style={{ width:48,height:48,borderRadius:14,background:"linear-gradient(135deg,#8b5cf620,#ec489920)",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <span style={{ fontSize:18,fontWeight:700,color:"#8b5cf6" }}>{selectedIds.length}</span>
          </div>
          <p style={{ fontSize:13,color:"#4b5563",fontWeight:600,textAlign:"center" }}>
            {selectedIds.length} blocks selected
          </p>
          {allSameGroup && groupInfo ? (
            <>
              <div style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:10,background:"#f5f3ff",border:"1px solid #ddd6fe" }}>
                <span style={{ fontSize:11,fontWeight:600,color:"#8b5cf6" }}>⊞ {groupInfo.name}</span>
              </div>
              <button type="button" onClick={() => useCanvasStore.getState().ungroupElements(commonGroupId)}
                style={{ display:"flex",alignItems:"center",gap:6,width:"100%",padding:"12px 16px",borderRadius:12,border:"1px solid #fecaca",background:"#fef2f2",color:"#ef4444",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.15s",justifyContent:"center" }}
                onMouseEnter={(e) => { e.currentTarget.style.background="#fee2e2"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background="#fef2f2"; }}
              >
                Ungroup Blocks
              </button>
            </>
          ) : (
            <>
              <p style={{ fontSize:10,color:"#9ca3af",textAlign:"center" }}>
                Select 2+ blocks to group them together
              </p>
              {selectedIds.length >= 2 && (
                <button type="button" onClick={() => useCanvasStore.getState().groupElements(selectedIds)}
                  style={{ display:"flex",alignItems:"center",gap:6,width:"100%",padding:"12px 16px",borderRadius:12,border:"1px solid #ddd6fe",background:"#f5f3ff",color:"#8b5cf6",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.15s",justifyContent:"center" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background="#ede9fe"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background="#f5f3ff"; }}
                >
                  ⊞ Group Selected Blocks
                </button>
              )}
            </>
          )}
          <p style={{ fontSize:9,color:"#d1d5db",textAlign:"center",marginTop:4 }}>
            ⌘G to group · ⌘⇧G to ungroup
          </p>
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

      {/* No-GTIN warning - this block reads live from the product record and
          renders nothing on the live page until one is set. */}
      {el.type === "gtin-badge" && !productHasGtin && (
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          padding: "10px 16px",
          background: "#fffbeb",
          borderBottom: "1px solid #fde68a",
        }}>
          <TriangleAlert size={13} style={{ color: "#b45309", flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 11, color: "#92400e", lineHeight: 1.5 }}>
            This product doesn&apos;t have a GTIN yet, so this badge won&apos;t appear on the live page. Add a GTIN in the product&apos;s settings first.
          </span>
        </div>
      )}

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
          <label style={{ display:"block",marginTop:12 }}>
            <span style={{ fontSize:11,color:"#6b7280",fontWeight:500 }}>Rotation</span>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:4 }}>
              <input type="range" style={{ flex:1,accentColor:"#0ea5e9" }} value={el.transform.rotation} onChange={(e) => updateElementTransform(el.id, { rotation:Number(e.target.value) })} min={-180} max={180} step={1} />
              <div style={{ display:"flex",alignItems:"center",gap:2 }}>
                <input
                  type="number"
                  value={el.transform.rotation}
                  onChange={(e) => updateElementTransform(el.id, { rotation:Math.max(-180,Math.min(180,Number(e.target.value)||0)) })}
                  min={-180}
                  max={180}
                  step={1}
                  style={{ width:44,fontSize:11,color:"#374151",border:"1px solid #e5e7eb",borderRadius:4,padding:"2px 4px",textAlign:"right" }}
                />
                <span style={{ fontSize:11,color:"#9ca3af" }}>°</span>
              </div>
            </div>
          </label>
        </div>
        <div style={{ height:1,background:"#f0f0f0" }} />
        <div>
          <h3 style={{ fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10,display:"flex",alignItems:"center",gap:6 }}>
            <LinkIcon size={11} /> Link
          </h3>
          <label style={{ display:"block" }}>
            <span style={{ fontSize:11,color:"#6b7280",fontWeight:500 }}>URL (optional)</span>
            <input
              type="text"
              placeholder="https://example.com"
              value={el.link || ""}
              onChange={(e) => updateElement(el.id, { link: e.target.value })}
              style={{ marginTop:4,width:"100%",borderRadius:8,border:"1px solid #e5e7eb",background:"#fff",padding:"8px 10px",fontSize:12,outline:"none" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#0ea5e9"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}
            />
          </label>
          {el.link && (
            <label style={{ display:"block",marginTop:8 }}>
              <span style={{ fontSize:11,color:"#6b7280",fontWeight:500 }}>Opens in</span>
              <select
                value={el.linkTarget || "_blank"}
                onChange={(e) => updateElement(el.id, { linkTarget: e.target.value as "_self" | "_blank" })}
                style={{ marginTop:4,width:"100%",borderRadius:8,border:"1px solid #e5e7eb",background:"#fff",padding:"8px 10px",fontSize:12,outline:"none",cursor:"pointer" }}
              >
                <option value="_blank">New tab</option>
                <option value="_self">Same tab</option>
              </select>
            </label>
          )}
          {el.type === "button" && el.link && (
            <p style={{ fontSize:10,color:"#9ca3af",marginTop:6,lineHeight:1.4 }}>
              Tip: buttons already have a URL field above. This block-level link is ignored on buttons to avoid duplicate links.
            </p>
          )}
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
