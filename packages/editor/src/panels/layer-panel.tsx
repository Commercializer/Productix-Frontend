/* ─────────────────────────────────────────────
 * Block Order Panel — Light theme
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback } from "react";
import { Package, ChevronUp, ChevronDown } from "lucide-react";
import { useCanvasStore } from "../engine/canvas-store";
import { getElementDefinition } from "../elements/registry";
import { useTranslation } from "../i18n";

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

export function LayerPanel() {
  const document = useCanvasStore((s) => s.document);
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const select = useCanvasStore((s) => s.select);
  const bringForward = useCanvasStore((s) => s.bringForward);
  const sendBackward = useCanvasStore((s) => s.sendBackward);
  const { t } = useTranslation();

  const allElements = Object.values(document.elements).sort((a, b) => b.zIndex - a.zIndex);
  const handleSelect = useCallback((id: string, e: React.MouseEvent) => { select(id, e.shiftKey); }, [select]);

  if (allElements.length === 0) {
    return (
      <div style={{ padding:"32px 20px",textAlign:"center" }}>
        <div style={{ marginBottom:8,opacity:0.3,display:"flex",justifyContent:"center" }}><Package size={32} /></div>
        <p style={{ fontSize:12,color:"#9ca3af",fontWeight:500 }}>{t("blockOrder.empty")}</p>
        <p style={{ fontSize:10,color:"#d1d5db",marginTop:4 }}>{t("blockOrder.emptyHint")}</p>
      </div>
    );
  }

  return (
    <div style={{ display:"flex",flexDirection:"column" }}>
      <div style={{ padding:"16px 20px 12px",borderBottom:"1px solid #f0f0f0",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <h2 style={{ fontSize:14,fontWeight:700,color:"#1e1e2e",margin:0 }}>{t("blockOrder.title")}</h2>
        <span style={{ fontSize:11,color:"#9ca3af",background:"#f3f4f6",padding:"2px 8px",borderRadius:10,fontWeight:600 }}>{allElements.length}</span>
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:"8px 12px" }}>
        {allElements.map((el) => {
          const def = getElementDefinition(el.type);
          const isSelected = selectedIds.includes(el.id);
          const label = el.type==="text"||el.type==="heading"
            ? ((el.props.text as string)||BLOCK_LABELS[el.type]||def?.label||el.type).slice(0,28)
            : BLOCK_LABELS[el.type]||def?.label||el.type;
          return (
            <div key={el.id} onClick={(e) => handleSelect(el.id,e)}
              style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 12px",marginBottom:4,borderRadius:12,cursor:"pointer",transition:"all 0.15s",background:isSelected?"#e0f2fe":"transparent",border:isSelected?"1px solid #bae6fd":"1px solid transparent" }}
              onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background="#f9fafb"; }}
              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background=isSelected?"#e0f2fe":"transparent"; }}>
              <span style={{ width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,background:"#f3f4f6",flexShrink:0,color:"#6b7280" }}>{def?.icon||"▪"}</span>
              <span style={{ flex:1,fontSize:12,fontWeight:isSelected?600:500,color:isSelected?"#0ea5e9":"#4b5563",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",opacity:el.visible?1:0.4,textDecoration:el.visible?"none":"line-through" }}>{label}</span>
              <div style={{ display:"flex",gap:2,flexShrink:0 }}>
                <button type="button" onClick={(e) => { e.stopPropagation(); bringForward(el.id); }} style={{ width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:6,border:"none",background:"transparent",cursor:"pointer",color:"#9ca3af" }} title="Move up"><ChevronUp size={14} /></button>
                <button type="button" onClick={(e) => { e.stopPropagation(); sendBackward(el.id); }} style={{ width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:6,border:"none",background:"transparent",cursor:"pointer",color:"#9ca3af" }} title="Move down"><ChevronDown size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
