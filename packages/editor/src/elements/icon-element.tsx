/* ─────────────────────────────────────────────
 * Icon Element — Universal SVG icon library (Lucide)
 * ──────────────────────────────────────────── */

"use client";

import React, { useState, useMemo } from "react";
// Static named imports avoid lucide-react's lazy `icons` registry, which trips
// Turbopack chunking on prod (e.g. "module factory is not available" for QrCode).
import {
  Activity, AlertCircle, AlertTriangle, AlignCenter, AlignJustify, AlignLeft, AlignRight, Apple,
  Archive, ArrowBigLeft, ArrowBigRight, ArrowDown, ArrowDownLeft, ArrowDownRight, ArrowLeft, ArrowRight,
  ArrowUp, ArrowUpLeft, ArrowUpRight, AtSign, Atom, Award, BadgeCheck, BadgeDollarSign,
  Banknote, BarChart2, BarChart3, Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium,
  BatteryWarning, Bell, Bike, Bold, Bolt, Book, BookOpen, Bookmark,
  Box, Briefcase, Building, Building2, Calendar, CalendarDays, Camera, Car,
  Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ChevronsDown, ChevronsLeft, ChevronsRight,
  ChevronsUp, Chrome, Circle, CircleDollarSign, Clipboard, Clock, Cloud, CloudDrizzle,
  CloudFog, CloudHail, CloudLightning, CloudMoon, CloudOff, CloudRain, CloudSnow, CloudSun,
  Code, Coffee, Cog, Compass, Copy, CornerDownRight, Cpu, CreditCard,
  Crown, Diamond, DollarSign, Download, Dribbble, Droplet, Droplets, Earth,
  ExternalLink, Eye, EyeOff, Facebook, Figma, File, FileText, Filter,
  Fingerprint, Flag, Flame, Flashlight, FlashlightOff, Flower2, Folder, FolderOpen,
  Forward, Gem, Gift, GitBranch, Github, Globe, GraduationCap, Grid3X3,
  Hammer, HardDrive, Hash, Heading, Headphones, Heart, HeartHandshake, HelpCircle,
  Home, Image, Inbox, Info, Instagram, Italic, Key, Laptop,
  LayoutDashboard, LayoutGrid, Leaf, Lightbulb, LightbulbOff, LineChart, Link, Linkedin,
  List, Loader2, Locate, Lock, Mail, MailOpen, Map, MapPin,
  Maximize, Medal, Megaphone, Menu, MessageCircle, MessageSquare, MessagesSquare, Mic,
  MicOff, Minimize, Minus, Monitor, Moon, MoreHorizontal, MoreVertical, Move,
  MoveDown, MoveLeft, MoveRight, MoveUp, Music, Navigation, Newspaper, Package,
  Paintbrush, Palette, Pause, Pen, Pencil, Phone, PhoneCall, PieChart,
  Pizza, Plane, Play, Plug, PlugZap, Plus, Podcast, Power,
  PowerOff, QrCode, Quote, Radiation, Radio, RadioTower, Rainbow, Receipt,
  Redo2, RefreshCw, Repeat, Reply, Rocket, RotateCcw, RotateCw, Rss,
  Search, Send, Settings, Settings2, Share, Share2, Shield, ShieldAlert,
  ShieldCheck, Ship, ShoppingBag, ShoppingCart, Shuffle, Signal, SignalHigh, SignalLow,
  SignalMedium, Slack, SlidersHorizontal, Smartphone, Snowflake, Sparkle, Sparkles, Square,
  Star, Store, Sun, Sunrise, Sunset, Tablet, Target, Terminal,
  Thermometer, ThermometerSnowflake, ThermometerSun, ThumbsDown, ThumbsUp, Timer, ToggleLeft, ToggleRight,
  Train, Trees, TrendingDown, TrendingUp, Triangle, Trophy, Truck, Twitch,
  Twitter, Type, Umbrella, UmbrellaOff, Underline, Undo2, Unlock, Upload,
  User, UserCheck, UserMinus, UserPlus, Users, UtensilsCrossed, Video, Volume2,
  VolumeX, Wallet, Waves, Wifi, Wind, Wrench, X, Youtube,
  Zap, ZapOff, ZoomIn, ZoomOut,
} from "lucide-react";
import { registerElement, type ElementRenderProps, type PropertyPanelProps } from "./registry";

type LucideIconComp = React.ComponentType<{ size?: number; color?: string }>;
const LUCIDE_ICONS: Record<string, LucideIconComp> = {
  Activity, AlertCircle, AlertTriangle, AlignCenter, AlignJustify, AlignLeft, AlignRight, Apple,
  Archive, ArrowBigLeft, ArrowBigRight, ArrowDown, ArrowDownLeft, ArrowDownRight, ArrowLeft, ArrowRight,
  ArrowUp, ArrowUpLeft, ArrowUpRight, AtSign, Atom, Award, BadgeCheck, BadgeDollarSign,
  Banknote, BarChart2, BarChart3, Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium,
  BatteryWarning, Bell, Bike, Bold, Bolt, Book, BookOpen, Bookmark,
  Box, Briefcase, Building, Building2, Calendar, CalendarDays, Camera, Car,
  Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, ChevronsDown, ChevronsLeft, ChevronsRight,
  ChevronsUp, Chrome, Circle, CircleDollarSign, Clipboard, Clock, Cloud, CloudDrizzle,
  CloudFog, CloudHail, CloudLightning, CloudMoon, CloudOff, CloudRain, CloudSnow, CloudSun,
  Code, Coffee, Cog, Compass, Copy, CornerDownRight, Cpu, CreditCard,
  Crown, Diamond, DollarSign, Download, Dribbble, Droplet, Droplets, Earth,
  ExternalLink, Eye, EyeOff, Facebook, Figma, File, FileText, Filter,
  Fingerprint, Flag, Flame, Flashlight, FlashlightOff, Flower2, Folder, FolderOpen,
  Forward, Gem, Gift, GitBranch, Github, Globe, GraduationCap, Grid3X3,
  Hammer, HardDrive, Hash, Heading, Headphones, Heart, HeartHandshake, HelpCircle,
  Home, Image, Inbox, Info, Instagram, Italic, Key, Laptop,
  LayoutDashboard, LayoutGrid, Leaf, Lightbulb, LightbulbOff, LineChart, Link, Linkedin,
  List, Loader2, Locate, Lock, Mail, MailOpen, Map, MapPin,
  Maximize, Medal, Megaphone, Menu, MessageCircle, MessageSquare, MessagesSquare, Mic,
  MicOff, Minimize, Minus, Monitor, Moon, MoreHorizontal, MoreVertical, Move,
  MoveDown, MoveLeft, MoveRight, MoveUp, Music, Navigation, Newspaper, Package,
  Paintbrush, Palette, Pause, Pen, Pencil, Phone, PhoneCall, PieChart,
  Pizza, Plane, Play, Plug, PlugZap, Plus, Podcast, Power,
  PowerOff, QrCode, Quote, Radiation, Radio, RadioTower, Rainbow, Receipt,
  Redo2, RefreshCw, Repeat, Reply, Rocket, RotateCcw, RotateCw, Rss,
  Search, Send, Settings, Settings2, Share, Share2, Shield, ShieldAlert,
  ShieldCheck, Ship, ShoppingBag, ShoppingCart, Shuffle, Signal, SignalHigh, SignalLow,
  SignalMedium, Slack, SlidersHorizontal, Smartphone, Snowflake, Sparkle, Sparkles, Square,
  Star, Store, Sun, Sunrise, Sunset, Tablet, Target, Terminal,
  Thermometer, ThermometerSnowflake, ThermometerSun, ThumbsDown, ThumbsUp, Timer, ToggleLeft, ToggleRight,
  Train, Trees, TrendingDown, TrendingUp, Triangle, Trophy, Truck, Twitch,
  Twitter, Type, Umbrella, UmbrellaOff, Underline, Undo2, Unlock, Upload,
  User, UserCheck, UserMinus, UserPlus, Users, UtensilsCrossed, Video, Volume2,
  VolumeX, Wallet, Waves, Wifi, Wind, Wrench, X, Youtube,
  Zap, ZapOff, ZoomIn, ZoomOut,
};

/* ─── Icon Categories ─────────────────────────── */

/* Helper: detect if a string is an emoji (non-ASCII start) */
function isEmoji(s: string): boolean {
  return /^[\p{Emoji}\u200d\ufe0f]/u.test(s);
}

const ICON_CATEGORIES: Record<string, string[]> = {
  "⚡ Energy": [
    "Zap","ZapOff","Flame","Sparkles","Sparkle","Sun","Sunrise","Sunset",
    "Moon","Star","Rocket","Bolt","Power","PowerOff","Battery","BatteryCharging",
    "BatteryFull","BatteryLow","BatteryMedium","BatteryWarning","Plug","PlugZap",
    "Lightbulb","LightbulbOff","Flashlight","FlashlightOff","Activity","Atom",
    "Radiation","RadioTower","Signal","SignalHigh","SignalLow","SignalMedium",
  ],
  "☁️ Weather": [
    "Cloud","CloudSun","CloudMoon","CloudRain","CloudSnow","CloudLightning",
    "CloudDrizzle","CloudFog","CloudHail","CloudOff","Sun","Moon","Sunrise",
    "Sunset","Thermometer","ThermometerSun","ThermometerSnowflake","Snowflake",
    "Wind","Rainbow","Umbrella","UmbrellaOff","Droplets","Droplet","Waves",
  ],
  "Common": [
    "Home","Search","Settings","User","Heart","Star","Bell","Mail",
    "Phone","Camera","Image","Video","Music","Play","Pause","Square",
    "Circle","Triangle","Check","X","Plus","Minus","ChevronRight",
    "ChevronLeft","ChevronDown","ChevronUp","ArrowRight","ArrowLeft",
    "ArrowUp","ArrowDown","ExternalLink","Link","Copy","Clipboard",
    "Download","Upload","Share2","Send","Bookmark","Flag",
  ],
  "Social": [
    "Facebook","Instagram","Twitter","Linkedin","Youtube","Github",
    "Twitch","Figma","Chrome","Slack","Dribbble",
    "ThumbsUp","ThumbsDown","Users","UserPlus","UserMinus","UserCheck",
    "Heart","HeartHandshake","Share","Share2","Forward","Reply",
  ],
  "Business": [
    "Briefcase","Building2","Building","Store","ShoppingCart","ShoppingBag",
    "CreditCard","Wallet","Banknote","DollarSign","CircleDollarSign",
    "Receipt","FileText","File","Folder","FolderOpen","Archive",
    "BarChart3","BarChart2","LineChart","PieChart","TrendingUp",
    "TrendingDown","Target","Award","Trophy","Medal","Crown",
    "BadgeCheck","BadgeDollarSign","Gem","Diamond",
  ],
  "Interface": [
    "Eye","EyeOff","Lock","Unlock","Key","Shield","ShieldCheck",
    "ShieldAlert","AlertCircle","AlertTriangle","Info","HelpCircle",
    "Loader2","RefreshCw","Clock","Timer","Calendar","CalendarDays",
    "Filter","SlidersHorizontal","Settings2","Wrench","Hammer",
    "Cog","ToggleLeft","ToggleRight","Power","Zap","Sparkles",
  ],
  "Navigation": [
    "Menu","MoreHorizontal","MoreVertical","Grid3X3","List",
    "LayoutGrid","LayoutDashboard","Compass","Map","MapPin","Navigation",
    "Globe","Earth","Locate","Move","Maximize","Minimize",
    "ZoomIn","ZoomOut","RotateCcw","RotateCw",
  ],
  "Communication": [
    "MessageCircle","MessageSquare","MessagesSquare","Inbox","MailOpen",
    "AtSign","Hash","Megaphone","Radio","Podcast","Rss","Wifi",
    "Smartphone","Tablet","Monitor","Laptop","Headphones",
    "Mic","MicOff","PhoneCall","Volume2","VolumeX",
  ],
  "Arrows": [
    "ArrowRight","ArrowLeft","ArrowUp","ArrowDown","ArrowUpRight",
    "ArrowDownRight","ArrowUpLeft","ArrowDownLeft","MoveRight",
    "MoveLeft","MoveUp","MoveDown","ChevronsRight","ChevronsLeft",
    "ChevronsUp","ChevronsDown","ArrowBigRight","ArrowBigLeft",
    "Undo2","Redo2","CornerDownRight","Repeat","Shuffle","GitBranch",
  ],
  "Content": [
    "Type","Heading","AlignLeft","AlignCenter","AlignRight","AlignJustify",
    "Bold","Italic","Underline","Quote","Code","Terminal","Pen","Pencil",
    "Paintbrush","Palette","Newspaper","BookOpen","Book","GraduationCap",
  ],
  "Objects": [
    "Package","Box","Gift","Truck","Car","Plane","Train","Ship",
    "Rocket","Bike","Coffee","UtensilsCrossed","Pizza","Apple","Leaf",
    "Trees","Flower2","Lightbulb","Cpu","HardDrive","QrCode","Fingerprint",
  ],
  "😀 Smileys": [
    "😀","😃","😄","😁","😆","😅","🤣","😂","🙂","😉","😊","😇",
    "🥰","😍","🤩","😘","😋","😎","🤓","🧐","🤔","🤗","🤫","🤭",
    "😐","😑","😶","😏","😒","🙄","😬","😮","😯","😲","😳","🥺",
    "😢","😭","😤","😠","😡","🤬","😈","👿","💀","☠️","💩","🤡",
    "👻","👽","🤖","😺","😸","😹","😻","😼","😽","🙀","😿","😾",
  ],
  "👋 Hands": [
    "👋","🤚","🖐️","✋","🖖","👌","🤌","🤏","✌️","🤞","🤟","🤘",
    "🤙","👈","👉","👆","👇","☝️","👍","👎","✊","👊","🤛","🤜",
    "👏","🙌","👐","🤲","🤝","🙏","💪","🦾","✍️","🫶","🫰","🫵",
  ],
  "🌿 Nature": [
    "🌱","🌿","☘️","🍀","🌵","🌲","🌳","🌴","🌸","💐","🌷","🌹",
    "🌺","🌻","🌼","🍁","🍂","🍃","🌍","🌎","🌏","🌙","⭐","🌟",
    "✨","⚡","🔥","💧","🌊","❄️","☀️","🌤️","⛅","🌈","🦋","🐝",
  ],
  "🍕 Food": [
    "🍎","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍑","🥭","🍍","🥥",
    "🥝","🍅","🥑","🌶️","🌽","🥕","🥦","🧄","🍕","🍔","🍟","🌭",
    "🍿","🧁","🍰","🎂","🍩","🍪","🍫","☕","🍵","🧃","🥤","🍺",
  ],
  "✈️ Travel": [
    "🚗","🚕","🚌","🏎️","🚓","🚑","🚒","🛻","🚚","🚃","🚄","✈️",
    "🚀","🛸","🚁","⛵","🚢","🏠","🏢","🏗️","🏭","🏰","🗼","🗽",
    "⛪","🕌","🏥","🏦","🏨","🏪","🏫","🏟️","🎡","🎢","🎠","⛱️",
  ],
  "🎯 Symbols": [
    "❤️","🧡","💛","💚","💙","💜","🖤","🤍","💔","❣️","💕","💞",
    "💓","💗","💖","💘","💝","💟","☮️","✝️","☪️","🕉️","☯️","✡️",
    "⚛️","♻️","⚠️","🚫","❌","⭕","✅","☑️","✔️","❗","❓","⁉️",
    "💯","🔴","🟠","🟡","🟢","🔵","🟣","⚫","⬛","🟥","🟧","🟨",
    "⬜","🔶","🔷","🔸","🔹","▪️","▫️","◽","◾","🔲","🔳","💠",
    "🏆","🥇","🥈","🥉","🎯","🎪","🎨","🎭","🎬","🎤","🎧","🎵",
    "🎶","🎸","🥁","🎹","🎮","🕹️","🎲","🧩","🎰","📱","💻","⌨️",
    "🖥️","🖨️","📷","📸","📹","🎥","📡","🔔","📢","📣","💡","🔦",
    "🔑","🗝️","🔒","🔓","🛡️","⚔️","💣","🧲","⚙️","🔧","🔨","⛏️",
  ],
};

const ALL_ICON_NAMES = [...new Set(Object.values(ICON_CATEGORIES).flat())];
const CATEGORY_NAMES = Object.keys(ICON_CATEGORIES);

/* ─── Render an icon by name (Lucide SVG or emoji) ── */

function IconRenderer({ name, size, color }: { name: string; size: number; color: string }) {
  if (isEmoji(name)) {
    return <span style={{ fontSize: size, lineHeight: 1 }}>{name}</span>;
  }
  const IconComp = LUCIDE_ICONS[name];
  if (!IconComp) return <span style={{ fontSize: size, color }}>{name}</span>;
  return <IconComp size={size} color={color} />;
}

/* ─── Component ─────────────────────────────── */

function IconElementComponent({ props, scaleFactor = 1 }: ElementRenderProps) {
  const iconName = (props.icon as string) || "Star";
  const color = (props.color as string) || "#3b82f6";
  const iconSize = (props.fontSize as number) || 48;
  const bgColor = (props.bgColor as string) || "transparent";
  const borderRadius = (props.borderRadius as number) || 12;
  const grayscale = !!props.grayscale;

  const scaledSize = Math.round(iconSize * scaleFactor);
  const emojiIcon = isEmoji(iconName);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bgColor,
        borderRadius,
        filter: grayscale && emojiIcon ? "grayscale(1)" : undefined,
      }}
    >
      <IconRenderer name={iconName} size={scaledSize} color={color} />
    </div>
  );
}

/* ─── Property Panel ────────────────────────── */

function IconPropertyPanel({ props, onChange }: PropertyPanelProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Common");
  const currentIcon = (props.icon as string) || "Star";

  const filteredIcons = useMemo(() => {
    if (search.trim()) {
      return ALL_ICON_NAMES.filter((n) => n.toLowerCase().includes(search.toLowerCase()));
    }
    return ICON_CATEGORIES[activeCategory] || [];
  }, [search, activeCategory]);

  return (
    <div className="space-y-3">
      {/* Current icon display */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10, padding: 10,
        background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: (props.bgColor as string) || "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <IconRenderer name={currentIcon} size={22} color={(props.color as string) || "#3b82f6"} />
        </div>
        <div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{currentIcon}</span>
          <span style={{ display: "block", fontSize: 10, color: "#94a3b8" }}>Selected icon</span>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Search icons & emojis..."
          className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          style={{ paddingLeft: 32 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 14 }}>🔍</span>
      </div>

      {/* Category tabs */}
      {!search && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {CATEGORY_NAMES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "3px 8px", fontSize: 10, fontWeight: 600, borderRadius: 6,
                border: "1px solid", cursor: "pointer", transition: "all 0.15s",
                background: activeCategory === cat ? "#3b82f6" : "#f8fafc",
                color: activeCategory === cat ? "#fff" : "#64748b",
                borderColor: activeCategory === cat ? "#3b82f6" : "#e2e8f0",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Icon grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4,
        maxHeight: 240, overflowY: "auto", padding: 2,
      }}>
        {filteredIcons.map((name) => {
          const isSelected = currentIcon === name;
          return (
            <button
              key={name}
              type="button"
              title={name}
              onClick={() => onChange({ icon: name })}
              style={{
                width: "100%", aspectRatio: "1", display: "flex",
                alignItems: "center", justifyContent: "center",
                borderRadius: 8, border: `1.5px solid ${isSelected ? "#3b82f6" : "#e5e7eb"}`,
                background: isSelected ? "#eff6ff" : "#fafafa",
                cursor: "pointer", transition: "all 0.12s",
                color: isSelected ? "#3b82f6" : "#6b7280",
              }}
            >
              <IconRenderer name={name} size={16} color={isSelected ? "#3b82f6" : "#6b7280"} />
            </button>
          );
        })}
        {filteredIcons.length === 0 && (
          <div style={{ gridColumn: "1/-1", padding: 16, textAlign: "center", color: "#9ca3af", fontSize: 12 }}>
            No icons found
          </div>
        )}
      </div>

      {/* Size */}
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Size</span>
        <input type="number" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.fontSize as number) || 48}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          min={12} max={200}
        />
      </label>

      {/* Color */}
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Color</span>
        <div className="mt-1 flex gap-2 items-center">
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200"
            value={(props.color as string) || "#3b82f6"}
            onChange={(e) => onChange({ color: e.target.value })}
          />
          <input type="text" className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            value={(props.color as string) || "#3b82f6"}
            onChange={(e) => onChange({ color: e.target.value })}
          />
        </div>
      </label>

      {/* Background */}
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Background</span>
        <div className="mt-1 flex gap-2 items-center">
          <input type="color" className="h-8 w-8 cursor-pointer rounded border border-gray-200"
            value={(props.bgColor as string) || "#ffffff"}
            onChange={(e) => onChange({ bgColor: e.target.value })}
          />
          <button type="button" className="text-xs text-gray-500 hover:text-gray-700"
            onClick={() => onChange({ bgColor: "transparent" })}>Clear</button>
        </div>
      </label>

      {/* Border Radius */}
      <label className="block">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Border Radius</span>
        <input type="number" className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
          value={(props.borderRadius as number) || 12}
          onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
          min={0} max={999}
        />
      </label>

      {/* Grayscale toggle — only for emojis */}
      {isEmoji((props.icon as string) || "") && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Black & White</span>
          <button
            type="button"
            onClick={() => onChange({ grayscale: !props.grayscale })}
            style={{
              width: 36, height: 20, borderRadius: 10, border: "none",
              cursor: "pointer", position: "relative",
              background: props.grayscale ? "#3b82f6" : "#d1d5db",
              transition: "background 0.2s",
            }}
          >
            <span style={{
              position: "absolute", top: 2,
              left: props.grayscale ? 18 : 2,
              width: 16, height: 16, borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
              transition: "left 0.2s",
            }} />
          </button>
        </div>
      )}
    </div>
  );
}

registerElement({
  type: "icon",
  label: "Icon",
  icon: <Sparkles size={16} />,
  category: "content",
  defaultProps: { icon: "Star", color: "#3b82f6", fontSize: 48, bgColor: "transparent", borderRadius: 12, grayscale: false },
  defaultTransform: { width: 64, height: 64 },
  component: IconElementComponent,
  propertyPanel: IconPropertyPanel,
});
