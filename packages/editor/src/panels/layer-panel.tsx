/* ─────────────────────────────────────────────
 * Block Order Panel - Light theme
 *
 * Shows all elements sorted by z-index with
 * group hierarchy. Grouped elements are visually
 * nested under their group header.
 * ──────────────────────────────────────────── */

"use client";

import React, { useCallback, useMemo } from "react";
import { Package, ChevronUp, ChevronDown, Group, Ungroup } from "lucide-react";
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

const GROUP_COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4", "#84cc16", "#f97316"];

function getGroupColor(groupId: string): string {
  let hash = 0;
  for (let i = 0; i < groupId.length; i++) {
    hash = ((hash << 5) - hash + groupId.charCodeAt(i)) | 0;
  }
  return GROUP_COLORS[Math.abs(hash) % GROUP_COLORS.length]!;
}

export function LayerPanel() {
  const document = useCanvasStore((s) => s.document);
  const selectedIds = useCanvasStore((s) => s.selectedIds);
  const select = useCanvasStore((s) => s.select);
  const bringForward = useCanvasStore((s) => s.bringForward);
  const sendBackward = useCanvasStore((s) => s.sendBackward);
  const ungroupElements = useCanvasStore((s) => s.ungroupElements);
  const { t } = useTranslation();

  const allElements = Object.values(document.elements).sort((a, b) => b.zIndex - a.zIndex);
  const handleSelect = useCallback((id: string, e: React.MouseEvent) => {
    // If element is in a group and not shift-clicking, select all group members
    const el = document.elements[id];
    if (el?.groupId && !e.shiftKey) {
      const group = document.groups?.[el.groupId];
      if (group && group.memberIds.length > 1) {
        useCanvasStore.setState({ selectedIds: [...group.memberIds], editingElementId: null });
        return;
      }
    }
    select(id, e.shiftKey);
  }, [select, document.elements, document.groups]);

  // Build rendering list: group elements together under group headers, supporting nesting
  const renderList = useMemo(() => {
    const groups = document.groups || {};
    const elements = document.elements;
    
    // Helper to get max zIndex of a group for sorting
    const getGroupZIndex = (groupId: string): number => {
      let maxZ = -1;
      const group = groups[groupId];
      if (!group) return maxZ;
      for (const mid of group.memberIds) {
        if (elements[mid]) maxZ = Math.max(maxZ, elements[mid]!.zIndex);
        else if (groups[mid]) maxZ = Math.max(maxZ, getGroupZIndex(mid));
      }
      return maxZ;
    };

    // Find all top-level entities (elements or groups that have no groupId)
    const topLevelEntities: { id: string; zIndex: number; isGroup: boolean }[] = [];
    
    for (const el of Object.values(elements)) {
      if (!el.groupId) topLevelEntities.push({ id: el.id, zIndex: el.zIndex, isGroup: false });
    }
    for (const group of Object.values(groups)) {
      if (!group.groupId) topLevelEntities.push({ id: group.id, zIndex: getGroupZIndex(group.id), isGroup: true });
    }
    
    topLevelEntities.sort((a, b) => b.zIndex - a.zIndex);

    type RenderItem = 
      | { type: "group-header"; groupId: string; name: string; color: string; memberCount: number; depth: number }
      | { type: "element"; el: typeof allElements[0]; depth: number }
      | { type: "group-end"; groupId: string; depth: number };

    const items: RenderItem[] = [];

    const renderNode = (id: string, isGroup: boolean, depth: number) => {
      if (!isGroup) {
        const el = elements[id];
        if (el) items.push({ type: "element", el, depth });
      } else {
        const group = groups[id];
        if (group) {
          // Resolve direct children for member count
          let leafCount = 0;
          const countLeaves = (gid: string) => {
            const g = groups[gid];
            if (g) {
              for (const mid of g.memberIds) {
                if (elements[mid]) leafCount++;
                else countLeaves(mid);
              }
            }
          };
          countLeaves(group.id);

          items.push({
            type: "group-header",
            groupId: group.id,
            name: group.name,
            color: getGroupColor(group.id),
            memberCount: leafCount,
            depth
          });
          
          // Sort children by zIndex
          const children = group.memberIds.map(mid => {
             if (elements[mid]) return { id: mid, isGroup: false, zIndex: elements[mid]!.zIndex };
             if (groups[mid]) return { id: mid, isGroup: true, zIndex: getGroupZIndex(mid) };
             return { id: mid, isGroup: false, zIndex: -1 };
          }).sort((a, b) => b.zIndex - a.zIndex);
          
          for (const child of children) {
            renderNode(child.id, child.isGroup, depth + 1);
          }
          
          items.push({ type: "group-end", groupId: group.id, depth });
        }
      }
    };

    for (const entity of topLevelEntities) {
      renderNode(entity.id, entity.isGroup, 0);
    }

    return items;
  }, [allElements, document.groups, document.elements]);

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
        {renderList.map((item, index) => {
          if (item.type === "group-header") {
            const isGroupSelected = (document.groups?.[item.groupId]?.memberIds || []).some(
              (id) => selectedIds.includes(id)
            );
            return (
              <div key={`gh-${item.groupId}`}
                style={{
                  display:"flex",alignItems:"center",gap:8,
                  padding:"8px 12px",marginBottom:2,marginTop:index > 0 ? 6 : 0,
                  marginLeft: item.depth * 16,
                  borderRadius:"12px 12px 0 0",
                  background: isGroupSelected ? `${item.color}10` : "#fafafa",
                  borderLeft:`3px solid ${item.color}`,
                  transition:"all 0.15s",
                }}
              >
                <span style={{
                  width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",
                  borderRadius:6,background:item.color,color:"#fff",flexShrink:0,fontSize:10,
                }}>
                  <Group size={12} />
                </span>
                <span style={{
                  flex:1,fontSize:11,fontWeight:700,color:item.color,
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                  textTransform:"uppercase",letterSpacing:"0.04em",
                }}>
                  {item.name}
                </span>
                <span style={{
                  fontSize:9,color:"#9ca3af",background:"#f0f0f0",
                  padding:"1px 6px",borderRadius:8,fontWeight:600,
                }}>
                  {item.memberCount}
                </span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); ungroupElements(item.groupId); }}
                  title="Ungroup"
                  style={{
                    width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",
                    borderRadius:6,border:"none",background:"transparent",cursor:"pointer",
                    color:"#9ca3af",transition:"all 0.15s",flexShrink:0,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background="#fee2e2"; e.currentTarget.style.color="#ef4444"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#9ca3af"; }}
                >
                  <Ungroup size={12} />
                </button>
              </div>
            );
          }

          if (item.type === "group-end") {
            return (
              <div key={`ge-${item.groupId}`}
                style={{ height:4,marginBottom:6, marginLeft: item.depth * 16, borderRadius:"0 0 12px 12px",background:"#fafafa",borderLeft:"3px solid #e5e7eb" }}
              />
            );
          }

          // Element row
          const el = item.el;
          const def = getElementDefinition(el.type);
          const isSelected = selectedIds.includes(el.id);
          const label = el.type==="text"||el.type==="heading"
            ? ((el.props.text as string)||BLOCK_LABELS[el.type]||def?.label||el.type).slice(0,28)
            : BLOCK_LABELS[el.type]||def?.label||el.type;
          const indented = item.depth > 0;
          const groupColor = el.groupId ? getGroupColor(el.groupId) : null;

          return (
            <div key={el.id} onClick={(e) => handleSelect(el.id,e)}
              style={{
                display:"flex",alignItems:"center",gap:10,
                padding:"10px 12px",
                marginLeft: item.depth * 16,
                paddingLeft: indented ? 12 : 12,
                marginBottom: indented ? 1 : 4,
                borderRadius: indented ? 4 : 12,
                cursor:"pointer",transition:"all 0.15s",
                background: isSelected ? (groupColor ? `${groupColor}15` : "#e0f2fe") : "transparent",
                border: isSelected
                  ? `1px solid ${groupColor ? groupColor + "44" : "#bae6fd"}`
                  : "1px solid transparent",
                borderLeft: indented ? `3px solid ${groupColor || "#e5e7eb"}` : (isSelected ? `1px solid ${groupColor ? groupColor + "44" : "#bae6fd"}` : "1px solid transparent"),
              }}
              onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background="#f9fafb"; }}
              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background="transparent"; }}>
              <span style={{ width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,background:"#f3f4f6",flexShrink:0,color:"#6b7280" }}>{def?.icon||"▪"}</span>
              <span style={{ flex:1,fontSize:12,fontWeight:isSelected?600:500,color:isSelected?(groupColor||"#0ea5e9"):"#4b5563",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",opacity:el.visible?1:0.4,textDecoration:el.visible?"none":"line-through" }}>{label}</span>
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
