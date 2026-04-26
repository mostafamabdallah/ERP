"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faFloppyDisk, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { notification } from "antd";
import moment from "moment";
import "moment/locale/ar";

/* ─────────────────────── types ─────────────────────── */
interface PriceItem {
  id: string;
  nameAr: string;
  emoji: string;
  price: string;
  unit: string;
}

interface Category {
  id: string;
  nameAr: string;       // short – used in edit UI
  posterNameAr: string; // long – used in poster
  emoji: string;
  color: string;
  bgClass: string;      // tailwind bg for edit card
  items: PriceItem[];
}

/* ─────────────────────── data ─────────────────────── */
const INITIAL_CATEGORIES: Category[] = [
  {
    id: "vegetables",
    nameAr: "خضروات",
    posterNameAr: "الخضروات الطازجة",
    emoji: "🥦",
    color: "#4ade80",
    bgClass: "bg-green-950/40",
    items: [
      { id: "tomato",    nameAr: "طماطم بلدي",   emoji: "🍅", price: "", unit: "كيلو" },
      { id: "cucumber",  nameAr: "خيار بلدي",    emoji: "🥒", price: "", unit: "كيلو" },
      { id: "onion",     nameAr: "بصل أحمر",     emoji: "🧅", price: "", unit: "كيلو" },
      { id: "garlic",    nameAr: "ثوم بلدي",     emoji: "🧄", price: "", unit: "رأس"  },
      { id: "potato",    nameAr: "بطاطس تحمير",  emoji: "🥔", price: "", unit: "كيلو" },
      { id: "carrot",    nameAr: "جزر",          emoji: "🥕", price: "", unit: "كيلو" },
      { id: "pepper",    nameAr: "فلفل رومي",    emoji: "🫑", price: "", unit: "كيلو" },
      { id: "zucchini",  nameAr: "كوسة",         emoji: "🥒", price: "", unit: "كيلو" },
      { id: "eggplant",  nameAr: "باذنجان",      emoji: "🍆", price: "", unit: "كيلو" },
      { id: "molokhia",  nameAr: "ملوخية",       emoji: "🥬", price: "", unit: "كيلو" },
    ],
  },
  {
    id: "fruits",
    nameAr: "فواكه",
    posterNameAr: "الفواكه الموسمية",
    emoji: "🍊",
    color: "#fb923c",
    bgClass: "bg-orange-950/40",
    items: [
      { id: "banana",     nameAr: "موز بلدي",    emoji: "🍌", price: "", unit: "كيلو" },
      { id: "apple",      nameAr: "تفاح أحمر",   emoji: "🍎", price: "", unit: "كيلو" },
      { id: "orange",     nameAr: "برتقال",      emoji: "🍊", price: "", unit: "كيلو" },
      { id: "grapes",     nameAr: "عنب",         emoji: "🍇", price: "", unit: "كيلو" },
      { id: "mango",      nameAr: "مانجو عويس",  emoji: "🥭", price: "", unit: "كيلو" },
      { id: "watermelon", nameAr: "بطيخ",        emoji: "🍉", price: "", unit: "كيلو" },
      { id: "strawberry", nameAr: "فراولة",      emoji: "🍓", price: "", unit: "كيلو" },
      { id: "lemon",      nameAr: "ليمون",       emoji: "🍋", price: "", unit: "كيلو" },
    ],
  },
  {
    id: "meat",
    nameAr: "لحوم",
    posterNameAr: "اللحوم والمجمدات",
    emoji: "🥩",
    color: "#f87171",
    bgClass: "bg-red-950/40",
    items: [
      { id: "beef",       nameAr: "لحم بقري بلدي", emoji: "🥩", price: "", unit: "كيلو" },
      { id: "lamb",       nameAr: "لحم ضاني طازج", emoji: "🐑", price: "", unit: "كيلو" },
      { id: "liver_beef", nameAr: "كبدة بقري",     emoji: "🫀", price: "", unit: "كيلو" },
      { id: "kofta",      nameAr: "كفتة مشكلة",   emoji: "🍖", price: "", unit: "كيلو" },
      { id: "ribs",       nameAr: "ريش بقري",      emoji: "🍖", price: "", unit: "كيلو" },
    ],
  },
  {
    id: "chicken",
    nameAr: "دواجن",
    posterNameAr: "الدواجن والطيور",
    emoji: "🍗",
    color: "#fbbf24",
    bgClass: "bg-yellow-950/40",
    items: [
      { id: "whole_chicken",  nameAr: "دجاج أبيض كامل",    emoji: "🐔", price: "", unit: "كيلو" },
      { id: "chicken_breast", nameAr: "صدور دجاج (بانيه)", emoji: "🍗", price: "", unit: "كيلو" },
      { id: "chicken_thigh",  nameAr: "فخذ دجاج",         emoji: "🍗", price: "", unit: "كيلو" },
      { id: "chicken_wings",  nameAr: "جوانح دجاج",       emoji: "🍗", price: "", unit: "كيلو" },
      { id: "chicken_liver",  nameAr: "كبدة دجاج",        emoji: "🍗", price: "", unit: "كيلو" },
    ],
  },
  {
    id: "fish",
    nameAr: "أسماك",
    posterNameAr: "الأسماك والمأكولات البحرية",
    emoji: "🐟",
    color: "#22d3ee",
    bgClass: "bg-cyan-950/40",
    items: [
      { id: "tilapia",  nameAr: "سمك بلطي كبير",  emoji: "🐟", price: "", unit: "كيلو" },
      { id: "mullet",   nameAr: "سمك بوري",       emoji: "🐡", price: "", unit: "كيلو" },
      { id: "seabass",  nameAr: "سمك قاروص",      emoji: "🐟", price: "", unit: "كيلو" },
      { id: "sardine",  nameAr: "سردين طازج",     emoji: "🐠", price: "", unit: "كيلو" },
      { id: "shrimp",   nameAr: "جمبري",          emoji: "🍤", price: "", unit: "كيلو" },
      { id: "crab",     nameAr: "كابوريا",        emoji: "🦀", price: "", unit: "كيلو" },
    ],
  },
];

/* right-column categories (vegetables, fruits) */
const RIGHT_COL = ["vegetables", "fruits"];
/* left-column categories (meat, chicken, fish) */
const LEFT_COL  = ["meat", "chicken", "fish"];

const STORAGE_KEY = "taswiqa-daily-prices";

/* ─────────────────────── helpers ─────────────────────── */
function hexToRgb(hex: string, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ═══════════════════════ component ═══════════════════════ */
export default function DailyPricesPage() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const posterRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    moment.locale("ar");
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedPrices: Record<string, string> = JSON.parse(saved);
        setCategories((prev) =>
          prev.map((cat) => ({
            ...cat,
            items: cat.items.map((item) => ({
              ...item,
              price: savedPrices[item.id] ?? item.price,
            })),
          }))
        );
      }
    } catch {}
  }, []);

  const handlePriceChange = useCallback(
    (categoryId: string, itemId: string, value: string) => {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? { ...cat, items: cat.items.map((item) => (item.id === itemId ? { ...item, price: value } : item)) }
            : cat
        )
      );
    },
    []
  );

  const handleSave = () => {
    const out: Record<string, string> = {};
    categories.forEach((cat) => cat.items.forEach((item) => { out[item.id] = item.price; }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
    notification.success({ message: "تم حفظ الأسعار بنجاح", description: "يمكنك الآن تصدير الصورة للنشر على فيسبوك", placement: "topRight" });
  };

  const handleExport = async () => {
    if (!posterRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(posterRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#0d0820",
        scale: 2,
        logging: false,
        width: 1200,
      });
      const link = document.createElement("a");
      link.download = `أسعار-تسويقة-${moment().format("YYYY-MM-DD")}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
      notification.success({ message: "تم تصدير الصورة بنجاح", description: "يمكنك مشاركتها على فيسبوك الآن", placement: "topRight" });
    } catch {
      notification.error({ message: "حدث خطأ أثناء التصدير", placement: "topRight" });
    } finally {
      setIsExporting(false);
    }
  };

  const today = moment();
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  /* ── edit-view: one category as a list ── */
  const EditCategory = ({ cat }: { cat: Category }) => (
    <div className="rounded-xl overflow-hidden border border-border dark:border-outline-dark bg-white dark:bg-surface-mid">
      {/* header */}
      <div
        className="flex items-center gap-3 px-5 py-3 border-b-2"
        style={{ backgroundColor: isDark ? hexToRgb(cat.color, 0.08) : hexToRgb(cat.color, 0.06), borderBottomColor: cat.color }}
      >
        <span className="text-2xl">{cat.emoji}</span>
        <h2 className="text-lg font-bold" style={{ color: cat.color }}>{cat.nameAr}</h2>
        <span className="text-sm text-gray-400 font-medium">{cat.posterNameAr}</span>
      </div>

      {/* list rows */}
      <div className="divide-y divide-border dark:divide-outline-dark">
        {cat.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 dark:hover:bg-surface-low transition-colors">
            {/* emoji badge */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: hexToRgb(cat.color, 0.1) }}
            >
              {item.emoji}
            </div>

            {/* name */}
            <span className="flex-1 font-bold text-tittle dark:text-on-surface text-sm">
              {item.nameAr}
            </span>

            {/* dots */}
            <span className="flex-[2] border-b border-dashed border-gray-300 dark:border-gray-700 mx-2" />

            {/* price input */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <input
                type="number"
                value={item.price}
                onChange={(e) => handlePriceChange(cat.id, item.id, e.target.value)}
                placeholder="السعر"
                min="0"
                step="0.5"
                className="w-24 text-center rounded-lg border-2 border-border dark:border-outline-dark bg-transparent text-sm px-2 py-1.5 focus:outline-none dark:text-on-surface placeholder-gray-400 transition-colors font-bold"
                onFocus={(e) => { e.currentTarget.style.borderColor = cat.color; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = ""; }}
              />
              <span className="text-sm font-bold text-gray-500 dark:text-gray-400">ج.م</span>
            </div>

            {/* unit */}
            <span className="text-xs text-gray-400 dark:text-gray-500 w-12 text-center flex-shrink-0">
              {item.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── poster: one category section ── */
  const PosterCategory = ({ cat }: { cat: Category }) => (
    <div style={{ marginBottom: "20px" }}>
      {/* category title line */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <span style={{ fontSize: "22px" }}>{cat.emoji}</span>
        <span style={{ fontSize: "19px", fontWeight: "900", color: cat.color, whiteSpace: "nowrap" }}>
          {cat.posterNameAr}
        </span>
        <div style={{ flex: 1, height: "1px", backgroundColor: hexToRgb(cat.color, 0.25) }} />
      </div>

      {/* item rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {cat.items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#160c2a",
              borderRadius: "10px",
              padding: "10px 14px",
              border: `1px solid ${hexToRgb(cat.color, 0.12)}`,
            }}
          >
            {/* right: emoji + name */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  backgroundColor: hexToRgb(cat.color, 0.15),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  flexShrink: 0,
                }}
              >
                {item.emoji}
              </div>
              <span style={{ fontSize: "15px", fontWeight: "700", color: "#f1f0f5" }}>
                {item.nameAr}
              </span>
            </div>

            {/* left: price + unit */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "900",
                  color: item.price ? cat.color : "#44335a",
                }}
              >
                {item.price ? `${item.price} ج.م` : "—"}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "#5a4570",
                  backgroundColor: "#1e1035",
                  borderRadius: "6px",
                  padding: "2px 7px",
                  whiteSpace: "nowrap",
                }}
              >
                لكل {item.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ══════════════════════ render ══════════════════════ */
  return (
    <div className="flex flex-col w-full gap-6">

      {/* ── page header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-tittle dark:text-on-surface">{t.nav.dailyPrices}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{today.format("dddd، D MMMM YYYY")}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition-colors text-sm"
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            حفظ الأسعار
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-bold transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#542582" }}
          >
            {isExporting ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faCamera} />}
            {isExporting ? "جاري التصدير..." : "تصدير كصورة للفيسبوك"}
          </button>
        </div>
      </div>

      {/* ── editable list view ── */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <EditCategory key={cat.id} cat={cat} />
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          HIDDEN POSTER — off-screen, captured by html2canvas
          ════════════════════════════════════════════════════ */}
      <div style={{ position: "fixed", top: "-9999px", left: "-9999px", width: "1200px", pointerEvents: "none", zIndex: -1 }} aria-hidden>
        <div
          ref={posterRef}
          style={{
            width: "1200px",
            minHeight: "630px",
            backgroundColor: "#0d0820",
            fontFamily: "'Cairo', 'Arial', sans-serif",
            direction: "rtl",
            padding: "36px 44px 28px",
            boxSizing: "border-box",
          }}
        >

          {/* ── poster header ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>

            {/* Logo only — transparent background, no extra text */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logoo.png"
              alt=""
              style={{ height: "110px", objectFit: "contain" }}
            />

            {/* Date card (left side in RTL) */}
            <div
              style={{
                backgroundColor: "#1a0d30",
                borderRadius: "16px",
                padding: "18px 28px",
                textAlign: "center",
                border: "1px solid #2d1a4a",
                minWidth: "220px",
              }}
            >
              {/* day name in Arabic */}
              <div style={{ fontSize: "28px", fontWeight: "900", color: "#ffffff", lineHeight: 1.2 }}>
                {today.format("dddd")}
              </div>
              {/* date with Western numerals to avoid Arabic-Indic digits */}
              <div style={{ fontSize: "18px", fontWeight: "700", color: "#c4b5fd", marginTop: "4px" }}>
                {today.date()} {today.format("MMMM")} {today.year()}
              </div>
            </div>
          </div>

          {/* thin separator */}
          <div style={{ height: "1px", backgroundColor: "#2d1a4a", marginBottom: "24px" }} />

          {/* ── two-column category grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>

            {/* Right column: vegetables + fruits */}
            <div>
              {RIGHT_COL.map((id) => catMap[id] && <PosterCategory key={id} cat={catMap[id]} />)}
            </div>

            {/* Left column: meat + chicken + fish */}
            <div>
              {LEFT_COL.map((id) => catMap[id] && <PosterCategory key={id} cat={catMap[id]} />)}
            </div>
          </div>

          {/* ── footer ── */}
          <div
            style={{
              marginTop: "20px",
              backgroundColor: "#160c2a",
              borderRadius: "12px",
              padding: "14px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #2d1a4a",
            }}
          >
            {/* left: social hint */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", color: "#6b4f8a" }}>تابعونا للمزيد</span>
              <span style={{ fontSize: "18px" }}>👍</span>
              <span style={{ fontSize: "18px" }}>📤</span>
            </div>

            {/* center */}
            <span style={{ fontSize: "12px", color: "#44335a", textAlign: "center" }}>
              الأسعار قابلة للتغيير • جميع الأسعار بالجنيه المصري
            </span>

            {/* right: label */}
            <span style={{ fontSize: "12px", color: "#44335a" }}>
              هذا التصميم مخصص للنشر على فيسبوك (1200 × 630)
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
