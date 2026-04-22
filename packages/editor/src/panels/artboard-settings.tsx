/* ─────────────────────────────────────────────
 * Experience Canvas Settings — Light theme
 * ──────────────────────────────────────────── */

"use client";

import React, { useState } from "react";
import { Smartphone, Monitor, TabletSmartphone, Minimize2, Sparkles } from "lucide-react";
import { useCanvasStore } from "../engine/canvas-store";
import { ImageUploadWidget } from "../media/image-upload-widget";
import { useTranslation } from "../i18n";
import type { CanvasEffect } from "@productix/types";
import { CANVAS_EFFECTS } from "@productix/types";

const MOBILE_PRESETS = [
  { label: "iPhone", width: 375, height: 812, icon: <Smartphone size={14} /> },
  { label: "iPhone Pro Max", width: 428, height: 926, icon: <Monitor size={14} /> },
  { label: "Android", width: 360, height: 800, icon: <TabletSmartphone size={14} /> },
  { label: "Compact", width: 320, height: 568, icon: <Minimize2 size={14} /> },
];

export function ArtboardSettings() {
  const document = useCanvasStore((s) => s.document);
  const activeArtboardId = useCanvasStore((s) => s.activeArtboardId);
  const updateArtboard = useCanvasStore((s) => s.updateArtboard);
  const { t } = useTranslation();
  const ab = document.artboards.find((a) => a.id === activeArtboardId) || document.artboards[0];
  if (!ab) return null;

  return (
    <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
      <div style={{ padding:"16px 20px 12px",borderBottom:"1px solid #f0f0f0" }}>
        <h2 style={{ fontSize:14,fontWeight:700,color:"#1e1e2e",margin:0 }}>{t("experience.title")}</h2>
      </div>
      <div style={{ padding:"0 16px",display:"flex",flexDirection:"column",gap:16 }}>
        <label style={{ display:"block" }}>
          <span style={{ fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em" }}>{t("experience.name")}</span>
          <input type="text" style={{ marginTop:4,width:"100%",borderRadius:10,border:"1px solid #e5e7eb",background:"#fff",padding:"8px 12px",fontSize:13,color:"#1e1e2e",outline:"none" }} value={ab.name} onChange={(e) => updateArtboard(ab.id, { name: e.target.value })} />
        </label>
        <div>
          <span style={{ fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em" }}>{t("experience.screenSize")}</span>
          <div style={{ marginTop:8,display:"flex",flexWrap:"wrap",gap:6 }}>
            {MOBILE_PRESETS.map((p) => {
              const isActive = ab.width===p.width && ab.height===p.height;
              return (
                <button key={p.label} type="button" onClick={() => updateArtboard(ab.id, { width:p.width, height:p.height })}
                  style={{ borderRadius:10,padding:"8px 14px",fontSize:11,fontWeight:600,border:isActive?"1px solid #bae6fd":"1px solid #e5e7eb",background:isActive?"#e0f2fe":"#fafafa",color:isActive?"#0ea5e9":"#6b7280",cursor:"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",gap:6 }}>
                  <span style={{ display:"flex",alignItems:"center" }}>{p.icon}</span>{p.label}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
          <label style={{ display:"block" }}>
            <span style={{ fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em" }}>Width</span>
            <input type="number" style={{ marginTop:4,width:"100%",borderRadius:10,border:"1px solid #e5e7eb",background:"#fff",padding:"8px 12px",fontSize:13,color:"#1e1e2e",outline:"none" }} value={ab.width} onChange={(e) => updateArtboard(ab.id, { width:Math.max(200,Number(e.target.value)) })} />
          </label>
          <label style={{ display:"block" }}>
            <span style={{ fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em" }}>Height</span>
            <input type="number" style={{ marginTop:4,width:"100%",borderRadius:10,border:"1px solid #e5e7eb",background:"#fff",padding:"8px 12px",fontSize:13,color:"#1e1e2e",outline:"none" }} value={ab.height} onChange={(e) => updateArtboard(ab.id, { height:Math.max(200,Number(e.target.value)) })} />
          </label>
        </div>
        <label style={{ display:"block" }}>
          <span style={{ fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em" }}>{t("experience.background")}</span>
          <div style={{ marginTop:4,display:"flex",gap:8,alignItems:"center" }}>
            <input type="color" style={{ height:32,width:32,cursor:"pointer",borderRadius:8,border:"1px solid #e5e7eb" }} value={ab.backgroundColor} onChange={(e) => updateArtboard(ab.id, { backgroundColor:e.target.value })} />
            <input type="text" style={{ flex:1,borderRadius:10,border:"1px solid #e5e7eb",background:"#fff",padding:"8px 12px",fontSize:12,color:"#1e1e2e",outline:"none" }} value={ab.backgroundColor} onChange={(e) => updateArtboard(ab.id, { backgroundColor:e.target.value })} />
          </div>
        </label>
        <ImageUploadWidget value={ab.backgroundImage||""} onChange={(url) => updateArtboard(ab.id, { backgroundImage:url||undefined })} label={t("experience.coverImage")} compact />

        {/* ── Canvas Effects ── */}
        <div>
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
            <div style={{
              width:24,height:24,borderRadius:7,
              background:"linear-gradient(135deg,#f59e0b,#fbbf24)",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 2px 8px rgba(245,158,11,0.25)",
            }}>
              <Sparkles size={12} color="#fff" />
            </div>
            <span style={{ fontSize:10,fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.08em" }}>
              Canvas Effects
            </span>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:6 }}>
            {CANVAS_EFFECTS.map((fx) => {
              const isActive = (ab.effect || "none") === fx.value;
              return (
                <button
                  key={fx.value}
                  type="button"
                  onClick={() => updateArtboard(ab.id, { effect: fx.value })}
                  style={{
                    display:"flex",flexDirection:"column",alignItems:"center",gap:4,
                    padding:"12px 6px 10px",borderRadius:12,cursor:"pointer",
                    border: isActive ? "1.5px solid #0ea5e9" : "1px solid #e5e7eb",
                    background: isActive ? "linear-gradient(135deg,#e0f2fe,#f0f9ff)" : "#fafafa",
                    boxShadow: isActive ? "0 2px 12px rgba(14,165,233,0.15)" : "none",
                    transition:"all 0.2s cubic-bezier(0.4,0,0.2,1)",
                    transform: isActive ? "scale(1.02)" : "scale(1)",
                    position:"relative",overflow:"hidden",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "#f0f9ff";
                      e.currentTarget.style.borderColor = "#bae6fd";
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(14,165,233,0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "#fafafa";
                      e.currentTarget.style.borderColor = "#e5e7eb";
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  {/* Active indicator dot */}
                  {isActive && (
                    <div style={{
                      position:"absolute",top:6,right:6,
                      width:6,height:6,borderRadius:"50%",
                      background:"#0ea5e9",
                      boxShadow:"0 0 6px rgba(14,165,233,0.5)",
                    }} />
                  )}
                  <span style={{ fontSize:20,lineHeight:1 }}>{fx.emoji}</span>
                  <span style={{
                    fontSize:10,fontWeight:isActive?700:600,
                    color:isActive?"#0369a1":"#4b5563",
                    lineHeight:1.2,
                  }}>{fx.label}</span>
                  <span style={{
                    fontSize:8,color:"#9ca3af",lineHeight:1.2,
                    fontWeight:500,
                  }}>{fx.description}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
