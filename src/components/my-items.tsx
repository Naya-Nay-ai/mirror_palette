"use client";

import { useEffect, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { ShapePreview } from "./garment";
import {
  createMyItem,
  myItemSelection,
  type MyItem,
  type MyItemDraft,
  type MyItemSelection,
} from "@/lib/my-items";
import {
  loadMyItems,
  saveMyItems,
  MyItemsStorageError,
  type MyItemsSnapshot,
} from "@/lib/my-items-storage";
import { CATEGORY_LABELS, shapeName } from "@/lib/wardrobe";

export function MyItems({
  current,
  onUse,
}: {
  current: MyItemDraft;
  onUse: (selection: MyItemSelection) => void;
}) {
  const [snapshot, setSnapshot] = useState<MyItemsSnapshot | null>(null);
  const [ready, setReady] = useState(false);
  const [writeBlocked, setWriteBlocked] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const items = snapshot?.items ?? [];
  const canWrite = ready && snapshot !== null && !writeBlocked;
  const defaultName = `${shapeName(current.category, current.shape)} ${current.color}`;

  useEffect(() => {
    try {
      setSnapshot(loadMyItems(localStorage));
    } catch (cause) {
      setError(
        cause instanceof MyItemsStorageError &&
          cause.reason === "unsupported-version"
          ? "このバージョンのマイアイテムは読み込めません。保存データを保護するため、追加・削除を止めています。"
          : "マイアイテムを読み込めませんでした。保存データを保護するため、追加・削除を止めています。",
      );
    }
    setReady(true);
  }, []);

  function persist(next: MyItem[]) {
    if (!snapshot || !canWrite) return false;
    setNotice("");
    try {
      const updated = saveMyItems(localStorage, snapshot, next);
      setSnapshot(updated);
      setError("");
      return true;
    } catch (cause) {
      if (cause instanceof MyItemsStorageError && cause.reason === "changed") {
        setWriteBlocked(true);
        setError(
          "マイアイテムの保存データが別の画面で変更されています。上書きせずに止めました。ページを再読み込みしてね。",
        );
      } else {
        setError(
          "マイアイテムを保存できませんでした。ブラウザの保存設定や空き容量を確認してね。入力と一覧はこの画面に残っています。",
        );
      }
      return false;
    }
  }

  function add() {
    if (!canWrite) return;
    const entry = createMyItem(current, name, items);
    if (persist([entry, ...items])) {
      setName("");
      setNotice(`「${entry.name}」をマイアイテムに追加しました。`);
    }
  }

  return (
    <section
      className="my-items-section"
      id="my-items"
      aria-labelledby="my-items-heading"
    >
      <div className="saved-heading">
        <div>
          <h2 id="my-items-heading">マイアイテム</h2>
        </div>
        <span className="saved-total">{items.length}点</span>
      </div>
      <div className="my-items-add">
        <p className="my-items-current">
          <span
            className="mini-swatch"
            style={{ backgroundColor: current.color }}
            aria-hidden="true"
          />
          {CATEGORY_LABELS[current.category].ja} / {defaultName}
        </p>
        <label htmlFor="my-item-name">
          アイテムの名前 <span>任意</span>
        </label>
        <div className="my-items-add-row">
          <input
            id="my-item-name"
            value={name}
            maxLength={40}
            placeholder={defaultName}
            aria-describedby="my-item-name-hint"
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.nativeEvent.isComposing) {
                event.preventDefault();
                add();
              }
            }}
          />
          <button className="save-button" disabled={!canWrite} onClick={add}>
            <Plus size={17} aria-hidden="true" />
            この色・形をマイアイテムに追加
          </button>
        </div>
        <p className="my-items-hint" id="my-item-name-hint">
          空欄なら形の名前とHEXカラーで保存します。このブラウザに保存されます。
        </p>
      </div>
      <div className="my-items-feedback" aria-live="polite" aria-atomic="true">
        {error ? (
          <p className="my-items-error">{error}</p>
        ) : (
          notice && (
            <p>
              <Check size={16} aria-hidden="true" /> {notice}
            </p>
          )
        )}
      </div>
      {!ready ? (
        <p className="my-items-empty">マイアイテムを読み込み中…</p>
      ) : !snapshot ? null : items.length === 0 ? (
        <p className="my-items-empty">
          持っている服を、いま選んでいる色と形で追加できます。
        </p>
      ) : (
        <ul className="my-items-grid">
          {items.map((entry) => {
            const selection = myItemSelection(entry);
            return (
              <li className="my-item-card" key={entry.id}>
                <div className="my-item-summary">
                  {selection && (
                    <ShapePreview category={entry.category} shape={entry.shape} />
                  )}
                  <div>
                    <strong>{entry.name}</strong>
                    <p>
                      {CATEGORY_LABELS[entry.category].ja} /{" "}
                      {shapeName(entry.category, entry.shape) || entry.shape}
                    </p>
                    <span className="my-item-color">
                      <span
                        className="mini-swatch"
                        style={{ backgroundColor: entry.color }}
                        aria-hidden="true"
                      />
                      <code>{entry.color}</code>
                    </span>
                  </div>
                </div>
                {!selection && (
                  <p className="my-items-hint">
                    この形は現在使えません。アイテムは保存されています。
                  </p>
                )}
                <div className="my-item-actions">
                  <button
                    className="my-item-use"
                    disabled={!selection}
                    onClick={() => {
                      if (selection) {
                        onUse(selection);
                        setNotice(`「${entry.name}」をコーデに使いました。`);
                      }
                    }}
                  >
                    コーデに使う
                  </button>
                  {deleteId === entry.id ? (
                    <div className="my-item-delete-confirm">
                      <span>削除する？</span>
                      <button
                        disabled={!canWrite}
                        onClick={() => {
                          if (
                            persist(items.filter((item) => item.id !== entry.id))
                          ) {
                            setDeleteId(null);
                            setNotice(`「${entry.name}」を削除しました。`);
                          }
                        }}
                      >
                        削除
                      </button>
                      <button onClick={() => setDeleteId(null)}>戻る</button>
                    </div>
                  ) : (
                    <button
                      className="my-item-delete"
                      disabled={!canWrite}
                      aria-label={`${entry.name}を削除`}
                      onClick={() => setDeleteId(entry.id)}
                    >
                      <Trash2 size={14} aria-hidden="true" /> 削除
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
