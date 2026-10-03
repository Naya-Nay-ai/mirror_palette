import {
  CATEGORIES,
  SHAPES,
  normalizeHex,
  type Category,
  type Look,
} from "@/lib/wardrobe";

export type MyItem = {
  id: string;
  category: Category;
  shape: string;
  color: string;
  name: string;
  favorite: boolean;
};

export type MyItemSelection = {
  [K in Category]: { category: K } & Look[K];
}[Category];

export type MyItemDraft = Pick<MyItem, "category" | "shape" | "color">;

// Validate stored fields independently of the catalog so retired shapes survive.
export function isMyItem(value: unknown): value is MyItem {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    item.id.trim().length > 0 &&
    CATEGORIES.some((category) => category === item.category) &&
    typeof item.shape === "string" &&
    item.shape.trim().length > 0 &&
    typeof item.color === "string" &&
    /^#[0-9a-f]{6}$/i.test(item.color) &&
    typeof item.name === "string" &&
    item.name.trim().length > 0 &&
    typeof item.favorite === "boolean"
  );
}

export function myItemSelection(item: MyItem): MyItemSelection | null {
  if (!SHAPES[item.category].some((shape) => shape.id === item.shape))
    return null;
  // The catalog check above narrows the persisted string to a renderable shape.
  return {
    category: item.category,
    shape: item.shape,
    color: item.color,
  } as MyItemSelection;
}

export function createMyItem(
  draft: MyItemDraft,
  name: string,
  existing: readonly MyItem[],
): MyItem {
  const shape = SHAPES[draft.category].find((item) => item.id === draft.shape);
  const color = normalizeHex(draft.color);
  if (!shape || !color) throw new Error("invalid-my-item-selection");

  const base = `item-${
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
  }`;
  const ids = new Set(existing.map((item) => item.id));
  let id = base;
  let suffix = 1;
  while (ids.has(id)) id = `${base}-${suffix++}`;

  return {
    id,
    category: draft.category,
    shape: draft.shape,
    color,
    name: name.trim().slice(0, 40) || `${shape.name} ${color}`,
    favorite: false,
  };
}
