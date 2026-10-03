import { isMyItem, type MyItem } from "@/lib/my-items";

export const MY_ITEMS_STORAGE_KEY = "mirror-palette:my-items:v1";
export const MY_ITEMS_VERSION = 1;

export class MyItemsStorageError extends Error {
  constructor(
    public readonly reason: "invalid-data" | "unsupported-version" | "changed",
  ) {
    super(reason);
    this.name = "MyItemsStorageError";
  }
}

export type MyItemsSnapshot = {
  items: MyItem[];
  raw: string | null;
};

export function readMyItems(raw: string | null): MyItem[] {
  if (raw === null) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new MyItemsStorageError("invalid-data");
  }
  if (data === null || typeof data !== "object" || Array.isArray(data))
    throw new MyItemsStorageError("invalid-data");
  const record = data as Record<string, unknown>;
  if (record.version !== MY_ITEMS_VERSION)
    throw new MyItemsStorageError("unsupported-version");
  if (!Array.isArray(record.items))
    throw new MyItemsStorageError("invalid-data");

  const ids = new Set<string>();
  const items: MyItem[] = [];
  for (const item of record.items) {
    if (!isMyItem(item) || ids.has(item.id))
      throw new MyItemsStorageError("invalid-data");
    ids.add(item.id);
    items.push({
      id: item.id,
      category: item.category,
      shape: item.shape,
      color: item.color,
      name: item.name,
      favorite: item.favorite,
    });
  }
  return items;
}

export function loadMyItems(
  storage: Pick<Storage, "getItem">,
): MyItemsSnapshot {
  const raw = storage.getItem(MY_ITEMS_STORAGE_KEY);
  return { raw, items: readMyItems(raw) };
}

export function saveMyItems(
  storage: Pick<Storage, "getItem" | "setItem">,
  previous: MyItemsSnapshot,
  next: MyItem[],
): MyItemsSnapshot {
  readMyItems(previous.raw);
  // Refuse to overwrite a value changed since this page loaded or last saved.
  if (storage.getItem(MY_ITEMS_STORAGE_KEY) !== previous.raw)
    throw new MyItemsStorageError("changed");
  const raw = JSON.stringify({ version: MY_ITEMS_VERSION, items: next });
  const items = readMyItems(raw);
  storage.setItem(MY_ITEMS_STORAGE_KEY, raw);
  // Callers update visible state only after setItem has succeeded.
  return { raw, items };
}
