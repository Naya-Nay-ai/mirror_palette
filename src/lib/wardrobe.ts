export const CATEGORIES = ["top", "bottom", "shoes"] as const;
export type Category = (typeof CATEGORIES)[number];
export const CATEGORY_LABELS = {
  top: { en: "Top", ja: "トップス" },
  bottom: { en: "Bottom", ja: "ボトムス" },
  shoes: { en: "Shoes", ja: "シューズ" },
} as const;

export const SHAPES = {
  top: [
    { id: "tee", name: "Tシャツ", detail: "クルーネック・半袖" },
    { id: "blouse", name: "ブラウス", detail: "開襟・ふんわり袖" },
    { id: "knit", name: "ニット", detail: "ハイネック・長袖" },
  ],
  bottom: [
    { id: "skirt", name: "スカート", detail: "Aライン・ミモレ丈" },
    { id: "straight", name: "ストレート", detail: "すっきりパンツ" },
    { id: "wide", name: "ワイド", detail: "ゆったりパンツ" },
  ],
  shoes: [
    { id: "pumps", name: "パンプス", detail: "ポインテッドトゥ" },
    { id: "sneakers", name: "スニーカー", detail: "ローカット" },
    { id: "boots", name: "ブーツ", detail: "ショート丈" },
  ],
} as const;

export type Look = {
  [K in Category]: { shape: (typeof SHAPES)[K][number]["id"]; color: string };
};
export type SavedLook = {
  id: string;
  name: string;
  savedAt: string;
  look: Look;
};

export const SAMPLE_LOOK: Look = {
  top: { shape: "blouse", color: "#F3EFE5" },
  bottom: { shape: "skirt", color: "#B98592" },
  shoes: { shape: "pumps", color: "#645047" },
};

export const PRESETS = [
  { name: "Black", color: "#27272B" },
  { name: "White", color: "#FFFFFF" },
  { name: "Ivory", color: "#F3EFE5" },
  { name: "Beige", color: "#CEB89D" },
  { name: "Gray", color: "#96969D" },
  { name: "Navy", color: "#333E59" },
  { name: "Brown", color: "#645047" },
  { name: "Red", color: "#B7474C" },
  { name: "Dusty Pink", color: "#B98592" },
  { name: "Lavender", color: "#B5A4CE" },
  { name: "Sage", color: "#91A792" },
  { name: "Mustard", color: "#C6A14E" },
] as const;

export const STORAGE_KEY = "mirror-palette:saved-looks:v1";

export function normalizeHex(value: string): string | null {
  const hex = value.trim().replace(/^#/, "");
  if (/^[0-9a-f]{6}$/i.test(hex)) return `#${hex.toUpperCase()}`;
  if (/^[0-9a-f]{3}$/i.test(hex))
    return `#${hex
      .split("")
      .map((c) => c + c)
      .join("")
      .toUpperCase()}`;
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function isLook(value: unknown): value is Look {
  if (!isRecord(value)) return false;
  return CATEGORIES.every((category) => {
    const item = value[category];
    return (
      isRecord(item) &&
      SHAPES[category].some((shape) => shape.id === item.shape) &&
      typeof item.color === "string" &&
      /^#[0-9a-f]{6}$/i.test(item.color)
    );
  });
}

// Unknown versions and damaged data are left untouched until an explicit save.
export function readSavedLooks(raw: string | null): SavedLook[] {
  if (!raw) return [];
  const data: unknown = JSON.parse(raw);
  if (!isRecord(data) || data.version !== 1 || !Array.isArray(data.looks))
    throw new Error("invalid-storage");
  const ids = new Set<string>();
  if (
    !data.looks.every((item: unknown) => {
      if (
        !isRecord(item) ||
        typeof item.id !== "string" ||
        !item.id ||
        ids.has(item.id) ||
        typeof item.name !== "string" ||
        typeof item.savedAt !== "string" ||
        !isLook(item.look)
      )
        return false;
      ids.add(item.id);
      return true;
    })
  )
    throw new Error("invalid-look");
  return data.looks as SavedLook[];
}

export function colorName(color: string): string {
  return (
    PRESETS.find((preset) => preset.color === color.toUpperCase())?.name ??
    "Custom color"
  );
}

export function shapeName(category: Category, shape: string): string {
  return SHAPES[category].find((item) => item.id === shape)?.name ?? "";
}

export function inkFor(color: string): string {
  const channels = [1, 3, 5]
    .map((offset) => parseInt(color.slice(offset, offset + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722 >
    0.25
    ? "#514A53"
    : "#FFFFFF";
}
